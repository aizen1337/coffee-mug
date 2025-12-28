import { Request, Response } from 'express';
import HTTP_STATUS_CODES from '@src/common/constants/HTTP_STATUS_CODES';
import { OrderModel } from '@src/models/Order';

export const list = async (_: Request, res: Response) => {
  const orders = await OrderModel.find().lean();
  res.status(HTTP_STATUS_CODES.Ok).json(orders);
};
