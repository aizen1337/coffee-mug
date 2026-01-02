// src/models/Product.ts
import { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
  productTypeId: {
    type: Schema.Types.ObjectId,
    ref: 'ProductType',
    required: true,
    index: true,
  },
});

export const ProductModel = model('Product', ProductSchema);
