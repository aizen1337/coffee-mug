import { Router } from 'express';
import * as productCommandController from '@src/controllers/ProductCommandController';
import * as productQueryController from '@src/controllers/ProductQueryController';
import {
  validateCreateProduct,
  validateStockChange,
} from '@src/validators/ProductValidator';

const router = Router();

/* ---------- Queries ---------- */
router.get('/products', productQueryController.list);

/* ---------- Commands ---------- */

router.post(
  '/products',
  validateCreateProduct,
  productCommandController.create,
);

router.post(
  '/products/:id/restock',
  validateStockChange,
  productCommandController.restock,
);

router.post(
  '/products/:id/sell',
  validateStockChange,
  productCommandController.sell,
);

export default router;
