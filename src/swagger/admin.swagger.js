const AdminSwagger = {
    '/api/admins/get-users': {
        get: {
            tags: ['Admins'],
            security: [{ bearerAuth: [] }],
            summary: 'Get all users with pagination',
            description: 'Retrieve a paginated list of all users. Requires page and size query parameters.',
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    required: true,
                    schema: { type: 'integer', minimum: 1 },
                    description: 'Page number for pagination'
                },
                {
                    name: 'size',
                    in: 'query',
                    required: true,
                    schema: { type: 'integer', minimum: 1 },
                    description: 'Number of users per page'
                }
            ],
            responses: {}
        }
    }
};

export default AdminSwagger;