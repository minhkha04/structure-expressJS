import { jwtUtils } from "../utils/jwt.util.js";
import { sha256 } from "../utils/crypto.util.js";
import { RefreshTokenRepository } from "../repositories/refresh-token.repository.js";
import { BaseError } from "../utils/base-error.util.js";

export const RefreshTokenService = {
    async generate(user, createdByIp, device) {
        // Sinh JWT refresh token
        const refreshToken = jwtUtils.signRefreshToken(user);

        // Lưu hash của token vào DB
        const decoded = jwtUtils.verifyRefreshToken(refreshToken);
        const tokenHash = sha256(refreshToken);

        // Lưu vào DB

        await RefreshTokenRepository.create({
            user: user._id,
            tokenHash,
            expiresAt: new Date(decoded.exp * 1000),
            createdByIp,
            device,
        })

        // trả JWT plaintext cho FE
        return refreshToken;
    },

    async verify(refreshToken) {
        let decoded;
        try {
            decoded = jwtUtils.verifyRefreshToken(refreshToken);
        } catch (error) {
            throw new BaseError(401, "Refresh token invalid");
        }
        const tokenHash = sha256(refreshToken);

        const stored = await RefreshTokenRepository.findByHash(tokenHash);

        if (!stored) {
            throw new BaseError(401, "Refresh token not found");
        }

        return decoded;
    },

    async rotate(oldRefreshToken, user, createdByIp, device) {
        const oldHash = sha256(oldRefreshToken);
        const oldTokenDoc = await RefreshTokenRepository.findByHash(oldHash);
        
        if (!oldTokenDoc) {
            throw new BaseError(401, "Refresh token not found");
        }

        const newRefreshToken = jwtUtils.signRefreshToken(user);

        // Lưu hash của token mới vào DB
        const decodedNew = jwtUtils.verifyRefreshToken(newRefreshToken);
        const newHash = sha256(newRefreshToken);

        // Revoke token cũ
        oldTokenDoc.replacedByTokenHash = newHash;
        oldTokenDoc.isRevoked = true;
        await RefreshTokenRepository.update(oldTokenDoc._id, oldTokenDoc);

        // Lưu token mới
        await RefreshTokenRepository.create({
            user: user._id,
            tokenHash: newHash,
            expiresAt: new Date(decodedNew.exp * 1000),
            createdByIp,
            device,
        });

        // Trả về token mới
        return newRefreshToken;
    },

    async revoke(refreshToken, ip) {
        // Tìm token trong DB và đánh dấu thu hồi
        const tokenHash = sha256(refreshToken);
        const tokenDoc = await RefreshTokenRepository.findByHash(tokenHash);

        // Nếu tìm thấy và chưa bị thu hồi, thì thu hồi
        if (tokenDoc) {
            tokenDoc.revokedByIp = ip;
            tokenDoc.isRevoked = true;
            await RefreshTokenRepository.update(tokenDoc._id, tokenDoc);
        }
    },

    async revokeAllForUser(userId, ) {
        await RefreshTokenRepository.revokeAllForUser(userId);
    }
};
