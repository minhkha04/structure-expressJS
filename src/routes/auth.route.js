import express from 'express';
import { validate } from '../middlewares/validate.middleware.js';
import { LoginRequest, RegisterRequest, ResetPasswordRequest, UpdatePasswordRequest } from '../validators/auth.validator.js';
import { AuthController } from '../controllers/auth.controller.js';
import { clientInfo } from '../middlewares/client-info.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const authRoute = express.Router();

authRoute.post('/send-otp', AuthController.sendOtp);
authRoute.post('/login', validate(LoginRequest), clientInfo, AuthController.login);
authRoute.post('/register', validate(RegisterRequest), clientInfo, AuthController.register);
authRoute.put('/reset-password', validate(ResetPasswordRequest), clientInfo, AuthController.resetPassword);
authRoute.put('/update-password', authenticate, validate(UpdatePasswordRequest), AuthController.updatePassword);
authRoute.put('/refresh-token', clientInfo, AuthController.refreshToken);
authRoute.post('/logout', clientInfo, AuthController.logout);


export default authRoute;