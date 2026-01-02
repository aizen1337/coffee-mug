// src/queries/getProductTypeStock.ts
import { ProductModel } from '@src/models/Product';

export const getProductTypeStock = async (
  productTypeId: string,
): Promise<number> => {
  return ProductModel.countDocuments({ productTypeId });
};
