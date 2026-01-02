import request from 'supertest';
import app from '@src/server';

describe('Order validation', () => {
  it('fails when quantity is invalid', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        customer: 'john',
        location: 'US',
        items: [
          {
            productId: 'x',
            quantity: 0,
            unitPrice: 10,
            category: 'COFFEE',
          },
        ],
      });

    expect(res.status).toBe(400);
  });
});
