import UserToken from "../models/user-token.model";

const  UserTokenRepository = {
    async saveGoogleToken(userId, accessToken, refreshToken, expiryDate) {
        await UserToken.findOneAndUpdate(
            { user: userId, provider: "google" },
            {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                expiryDate,
            },
            { upsert: true, new: true }
        );
    }
};

export default UserTokenRepository;
