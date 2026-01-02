import { ProductModel } from '@src/models/Product';
import { SeededProductType } from './seedProductTypes';

export const seedProducts = async (
  productTypes: SeededProductType[],
) => {
  await ProductModel.deleteMany({});

  const docs = productTypes.flatMap(type =>
    Array.from({ length: 10 }).map(() => ({
      productTypeId: type._id,
    })),
  );

  await ProductModel.insertMany(docs);
};
