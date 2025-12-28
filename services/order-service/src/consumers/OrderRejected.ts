import { consumer } from '@src/lib/kafka';
import { OrderModel } from '@src/models/Order';

interface OrderRejectedEvent {
  orderId: string;
}

export const startOrderRejectedConsumer = async () => {
  await consumer.subscribe({
    topic: 'order.rejected',
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const event = JSON.parse(message.value.toString()) as OrderRejectedEvent;

      await OrderModel.findByIdAndUpdate(event.orderId, {
        status: 'REJECTED',
      });
    },
  });
};
