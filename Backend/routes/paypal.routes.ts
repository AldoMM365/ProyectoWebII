import { createOrder, captureOrder } from '../controller/paypal.controller';
import verifyAuth from '../middleware/auth.middleware'
import express from 'express';
const router = express.Router()
router.post('/create-order', verifyAuth, createOrder);
router.post('/capture-order', verifyAuth, captureOrder);

export default router