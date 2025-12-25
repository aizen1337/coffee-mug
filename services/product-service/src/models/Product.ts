import { Schema, model } from 'mongoose';

export const ProductSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 50 },
    description: { type: String, required: true, maxlength: 50 },
    price: { type: Number, required: true, min: 0.01 },
    stock: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

export const ProductModel = model('Product', ProductSchema);
