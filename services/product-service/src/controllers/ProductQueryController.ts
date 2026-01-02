import { Request, Response } from 'express';
import HTTP_STATUS_CODES from '@src/common/constants/HTTP_STATUS_CODES';
import { getProductTypes } from '@src/queries/getProductTypes';

export const list = async (_req: Request, res: Response) => {
  const productTypes = await getProductTypes();
  res.status(HTTP_STATUS_CODES.Ok).json(productTypes);
};
