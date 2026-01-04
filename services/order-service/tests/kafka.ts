import { OrderModel } from '@src/models/Order';
import { Kafka, Partitioners } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'order-test-service',
  brokers: ['localhost:9092'],
});

export const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
export const consumer = kafka.consumer({ groupId: 'order-test-group' });

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
