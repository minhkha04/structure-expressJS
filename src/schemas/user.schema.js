import JoiToSwagger from 'joi-to-swagger';
import { UpdateProfileRequest } from '../validators/user.validator.js';


const { swagger: UpdateProfileRequestSchema } = JoiToSwagger(UpdateProfileRequest);

export const UserSchemas = {
    UpdateProfileRequest: UpdateProfileRequestSchema,
};
