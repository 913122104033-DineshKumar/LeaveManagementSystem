import express from 'express';
import { deleteUser, signout, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/signout', signout);
router.put('/update/:id', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
export default router;
