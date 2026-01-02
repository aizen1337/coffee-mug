import './kafka.mock';
import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '@src/server';
import HTTP_STATUS_CODES from '@src/common/constants/HTTP_STATUS_CODES';
import { ProductTypeModel } from '@src/models/ProductType';
import { ProductModel } from '@src/models/Product';

describe('ProductType API', () => {
  describe('POST /products', () => {
    it('creates a product type', async () => {
      const res = await request(app)
        .post('/products')
        .send({
          name: 'Coffee',
          category: 'BEVERAGE',
          price: 12.5,
        });

      expect(res.status).toBe(HTTP_STATUS_CODES.Created);

      const types = await ProductTypeModel.find();
      expect(types).toHaveLength(1);
      expect(types[0].name).toBe('Coffee');
    });

    it('fails validation for invalid payload', async () => {
      const res = await request(app)
        .post('/products')
        .send({
          name: '',
          price: -5,
        });

      expect(res.status).toBe(HTTP_STATUS_CODES.BadRequest);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.message).toBe('Validation failed');
    });
  });

  describe('GET /products', () => {
    it('returns product types with available stock', async () => {
      const type = await ProductTypeModel.create({
        name: 'Latte',
        category: 'BEVERAGE',
        price: 5,
      });

      // create 3 product instances
      await ProductModel.create([
        { productTypeId: type.id },
        { productTypeId: type.id },
        { productTypeId: type.id },
      ]);

      const res = await request(app).get('/products');

      expect(res.status).toBe(HTTP_STATUS_CODES.Ok);
      expect(res.body).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body[0].available).toBe(3);
    });
  });

  describe('POST /products/:id/restock', () => {
    it('restocks a product type by creating products', async () => {
      const type = await ProductTypeModel.create({
        name: 'Espresso',
        category: 'BEVERAGE',
        price: 3,
      });

      const res = await request(app)
        .post(`/products/${type.id}/restock`)
        .send({ amount: 5 });

      expect(res.status).toBe(HTTP_STATUS_CODES.Ok);

      const count = await ProductModel.countDocuments({
        productTypeId: type.id,
      });

      expect(count).toBe(5);
    });

    it('fails on invalid amount', async () => {
      const type = await ProductTypeModel.create({
        name: 'Mocha',
        category: 'BEVERAGE',
        price: 6,
      });

      const res = await request(app)
        .post(`/products/${type.id}/restock`)
        .send({ amount: -3 });

      expect(res.status).toBe(HTTP_STATUS_CODES.BadRequest);
    });
  });

  describe('POST /products/:id/sell', () => {
    it('sells products by deleting instances', async () => {
      const type = await ProductTypeModel.create({
        name: 'Americano',
        category: 'BEVERAGE',
        price: 4,
      });

      await ProductModel.create([
        { productTypeId: type.id },
        { productTypeId: type.id },
        { productTypeId: type.id },
      ]);

      const res = await request(app)
        .post(`/products/${type.id}/sell`)
        .send({ amount: 2 });

      expect(res.status).toBe(HTTP_STATUS_CODES.Ok);

      const remaining = await ProductModel.countDocuments({
        productTypeId: type.id,
      });

      expect(remaining).toBe(1);
    });

    it('fails when stock is insufficient', async () => {
      const type = await ProductTypeModel.create({
        name: 'Flat White',
        category: 'BEVERAGE',
        price: 5,
      });

      await ProductModel.create([
        { productTypeId: type.id },
        { productTypeId: type.id },
      ]);

      const res = await request(app)
        .post(`/products/${type.id}/sell`)
        .send({ amount: 10 });

      expect(res.status).toBe(HTTP_STATUS_CODES.BadRequest);
    });
  });
});
