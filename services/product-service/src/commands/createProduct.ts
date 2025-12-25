import { producer } from '@src/lib/kafka';
import { ProductModel } from '@src/models/Product';

export const createProduct = async (input: {
  name: string,
  description: string,
  price: number,
  stock: number,
}) => {
  if (input.price <= 0) {
    throw new Error('Price must be positive');
  }

  const product = await ProductModel.create(input);

  await producer.send({
    topic: 'product.created',
    messages: [
      {
        value: JSON.stringify({
          productId: product._id,
          price: product.price,
        }),
      },
    ],
  });
};
