// src/commands/restockProductType.ts
import { ProductModel } from '@src/models/Product';

export const restockProductType = async (
  productTypeId: string,
  amount: number,
) => {
  if (amount <= 0) {
    throw new Error('Invalid restock amount');
  }

  const docs = Array.from({ length: amount }).map(() => ({
    productTypeId,
  }));

  await ProductModel.insertMany(docs);
};
