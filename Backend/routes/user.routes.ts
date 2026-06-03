import {Router} from 'express';
import verifyAuth from '../middleware/auth.middleware';
import {updateAuthUser, deleteAccount, changePassword} from '../controller/users.controller'

const router = Router();

router.put('/', verifyAuth, updateAuthUser);
router.delete('/', verifyAuth, deleteAccount);
router.post('/changePassword', changePassword)

export default router;

