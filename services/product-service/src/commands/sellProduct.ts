import { producer } from '@src/lib/kafka';
import { ProductModel } from '@src/models/Product';

export const sellProduct = async (
  productId: string,
  amount: number,
) => {
  if (amount <= 0) {
    throw new Error('Invalid sell amount');
  }

  const product = await ProductModel.findById(productId);
  if (!product) throw new Error('Product not found');

  if (product.stock - amount < 0) {
    throw new Error('Insufficient stock');
  }

  product.stock -= amount;
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
