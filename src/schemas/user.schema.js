import JoiToSwagger from 'joi-to-swagger';
import { UpdateProfileRequest } from '../validators/user.validator.js';

const { swagger: UpdateProfileRequestSchema } = JoiToSwagger(UpdateProfileRequest);

const UserSchemas = {
    UpdateProfileRequest: UpdateProfileRequestSchema,
};

export default UserSchemas;
