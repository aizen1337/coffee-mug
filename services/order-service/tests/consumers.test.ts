import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OrderModel } from '@src/models/Order';
import { startStockUpdatedConsumer } from '@src/consumers/stockUpdated';
import { startOrderRejectedConsumer } from '@src/consumers/OrderRejected';
import { consumer } from './kafka.mock';

describe('Kafka Consumers', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await OrderModel.deleteMany({});
  });

  it('approves order on stock.updated', async () => {
    const order = await OrderModel.create({
      status: 'PENDING',
      items: [],
      totalPrice: 10,
    });

    await startStockUpdatedConsumer();

    await consumer.__emit({
      orderId: order.id,
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

    await consumer.__emit({
      orderId: order.id,
    });

    const updated = await OrderModel.findById(order.id);
    expect(updated?.status).toBe('REJECTED');
  });
});
