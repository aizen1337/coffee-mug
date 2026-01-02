import request from 'supertest';
import app from '@src/server';
import { OrderModel } from '@src/models/Order';
import { producer } from '@src/lib/kafka';
import { describe, it, expect, vi } from 'vitest';

interface CreateOrderResponse {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  totalPrice: number;
}

describe('Order API', () => {
  describe('POST /api/orders', () => {
    it('creates an order and emits order.created event', async () => {
      const sendSpy = vi.spyOn(producer, 'send');

      const res = await request(app)
        .post('/api/orders')
        .send({
          customer: 'john',
          location: 'US',
          items: [
            {
              productId: 'coffee-1',
              quantity: 2,
              unitPrice: 10,
              category: 'COFFEE',
            },
          ],
        });

      expect(res.status).toBe(201);

      const body = res.body as CreateOrderResponse;
      expect(body.status).toBe('PENDING');
      expect(body.totalPrice).toBe(20);

      const order = await OrderModel.findOne();
      expect(order).not.toBeNull();

      expect(sendSpy).toHaveBeenCalledOnce();
      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'order.created',
        }),
      );
    });

    it('rejects empty order', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          customer: 'john',
          location: 'US',
          items: [],
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/orders', () => {
    it('returns all orders', async () => {
      await OrderModel.create({
        status: 'PENDING',
        items: [{ productId: 'x', quantity: 1 }],
        totalPrice: 10,
      });

      const res = await request(app).get('/api/orders');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.length).toBe(1);
    });
  });
});
