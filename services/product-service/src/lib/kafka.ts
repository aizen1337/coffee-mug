import { Kafka, Partitioners } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'product-service',
  brokers: [process.env.KAFKA_BROKER!],
});

export const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
export const consumer = kafka.consumer({ groupId: 'product-group' });
