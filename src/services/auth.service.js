import { BaseError } from "../utils/base-error.util.js";
import { ACCOUNT_TYPE } from "../contants/account-type.contant.js";
import { UserRepository } from "../repositories/user.repository.js";
import { jwtUtils } from "../utils/jwt.util.js";
import { RefreshTokenService } from "./refresh-token.service.js";
import { compare, hash } from "../utils/bcrypt.util.js";
import { OtpService } from "./otp.service.js";
import { sendMail } from "./mail.service.js";
import { env } from "../config/environment.js";
import { MAIL_TYPE } from "../contants/mail.contant.js";

export const AuthService = {
    async login(email, password, tokenThirdParty, type, ip, device) {
        switch (type) {
            case ACCOUNT_TYPE.LOCAL:
                if (!email || !password) {
                    throw new BaseError(400, "Email and password are required");
                }
                break;
            case ACCOUNT_TYPE.GOOGLE:
            case ACCOUNT_TYPE.FACEBOOK:
                if (!tokenThirdParty) {
                    throw new BaseError(400, "Access token is required");
                }
                throw new BaseError(500, "Third-party login not implemented");
            default:
                throw new BaseError(400, "Invalid account type");
        }

        const user = await UserRepository.findUserByEmail(email, type);
        if (!user) {
            throw new BaseError(404, "User not found");
        }
        if (!user.isActive) {
            throw new BaseError(403, "User account is not active");
        }
        if (type === ACCOUNT_TYPE.LOCAL && !await compare(password, user.password)) {
            throw new BaseError(401, "Invalid password");
        }
        const accessToken = jwtUtils.signAccessToken(user);
        const refreshToken = await RefreshTokenService.generate(user, ip, device);
        return {
            accessToken,
            refreshToken
        };
    },

    async register(fullName, email, password, otp, ip, device) {
        const existingUser = await UserRepository.findUserByEmail(email, ACCOUNT_TYPE.LOCAL);
        if (existingUser) {
            throw new BaseError(400, "Email already in use");
        }

        if (!await OtpService.verify(email, otp)) {
            throw new BaseError(400, "Invalid or expired OTP");
        }

        const user = await UserRepository.createUser({ email, password: await hash(password), accountType: ACCOUNT_TYPE.LOCAL, fullName });

        await sendMail(
            email,
            MAIL_TYPE.REGISTER_SUCCESS,
            { fullName }
        );
        const accessToken = jwtUtils.signAccessToken(user);
        const refreshToken = await RefreshTokenService.generate(user, ip, device);
        return {
            accessToken,
            refreshToken
        };
    },

    async resetPassword(email, newPassword, otp, ip, device) {
        const user = await UserRepository.findUserByEmail(email, ACCOUNT_TYPE.LOCAL);
        if (!user) {
            throw new BaseError(404, "User not found");
        }
        if (!user.isActive) {
            throw new BaseError(403, "User account is not active");
        }

        if (!await OtpService.verify(email, otp)) {
            throw new BaseError(400, "Invalid or expired OTP");
        }

        newPassword = await hash(newPassword);
        user.password = newPassword;

        await UserRepository.updateUser(user._id, user);

        await RefreshTokenService.revokeAllForUser(user._id, ip);


        const accessToken = jwtUtils.signAccessToken(user);
        const refreshToken = await RefreshTokenService.generate(user, ip, device);
        return {
            accessToken,
            refreshToken
        };
    },

    async updatePassword(userId, currentPassword, newPassword) {
        // Tìm user
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new BaseError(404, "User not found");
        }
        if (!user.isActive) {
            throw new BaseError(403, "User account is not active");
        }

        // Kiểm tra mật khẩu hiện tại
        if (!await compare(currentPassword, user.password)) {
            throw new BaseError(401, "Invalid old password");
        }

        // Cập nhật mật khẩu mới
        newPassword = await hash(newPassword);
        user.password = newPassword;

        await UserRepository.updateUser(user._id, user);
    },

    async refreshToken(refreshToken, ip, device) {
        const decoded = await RefreshTokenService.verify(refreshToken);

        const user = await UserRepository.findById(decoded.userId);
        if (!user) {
            throw new BaseError(404, "User not found");
        }
        if (!user.isActive) {
            throw new BaseError(403, "User account is not active");
        }

        // Phát hành token mới
        const accessToken = jwtUtils.signAccessToken(user);
        const newRefreshToken = await RefreshTokenService.rotate(refreshToken, user, ip, device);
        return {
            accessToken,
            refreshToken: newRefreshToken
        };

    },

    async sendOtp(email, type) {
        const otp = await OtpService.generate(email);
        let isExist;
        switch (type) {
            case 'RESET_PASSWORD':
                isExist = await UserRepository.findUserByEmail(email, ACCOUNT_TYPE.LOCAL);
                if (!isExist) {
                    throw new BaseError(400, "User not found");
                }
                break;
            case 'SIGN_UP':
                isExist = await UserRepository.findUserByEmail(email, ACCOUNT_TYPE.LOCAL);
                if (isExist) {
                    throw new BaseError(400, "Email already in use");
                }
                break;
            default:
                break;

        }

        await sendMail(
            email,
            type,
            { otp, otpExpiresInMinutes: env.OTP_EXPIRE_MINUTES }
        );
    },

    async logout(refreshToken, ip) {
        await RefreshTokenService.revoke(refreshToken, ip);
    }
};
