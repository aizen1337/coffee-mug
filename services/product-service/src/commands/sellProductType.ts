import HTTP_STATUS_CODES from '@src/common/constants/HTTP_STATUS_CODES';
import { RouteError } from '@src/common/util/route-errors';
import { ProductModel } from '@src/models/Product';
import { producer } from '@src/lib/kafka';

export const sellProductType = async (
  productTypeId: string,
  amount: number,
): Promise<void> => {
  if (amount <= 0) {
    throw new RouteError(
      HTTP_STATUS_CODES.BadRequest,
      'Invalid sell amount',
    );
  }

  /**
   * 1. Check available stock
   */
  const available = await ProductModel.countDocuments({
    productTypeId,
  });

  if (available < amount) {
    throw new RouteError(
      HTTP_STATUS_CODES.BadRequest,
      'Insufficient stock',
    );
  }

  /**
   * 2. Select concrete product instances to sell
   */
  const productsToSell = await ProductModel
    .find({ productTypeId })
    .limit(amount)
    .select('_id')
    .lean();

  const ids = productsToSell.map(p => p._id);

  /**
   * 3. Delete them (consume stock)
   */
  await ProductModel.deleteMany({
    _id: { $in: ids },
  });

  /**
   * 4. Emit event (optional but recommended)
   */
  await producer.send({
    topic: 'stock.updated',
    messages: [
      {
        value: JSON.stringify({
          productTypeId,
          sold: amount,
        }),
      },
    ],
  });
};
