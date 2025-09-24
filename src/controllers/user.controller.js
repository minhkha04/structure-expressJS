import { UserService } from "../services/user.service.js";
import { successResponse } from "../utils/response.util.js";

export const UserController = {
    async getMyProfile(req, res) {
        const userId = req.payload.userId;
        const result = await UserService.getUserById(userId);
        return successResponse(res, result, 'User profile fetched successfully');
    },

    async updateProfile(req, res) {
        const userId = req.payload.userId;
        const { fullName } = req.body;
        const result = await UserService.updateUserProfile(userId, fullName );
        return successResponse(res, result, 'User profile updated successfully');
    },
}