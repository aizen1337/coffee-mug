// src/queries/getProductTypes.ts
import { ProductTypeModel } from '@src/models/ProductType';
import { ProductModel } from '@src/models/Product';

interface StockAggregationResult {
  _id: unknown; // ObjectId
  available: number;
}

export const getProductTypes = async () => {
  const stock = await ProductModel.aggregate<StockAggregationResult>([
    {
      $group: {
        _id: '$productTypeId',
        available: { $sum: 1 },
      },
    },
  ]);

  const stockMap = new Map<string, number>(
    stock.map(s => [String(s._id), s.available]),
  );

  const types = await ProductTypeModel.find().lean();

  return types.map(t => ({
    id: t._id.toString(),
    name: t.name,
    category: t.category,
    price: t.price,
    available: stockMap.get(t._id.toString()) ?? 0,
  }));
};
