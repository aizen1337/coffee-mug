import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import HTTP_STATUS_CODES from '@src/common/constants/HTTP_STATUS_CODES';

const createProductSchema = Joi.object({
  name: Joi.string().max(50).required(),
  description: Joi.string().max(50).required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
});

const stockChangeSchema = Joi.object({
  amount: Joi.number().integer().positive().required(),
});

const validate =
  (schema: Joi.ObjectSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        return res.status(HTTP_STATUS_CODES.BadRequest).json({
          message: 'Validation failed',
          details: error.details.map(d => d.message),
        });
      }

      next();
    };

export const validateCreateProduct = validate(createProductSchema);
export const validateStockChange = validate(stockChangeSchema);
