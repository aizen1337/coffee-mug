import { consumer, producer } from '@src/lib/kafka';
import { ProductModel } from '@src/models/Product';

interface OrderCreatedEvent {
  orderId: string;
  products: {
    productId: string,
    quantity: number,
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

      const event = JSON.parse(message.value.toString()) as OrderCreatedEvent;

      // 1. Check stock for all items
      for (const item of event.products) {
        const product = await ProductModel.findById(item.productId);

        if (!product || product.stock < item.quantity) {
          await producer.send({
            topic: 'order.rejected',
            messages: [
              {
                value: JSON.stringify({
                  orderId: event.orderId,
                  reason: 'INSUFFICIENT_STOCK',
                }),
              },
            ],
          });
          return;
        }
      }

      // 2. Deduct stock (safe path)
      for (const item of event.products) {
        await ProductModel.updateOne(
          { _id: item.productId },
          { $inc: { stock: -item.quantity } },
        );
      }

      // 3. Emit stock.updated
      await producer.send({
        topic: 'stock.updated',
        messages: [
          {
            value: JSON.stringify({
              orderId: event.orderId,
              products: event.products,
            }),
          },
        ],
      });
    },
  });
};
