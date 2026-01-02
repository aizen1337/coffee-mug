import { Router } from 'express';
import * as productTypeCommandController from '@src/controllers/ProductTypeCommandController';
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
  productTypeCommandController.create,
);

router.post(
  '/products/:id/restock',
  validateStockChange,
  productTypeCommandController.restock,
);

router.post(
  '/products/:id/sell',
  validateStockChange,
  productTypeCommandController.sell,
);

export default router;
