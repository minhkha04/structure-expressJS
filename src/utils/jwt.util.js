import jwt from "jsonwebtoken";
import { env } from "../config/environment.js";

export const jwtUtils = {

    //Generate access token
    signAccessToken(user) {
        const payload = { userId: user._id, email: user.email, role: user.role };
        return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN});
    },

    //Generate refresh token
    signRefreshToken(user) {
        const payload = { userId: user._id, email: user.email, role: user.role };
        return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN});
    },

    //Verify access token
    verifyAccessToken(token) {
        return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    },

    //Verify refresh token
    verifyRefreshToken(token) {
        return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
    }
};