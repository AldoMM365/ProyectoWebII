import { Router } from 'express';
import { actualizarEstado, getAuthUserPedidos, getAll }  from '../controller/pedidos.controller';
import authMiddleware from '../middleware/auth.middleware';
import empleadoMiddleware from '../middleware/empleado.middleware'

const router = Router();

router.get('/', authMiddleware, getAuthUserPedidos);
router.put('/', authMiddleware, empleadoMiddleware, actualizarEstado);
router.get('/all', authMiddleware, empleadoMiddleware, getAll);

export default router;