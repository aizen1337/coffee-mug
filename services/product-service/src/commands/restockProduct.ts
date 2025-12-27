import { producer } from '@src/lib/kafka';
import { ProductModel } from '@src/models/Product';

export const restockProduct = async (
  productId: string,
  amount: number,
) => {
  if (amount <= 0) {
    throw new Error('Invalid restock amount');
  }

  const product = await ProductModel.findById(productId);
  if (!product) throw new Error('Product not found');

  product.stock += amount;
  await product.save();

  await producer.send({
    topic: 'stock.updated',
    messages: [
      {
        value: JSON.stringify({
          productId,
          stock: product.stock,
        }),
      },
    ],
  });
};
