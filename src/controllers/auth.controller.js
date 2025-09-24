import { AuthService } from "../services/auth.service.js";
import { successResponse } from "../utils/response.util.js";

export const AuthController = {
    async login(req, res) {
        const { email, password, tokenThirdParty } = req.body;
        const type = req.query.type;
        const ip = req.clientIp;
        const device = req.device;
        const result = await AuthService.login(email, password, tokenThirdParty, type, ip, device);
        return successResponse(res, result, "Login successful");
    },

    async register(req, res) {
        const ip = req.clientIp;        // đã parse sẵn
        const device = req.device;      // đã parse sẵn
        const { email, password, otp, fullName } = req.body;
        const result = await AuthService.register(fullName, email, password, otp, ip, device);
        return successResponse(res, result, "Register successful");
    },

    async resetPassword(req, res) {
        const ip = req.clientIp;        // đã parse sẵn
        const device = req.device;      // đã parse sẵn
        const { email, newPassword, otp } = req.body;

        const result = await AuthService.resetPassword(email, newPassword, otp, ip, device);

        return successResponse(res, result, "Reset password successful");


    },

    async updatePassword(req, res) {
        const userId = req.payload.userId;
        const { currentPassword, newPassword } = req.body;
        await AuthService.updatePassword(userId, currentPassword, newPassword);
        return successResponse(res, null, "Update password successful");
    },

    async refreshToken(req, res) {
        const ip = req.clientIp;        // đã parse sẵn
        const device = req.device;      // đã parse sẵn
        const { refreshToken } = req.body;
        const result = await AuthService.refreshToken(refreshToken, ip, device);
        return successResponse(res, result, "Refresh token successful");
    },


    async sendOtp(req, res) {
        const { email } = req.body;
        const { type } = req.query;
        await AuthService.sendOtp(email, type);
        return successResponse(res, null, "OTP sent successfully");
    },

    async logout(req, res) {
        const { refreshToken } = req.body;
        const ip = req.clientIp;
        await AuthService.logout(refreshToken, ip);
        return successResponse(res, null, "Logout successful");
    },
};
