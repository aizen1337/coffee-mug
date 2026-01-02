import { consumer, producer } from '@src/lib/kafka';
import { ProductModel } from '@src/models/Product';
import mongoose from 'mongoose';

interface OrderCreatedEvent {
  orderId: string;
  products: {
    productTypeId: string;
    quantity: number;
  }[];
}

export const startOrderCreatedConsumer = async () => {
  await consumer.connect();
  await producer.connect();

  await consumer.subscribe({
    topic: 'order.created',
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const event = JSON.parse(
        message.value.toString(),
      ) as OrderCreatedEvent;

      const { orderId, products } = event;

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const productTypeIds = products.map(p => p.productTypeId);

        /**
         * 1. Aggregate stock in ONE query
         */
        const stock = await ProductModel.aggregate<{
          _id: string;
          available: number;
        }>([
          {
            $match: {
              productTypeId: { $in: productTypeIds },
            },
          },
          {
            $group: {
              _id: '$productTypeId',
              available: { $sum: 1 },
            },
          },
        ]).session(session);

        const stockMap = new Map(
          stock.map(s => [s._id, s.available]),
        );

        /**
         * 2. Validate availability
         */
        for (const item of products) {
          const available = stockMap.get(item.productTypeId) ?? 0;

          if (available < item.quantity) {
            await producer.send({
              topic: 'order.rejected',
              messages: [
                {
                  value: JSON.stringify({
                    orderId,
                    reason: 'INSUFFICIENT_STOCK',
                  }),
                },
              ],
            });

            await session.abortTransaction();
            return;
          }
        }

        /**
         * 3. Consume stock (deterministic deletes)
         */
        for (const item of products) {
          const docs = await ProductModel
            .find({ productTypeId: item.productTypeId })
            .limit(item.quantity)
            .select('_id')
            .session(session)
            .lean();

          const ids = docs.map(d => d._id);

          await ProductModel.deleteMany(
            { _id: { $in: ids } },
            { session },
          );
        }

        /**
         * 4. Commit transaction
         */
        await session.commitTransaction();

        /**
         * 5. Emit success event
         */
        await producer.send({
          topic: 'stock.updated',
          messages: [
            {
              value: JSON.stringify({
                orderId,
                products,
              }),
            },
          ],
        });
      } catch (err) {
        await session.abortTransaction();
        throw err;
      } finally {
        session.endSession();
      }
    },
  });
};
