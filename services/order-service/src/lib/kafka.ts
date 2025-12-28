import { Kafka, Partitioners } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['coffee_kafka:9092'],
});

export const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
export const consumer = kafka.consumer({ groupId: 'order-group' });
