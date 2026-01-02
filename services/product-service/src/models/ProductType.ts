// src/models/ProductType.ts
import { Schema, model } from 'mongoose';

const ProductTypeSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
});

export const ProductTypeModel = model(
  'ProductType',
  ProductTypeSchema,
);
