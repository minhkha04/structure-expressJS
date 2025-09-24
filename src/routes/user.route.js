import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { UserController } from '../controllers/user.controller.js';

const userRoute = express.Router();

userRoute.get('/my-profile', authenticate, UserController.getMyProfile);
userRoute.put('/update-profile', authenticate, UserController.updateProfile);

export default userRoute;