import { consumer } from '@src/lib/kafka';
import { OrderModel } from '@src/models/Order';

interface StockUpdatedEvent {
  orderId: string;
}

export const startStockUpdatedConsumer = async () => {
  await consumer.subscribe({
    topic: 'stock.updated',
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const event = JSON.parse(message.value.toString()) as StockUpdatedEvent;

      await OrderModel.findByIdAndUpdate(event.orderId, {
        status: 'APPROVED',
      });
    },
  });
};
