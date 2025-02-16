import {Router } from 'express';
import { createUsers, deleteUser, getUser, getUsers, updateUser } from '../controllers/user_controller';

const user_router = Router();

user_router.get('/', getUsers);
user_router.get('/:id', getUser);
user_router.post('/', createUsers);
user_router.put('/:id', updateUser);
user_router.delete('/:id', deleteUser);

export default user_router;