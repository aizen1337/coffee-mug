import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OrderModel } from '@src/models/Order';
import { producer, consumer, startStockUpdatedConsumer, startOrderRejectedConsumer } from './kafka';

describe('Kafka Consumers', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await OrderModel.deleteMany({});
    await producer.disconnect();
    await consumer.disconnect();
    await consumer.connect();
    await producer.connect();
  });

  it('approves order on stock.updated', async () => {
    const order = await OrderModel.create({
      status: 'PENDING',
      items: [],
      totalPrice: 10,
    });

    await startStockUpdatedConsumer();

    await producer.send({
      topic: 'stock.updated',
      messages: [
        {
          value: JSON.stringify({ orderId: order.id }),
        },
      ],
    });

    const updated = await OrderModel.findById(order.id);
    expect(updated?.status).toBe('APPROVED');
  });

  it('rejects order on order.rejected', async () => {
    const order = await OrderModel.create({
      status: 'PENDING',
      items: [],
      totalPrice: 10,
    });

    await startOrderRejectedConsumer();

    await producer.send({
      topic: 'order.rejected',
      messages: [
        {
          value: JSON.stringify({ orderId: order.id }),
        },
      ],
    });

    const updated = await OrderModel.findById(order.id);
    expect(updated?.status).toBe('REJECTED');
  });
});
