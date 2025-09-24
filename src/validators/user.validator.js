import Joi from "joi";

export const UpdateProfileRequest = {
    fullName: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.min': 'Full name must be at least 3 characters',
            'any.required': 'Full name is required',
        }),
};