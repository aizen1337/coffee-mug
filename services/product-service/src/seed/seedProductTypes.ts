import { ProductTypeModel } from '@src/models/ProductType';

export interface SeededProductType {
  _id: string;
  name: string;
}

export const seedProductTypes = async (): Promise<SeededProductType[]> => {
  const data = [
    {
      name: 'Espresso',
      category: 'BEVERAGE',
      price: 3,
    },
    {
      name: 'Latte',
      category: 'BEVERAGE',
      price: 5,
    },
    {
      name: 'Cappuccino',
      category: 'BEVERAGE',
      price: 4.5,
    },
  ];

  // idempotent seed
  await ProductTypeModel.deleteMany({});

  const created = await ProductTypeModel.insertMany(data);

  return created.map(t => ({
    _id: t._id.toString(),
    name: t.name,
  }));
};
