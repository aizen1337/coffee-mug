// src/controllers/productTypeCommandController.ts
import { Request, Response } from 'express';
import HTTP_STATUS_CODES from '@src/common/constants/HTTP_STATUS_CODES';
import { createProductType } from '@src/commands/createProductType';
import { restockProductType } from '@src/commands/restockProductType';
import { sellProductType } from '@src/commands/sellProductType';
import {
  CreateProductTypeBody,
  RestockProductTypeBody,
} from '@src/types/ProductTypeRequests';

export const create = async (
  req: Request<object, unknown, CreateProductTypeBody>,
  res: Response,
) => {
  const productType = await createProductType(req.body);

  res
    .status(HTTP_STATUS_CODES.Created)
    .json(productType);
};

export const restock = async (
  req: Request<object, unknown, RestockProductTypeBody>,
  res: Response,
) => {
  const { id } = req.params as { id?: string };

  if (!id) {
    res
      .status(HTTP_STATUS_CODES.BadRequest)
      .json({ message: 'Missing productType id' });
    return;
  }

  await restockProductType(id, req.body.amount);

  res
    .status(HTTP_STATUS_CODES.Ok)
    .send();
};

export const sell = async (
  req: Request<object, unknown, RestockProductTypeBody>,
  res: Response,
) => {
  const { id } = req.params as { id?: string };

  if (!id) {
    res
      .status(HTTP_STATUS_CODES.BadRequest)
      .json({ message: 'Missing productType id' });
    return;
  }

  await sellProductType(id, req.body.amount);

  res
    .status(HTTP_STATUS_CODES.Ok)
    .send();
};
