import Joi from 'joi';

export const LoginRequest = Joi.object({
    email: Joi.string()
        .email()
        .optional()
        .messages({
            'string.email': 'Invalid email address',
        }),
    password: Joi.string()
        .min(6)
        .optional()
        .messages({
            'string.min': 'Password must be at least 6 characters',
        }),
    tokenThirdParty: Joi.string()
        .optional(),
});

export const SendOtpRequest = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email address',
            'any.required': 'Email is required',
        })
});

export const RegisterRequest = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email address',
            'any.required': 'Email is required',
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required',
        }),
    fullName: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.min': 'Full name must be at least 3 characters',
            'any.required': 'Full name is required',
        }),
    otp: Joi.string()
        .length(6)
        .required()
        .messages({
            'string.length': 'OTP must be exactly 6 characters',
            'any.required': 'OTP is required',
        }),
});

export const ResetPasswordRequest = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email address',
            'any.required': 'Email is required',
        }),
    newPassword: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required',
        }),
    otp: Joi.string()
        .length(6)
        .required()
        .messages({
            'string.length': 'OTP must be exactly 6 characters',
            'any.required': 'OTP is required',
        }),
});

export const UpdatePasswordRequest = Joi.object({
    currentPassword: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required',
        }),
    newPassword: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required',
        }),
});

export const RefreshTokenRequest = Joi.object({
    refreshToken: Joi.string()
        .required()
        .messages({
            'any.required': 'Refresh token is required',
        }),
});

export const LogoutRequest = Joi.object({
    refreshToken: Joi.string()
        .required()
        .messages({
            'any.required': 'Refresh token is required',
        }),
});