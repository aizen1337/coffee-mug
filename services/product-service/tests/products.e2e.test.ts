import './kafka.mock'
import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '@src/server';
import HTTP_STATUS_CODES from '@src/common/constants/HTTP_STATUS_CODES';
import { ProductModel } from '@src/models/Product';

describe('Product API', () => {
  describe('POST /api/products', () => {
    it('creates a product', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'Coffee',
          description: 'Dark roast',
          price: 12.5,
          stock: 10,
        });

      expect(res.status).toBe(HTTP_STATUS_CODES.Created);

      const products = await ProductModel.find();
      expect(products).toHaveLength(1);
      expect(products[0].name).toBe('Coffee');
    });

    it('fails validation for invalid payload', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: '',
          price: -5,
        });

      expect(res.status).toBe(HTTP_STATUS_CODES.BadRequest);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.message).toBe('Validation failed');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.details.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/products', () => {
    it('returns product list', async () => {
      await ProductModel.create({
        name: 'Latte',
        description: 'Milk coffee',
        price: 5,
        stock: 20,
      });

      const res = await request(app).get('/api/products');

      expect(res.status).toBe(HTTP_STATUS_CODES.Ok);
      expect(res.body).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body[0].name).toBe('Latte');
    });
  });

  describe('POST /api/products/:id/restock', () => {
    it('restocks a product', async () => {
      const product = await ProductModel.create({
        name: 'Espresso',
        description: 'Strong',
        price: 3,
        stock: 5,
      });

      const res = await request(app)
        .post(`/api/products/${product.id}/restock`)
        .send({ amount: 5 });

      expect(res.status).toBe(HTTP_STATUS_CODES.Ok);

      const updated = await ProductModel.findById(product.id);
      expect(updated?.stock).toBe(10);
    });

    it('fails on invalid amount', async () => {
      const product = await ProductModel.create({
        name: 'Mocha',
        description: 'Chocolate',
        price: 6,
        stock: 5,
      });

      const res = await request(app)
        .post(`/api/products/${product.id}/restock`)
        .send({ amount: -3 });

      expect(res.status).toBe(HTTP_STATUS_CODES.BadRequest);
    });
  });

  describe('POST /api/products/:id/sell', () => {
    it('sells product stock', async () => {
      const product = await ProductModel.create({
        name: 'Americano',
        description: 'Watered espresso',
        price: 4,
        stock: 8,
      });

      const res = await request(app)
        .post(`/api/products/${product.id}/sell`)
        .send({ amount: 3 });

      expect(res.status).toBe(HTTP_STATUS_CODES.Ok);

      const updated = await ProductModel.findById(product.id);
      expect(updated?.stock).toBe(5);
    });

    it('fails when stock is insufficient', async () => {
      const product = await ProductModel.create({
        name: 'Flat White',
        description: 'Smooth',
        price: 5,
        stock: 2,
      });

      const res = await request(app)
        .post(`/api/products/${product.id}/sell`)
        .send({ amount: 10 });

      expect(res.status).toBe(HTTP_STATUS_CODES.BadRequest);
    });
  });
});
