import { Request, Response } from 'express';
import HTTP_STATUS_CODES from '@src/common/constants/HTTP_STATUS_CODES';
import { createProduct } from '../commands/createProduct';
import { ParamsDictionary } from 'express-serve-static-core';
import { restockProduct } from '../commands/restockProduct';
import { sellProduct } from '../commands/sellProduct';
import {
  CreateProductBody,
  StockChangeBody,
} from '../types/ProductRequests';

export const create = async (
  req: Request<ParamsDictionary, unknown, CreateProductBody>,
  res: Response
) => {
  await createProduct(req.body);
  res.status(HTTP_STATUS_CODES.Created).send();
};

export const restock = async (
  req: Request<ParamsDictionary, unknown, StockChangeBody>,
  res: Response
) => {
  const { id } = req.params;

  if (!id) {
    res.status(HTTP_STATUS_CODES.BadRequest).json({ message: 'Missing product id' });
    return;
  }

  await restockProduct(id, req.body.amount);
  res.status(HTTP_STATUS_CODES.Ok).send();
};

export const sell = async (
  req: Request<ParamsDictionary, unknown, StockChangeBody>,
  res: Response
) => {
  const { id } = req.params;

  if (!id) {
    res.status(HTTP_STATUS_CODES.BadRequest).json({ message: 'Missing product id' });
    return;
  }

  await sellProduct(id, req.body.amount);
  res.status(HTTP_STATUS_CODES.Ok).send();
};
