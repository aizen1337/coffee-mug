import { Request, Response } from 'express';
import HTTP_STATUS_CODES from '@src/common/constants/HTTP_STATUS_CODES';
import { createOrder } from '@src/commands/createOrder';
import { CreateOrderInput } from '@src/types/CreateOrderInput';

export const create = async (req: Request, res: Response) => {
  const order = await createOrder(req.body as unknown as CreateOrderInput);
  res.status(HTTP_STATUS_CODES.Created).json(order);
};
