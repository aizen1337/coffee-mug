import HTTP_STATUS_CODES from '@src/common/constants/HTTP_STATUS_CODES';
import { RouteError } from '@src/common/util/route-errors';
import { producer } from '@src/lib/kafka';
import { ProductModel } from '@src/models/Product';

export const sellProduct = async (
  productId: string,
  amount: number,
) => {
  if (amount <= 0) {
    throw new RouteError(
      HTTP_STATUS_CODES.BadRequest,
      'Invalid sell amount',
    );
  }

  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new RouteError(
      HTTP_STATUS_CODES.NotFound,
      'Product not found',
    );
  }

  if (product.stock < amount) {
    throw new RouteError(
      HTTP_STATUS_CODES.BadRequest,
      'Insufficient stock',
    );
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
