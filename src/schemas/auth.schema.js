import JoiToSwagger from 'joi-to-swagger';
import { LoginRequest, LogoutRequest, RefreshTokenRequest, RegisterRequest, ResetPasswordRequest, SendOtpRequest, UpdatePasswordRequest } from '../validators/auth.validator.js'; 

const { swagger: LoginRequestSchema } = JoiToSwagger(LoginRequest);
const { swagger: SendOtpRequestSchema } = JoiToSwagger(SendOtpRequest);
const { swagger: RegisterRequestSchema } = JoiToSwagger(RegisterRequest);
const { swagger: ResetPasswordRequestSchema} = JoiToSwagger(ResetPasswordRequest);
const { swagger: UpdatePasswordRequestSchema } = JoiToSwagger(UpdatePasswordRequest);
const { swagger: RefreshTokenRequestSchema} = JoiToSwagger(RefreshTokenRequest);
const { swagger: LogoutRequestSchema} = JoiToSwagger(LogoutRequest);

export const AuthSchemas = {
    LoginRequest: LoginRequestSchema,
    SendOtpRequest: SendOtpRequestSchema,
    RegisterRequest: RegisterRequestSchema,
    ResetPasswordRequest: ResetPasswordRequestSchema,
    UpdatePasswordRequest: UpdatePasswordRequestSchema,
    RefreshTokenRequest: RefreshTokenRequestSchema,
    LogoutRequest: LogoutRequestSchema,
};
