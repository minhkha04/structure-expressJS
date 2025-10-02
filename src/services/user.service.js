import toUserResponse from "../mapper/user.mapper.js";
import UserRepository from "../repositories/user.repository.js";
import { BaseError } from "../utils/base-error.util.js";
import { createPagination } from "../utils/response.util.js";
import FileService from "./file.service.js";

const UserService = {
    async getUserById(userId) {
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new BaseError(404, 'User not found');
        }
        return toUserResponse(user);
    },

    async updateUserProfile(userId, fullName) {
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new BaseError(404, 'User not found');
        }
        const userUpdated = await UserRepository.updateUser(userId, { fullName });
        return toUserResponse(userUpdated);
    },

    async uploadAvatar(userId, avatarUrl) {
        const user = await UserRepository.findById(userId);
        if (user.avatarUrl) {
            await FileService.deleteFile(user.avatarUrl);
        }
        if (!user) {
            throw new BaseError(404, 'User not found');
        }
        const userUpdated = await UserRepository.updateUser(userId, { avatarUrl: avatarUrl });
        return toUserResponse(userUpdated);
    },

    async getAllUsers(page, size) {
        const { users, total } = await UserRepository.getAllUsers(page, size);
        const userResponses = users.map(user => toUserResponse(user));
        const pagintation = createPagination(page, size, total);
        return { data: userResponses, pagintation };
    }
}

export default UserService;