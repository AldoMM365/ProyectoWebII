import express from 'express'
import { getProducts, addProduct, updateProduct, removeProduct} from '../controller/products.controller';
import authMiddleware from '../middleware/auth.middleware';
import empleadoMiddleware from '../middleware/empleado.middleware';

const router = express.Router();
router.get('/', getProducts);
router.post('/', authMiddleware, empleadoMiddleware, addProduct);
router.put('/', authMiddleware, empleadoMiddleware, updateProduct);
router.delete('/:id', authMiddleware, empleadoMiddleware, removeProduct);

export default router;