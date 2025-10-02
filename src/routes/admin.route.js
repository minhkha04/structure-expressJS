import express from 'express';
import AdminController from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import ROLE from '../constants/role.constant.js';

const adminRoute = express.Router();

adminRoute.get('/get-users', authenticate, authorize(ROLE.ADMIN), AdminController.getAllUsers);

export default adminRoute;

