import { UserSchemas } from "../schemas/user.schema.js";

export const UserSwagger = {
    '/api/users/my-profile': {
        get: {
            tags: ['Users'],
            summary: 'Get my profile',
            description: 'Fetch the profile of the currently authenticated user',
            security: [{ bearerAuth: [] }],
            responses: {}
        },
    },

    '/api/users/update-profile': {
        put: {
            tags: ['Users'],
            summary: 'Update my profile',
            description: 'Update the profile of the currently authenticated user',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: UserSchemas.UpdateProfileRequest,
                    },
                },
            },
            responses: {}
        },
    }
};