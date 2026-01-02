import { OrderModel } from '@src/models/Order';
import { producer } from '@src/lib/kafka';
import HTTP_STATUS_CODES from '@src/common/constants/HTTP_STATUS_CODES';
import { RouteError } from '@src/common/util/route-errors';
import { CreateOrderInput } from '@src/types/CreateOrderInput';
import { calculateFinalOrderPrice } from '@src/domain/pricing/CalculateFinalPrice';

export const createOrder = async (input: CreateOrderInput) => {
  if (!input.items.length) {
    throw new RouteError(
      HTTP_STATUS_CODES.BadRequest,
      'Order must contain at least one item',
    );
  }

  const totalPrice = calculateFinalOrderPrice(input.items, {
    location: input.location,
    orderDate: new Date(),
  });

  const order = await OrderModel.create({
    status: 'PENDING',
    items: input.items,
    totalPrice,
  });

  await producer.send({
    topic: 'order.created',
    messages: [
      {
        value: JSON.stringify({
          orderId: order.id,
          products: input.items,
          totalPrice,
        }),
      },
    ],
  });

  return order;
};
