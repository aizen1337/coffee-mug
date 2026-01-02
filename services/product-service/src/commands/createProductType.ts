// src/commands/createProductType.ts
import { ProductTypeModel } from '@src/models/ProductType';

export const createProductType = async (input: {
  name: string;
  category: string;
  price: number;
}) => {
  return ProductTypeModel.create(input);
};
