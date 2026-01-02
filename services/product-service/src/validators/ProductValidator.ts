// src/validators/ProductValidator.ts
import Joi, { ValidationResult } from 'joi';
import { RequestHandler } from 'express';
import HTTP_STATUS_CODES from '@src/common/constants/HTTP_STATUS_CODES';
import {
  CreateProductTypeBody,
  RestockProductTypeBody,
} from '@src/types/ProductTypeRequests';

const validate =
  <TBody>(schema: Joi.ObjectSchema): RequestHandler<object, unknown, TBody> =>
    (req, res, next) => {
      const result: ValidationResult<TBody> = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (result.error) {
        res.status(HTTP_STATUS_CODES.BadRequest).json({
          message: 'Validation failed',
          details: result.error.details.map(d => d.message),
        });
        return;
      }

      req.body = result.value;
      next();
    };

/* ---------- Schemas ---------- */

const createProductTypeSchema = Joi.object<CreateProductTypeBody>({
  name: Joi.string().trim().max(50).required(),
  category: Joi.string().trim().max(50).required(),
  price: Joi.number().positive().required(),
});

const stockChangeSchema = Joi.object<RestockProductTypeBody>({
  amount: Joi.number().integer().positive().required(),
});

/* ---------- Exports ---------- */

export const validateCreateProduct =
  validate<CreateProductTypeBody>(createProductTypeSchema);

export const validateStockChange =
  validate<RestockProductTypeBody>(stockChangeSchema);
