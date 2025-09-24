import { ACCOUNT_TYPE } from '../contants/account-type.contant.js';
import { MAIL_TYPE } from '../contants/mail.contant.js';
import { AuthSchemas } from '../schemas/auth.schema.js';

export const AuthSwagger = {
    '/api/auths/login': {
        post: {
            tags: ['Auths'],
            summary: 'User login',
            description: 'Login with email/password or third-party access token if login with Google/Facebook',
            parameters: [
                {
                    name: 'type',
                    in: 'query',
                    required: true,
                    schema: {
                        type: 'string',
                        enum: [ACCOUNT_TYPE.LOCAL, ACCOUNT_TYPE.GOOGLE, ACCOUNT_TYPE.FACEBOOK],
                    },
                    description: 'Type of account to login with',
                }
            ],
            requestBody: {
                required: true,

                content: {
                    'application/json': {
                        schema: AuthSchemas.LoginRequest,
                    }
                }
            },
            responses: {}
        }
    },
    '/api/auths/register': {
        post: {
            tags: ['Auths'],
            summary: 'User registration',
            description: 'Register a new user with email, password, and OTP',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: AuthSchemas.RegisterRequest,
                    }
                }
            },
            responses: {}
        }
    },
    '/api/auths/reset-password': {
        put: {
            tags: ['Auths'],
            summary: 'Reset user password',
            description: 'Reset password using email and OTP',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: AuthSchemas.ResetPasswordRequest,
                    }
                }
            },
            responses: {}
        }
    },
    '/api/auths/update-password': {
        put: {
            tags: ['Auths'],
            summary: 'Update user password',
            description: 'Update password for logged-in user',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: AuthSchemas.UpdatePasswordRequest,
                    }
                }
            },
            responses: {}
        }
    },
    '/api/auths/refresh-token': {
        put: {
            tags: ['Auths'],
            summary: 'Refresh access token',
            description: 'Refresh access token using a valid refresh token',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: AuthSchemas.RefreshTokenRequest,
                    }
                }
            },
            responses: {}
        }
    },
    '/api/auths/logout': {
        post: {
            tags: ['Auths'],
            summary: 'User logout',
            description: 'Logout user by invalidating the refresh token',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: AuthSchemas.LogoutRequest,
                    }
                }
            },
            responses: {}
        }
    },

    '/api/auths/send-otp': {
        post: {
            tags: ['Auths'],
            summary: 'Send OTP to email',
            description: 'Send OTP to email for registration or password reset',
            parameters: [
                {
                    name: 'type',
                    in: 'query',
                    required: true,
                    schema: {
                        type: 'string',
                        enum: [MAIL_TYPE.SIGN_UP, MAIL_TYPE.RESET_PASSWORD],
                    },
                    description: 'Type of OTP to send',
                }
            ],
            requestBody: {
                required: true,

                content: {
                    'application/json': {
                        schema: AuthSchemas.SendOtpRequest,
                    }
                }
            },
            responses: {}
        }
    }
};
