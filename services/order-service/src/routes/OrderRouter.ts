import { Router } from 'express';
import * as command from '@src/controllers/OrderCommandController';
import * as query from '@src/controllers/OrderQueryController';
import { validateCreateOrder } from '@src/validators/OrderValidator';

const router = Router();

router.post('/orders', validateCreateOrder, command.create);
router.get('/orders', query.list);

export default router;
