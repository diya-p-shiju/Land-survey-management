import { Router } from 'express';
import { login } from '../controllers/auth_controller';

const auth_router = Router();

auth_router.post('/', login);

export default auth_router;