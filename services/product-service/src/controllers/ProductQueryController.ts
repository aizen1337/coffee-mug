import { Request, Response } from 'express';
import HTTP_STATUS_CODES from '@src/common/constants/HTTP_STATUS_CODES';
import { getProducts } from '../queries/getProducts';

export const list = async (_req: Request, res: Response) => {
  const products = await getProducts();
  res.status(HTTP_STATUS_CODES.Ok).json(products);
};
