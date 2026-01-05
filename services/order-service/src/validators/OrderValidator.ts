import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import HTTP_STATUS_CODES from '@src/common/constants/HTTP_STATUS_CODES';

/* ---------------- Schemas ---------------- */

const orderItemSchema = Joi.object({
  productId: Joi.string().trim().required(),
  quantity: Joi.number().integer().positive().required(),
  unitPrice: Joi.number().positive().required(),
  category: Joi.string().trim().required(),
});

const createOrderSchema = Joi.object({
  customer: Joi.string().trim().required(),
  location: Joi.string()
    .valid('US', 'EU', 'ASIA')
    .required(),
  items: Joi.array()
    .items(orderItemSchema)
    .min(1)
    .required(),
});

/* ---------------- Middleware ---------------- */

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

export const validateCreateOrder = validate(createOrderSchema);
