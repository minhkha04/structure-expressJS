import { BaseError } from "../utils/base-error.util.js";
import UserService from "../services/user.service.js";
import { successResponse } from "../utils/response.util.js";

const AdminController = {
    async getAllUsers(req, res) {
        const { page, size } = req.query;
        if (!page || !size) throw new BaseError(400, "page and size are required");
        const result = await UserService.getAllUsers(parseInt(page), parseInt(size));
        return successResponse(res, result.data, "Get all users successfully", result.pagintation);
    },
};

export default AdminController;