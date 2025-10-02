import { describe, it, expect, vi, beforeEach } from "vitest";
import AuthService from "../../../src/services/auth.service.js";
import UserRepository from "../../../src/repositories/user.repository.js";
import { hash, compare } from "../../../src/utils/bcrypt.util.js";
import jwtUtils from "../../../src/utils/jwt.util.js";
import RefreshTokenService from "../../../src/services/refresh-token.service.js";
import { BaseError } from "../../../src/utils/base-error.util.js";
import OtpService from "../../../src/services/otp.service.js";

vi.mock("../../../src/repositories/user.repository.js");
vi.mock("../../../src/utils/bcrypt.util.js");
vi.mock("../../../src/utils/jwt.util.js");
vi.mock("../../../src/services/refresh-token.service.js");
vi.mock("../../../src/services/otp.service.js");

describe("AuthService.login", () => {
    const fakeUser = { _id: "123", email: "test@example.com", password: "hashed", isActive: true, role: "USER" };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should throw if user not found", async () => {
        UserRepository.findUserByEmail.mockResolvedValue(null);

        await expect(
            AuthService.login(fakeUser.email, "password", null, "LOCAL", "127.0.0.1", "Chrome")
        ).rejects.toThrow(BaseError);
    });

    it("should throw if password does not match", async () => {
        UserRepository.findUserByEmail.mockResolvedValue(fakeUser);
        compare.mockResolvedValue(false);

        await expect(
            AuthService.login(fakeUser.email, "wrongpassword", null, "LOCAL", "127.0..0.1", "Chrome")
        ).rejects.toThrow(BaseError);
    });

    it("should return tokens on successful login", async () => {
        UserRepository.findUserByEmail.mockResolvedValue(fakeUser);
        compare.mockResolvedValue(true);
        jwtUtils.signAccessToken.mockReturnValue("access-token");
        RefreshTokenService.generate.mockResolvedValue("refresh-token");
        const result = await AuthService.login(fakeUser.email, "password", null, "LOCAL", "127.0.0.1", "Chrome");

        expect(result).toEqual({
            accessToken: "access-token",
            refreshToken: "refresh-token"
        });
    });

});

describe("AuthService.register", () => {
    const fakeUser = { _id: "123", email: "test@example.com", password: "hashed", isActive: true, role: "USER" };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should throw if email already in use", async () => {
        UserRepository.findUserByEmail.mockResolvedValue(fakeUser);
        await expect(
            AuthService.register("Test User", fakeUser.email, "password", "otp", "127.0.0.1", "Chrome")
        ).rejects.toThrow(BaseError);
    });

    it("should throw if OTP is invalid", async () => {
        UserRepository.findUserByEmail.mockResolvedValue(null);
        OtpService.verify.mockResolvedValue(false);
        await expect(
            AuthService.register("Test User", fakeUser.email, "password", "invalid-otp", "127.0.0.1", "Chrome")
        ).rejects.toThrow(BaseError);
    });

    it("should return tokens on successful registration", async () => {
        UserRepository.findUserByEmail.mockResolvedValue(null);
        OtpService.verify.mockResolvedValue(true);
        UserRepository.createUser.mockResolvedValue(fakeUser);
        jwtUtils.signAccessToken.mockReturnValue("access-token");
        RefreshTokenService.generate.mockResolvedValue("refresh-token");
        const result = await AuthService.register("Test User", fakeUser.email, "password", "valid-otp", "127.0.0.1", "Chrome");

        expect(result).toEqual({
            accessToken: "access-token",
            refreshToken: "refresh-token"
        });
    });
});

describe("AuthService.resetPassword", () => {
    const fakeUser = { _id: "123", email: "test@example.com", password: "hashed", isActive: true, role: "USER" };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should throw if user not found", async () => {
        UserRepository.findUserByEmail.mockResolvedValue(null);
        await expect(
            AuthService.resetPassword(fakeUser.email, "newpassword", "otp", "127.0.0.1", "Chrome")
        ).rejects.toThrow(BaseError);
    });

    it("should throw if user is not active", async () => {
        UserRepository.findUserByEmail.mockResolvedValue({ ...fakeUser, isActive: false });
        await expect(
            AuthService.resetPassword(fakeUser.email, "newpassword", "otp", "127.0.0.1", "Chrome")
        ).rejects.toThrow(BaseError);
    });

    it("should throw if OTP is invalid", async () => {
        UserRepository.findUserByEmail.mockResolvedValue(fakeUser);
        OtpService.verify.mockResolvedValue(false);
        await expect(
            AuthService.resetPassword(fakeUser.email, "newpassword", "invalid-otp", "127.0.0.1", "Chrome")
        ).rejects.toThrow(BaseError);
    });

    it("should return tokens on successful password reset", async () => {
        UserRepository.findUserByEmail.mockResolvedValue(fakeUser);
        OtpService.verify.mockResolvedValue(true);
        UserRepository.updateUser.mockResolvedValue(true);
        RefreshTokenService.revokeAllForUser.mockResolvedValue(true);
        jwtUtils.signAccessToken.mockReturnValue("access-token");
        RefreshTokenService.generate.mockResolvedValue("refresh-token");
        const result = await AuthService.resetPassword(fakeUser.email, "newpassword", "valid-otp", "127.0.0.1", "Chrome");

        expect(result).toEqual({
            accessToken: "access-token",
            refreshToken: "refresh-token"
        });
    });
});