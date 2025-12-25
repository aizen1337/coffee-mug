import { ProductModel } from '../models/Product';

export const getProducts = async () => {
  return ProductModel.find().lean();
};
