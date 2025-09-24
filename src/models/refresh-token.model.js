import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: true },
    createdByIp: { type: String },
    revokedByIp: { type: String },
    replacedByTokenHash: { type: String },
    device: { type: String },
    isRevoked: { type: Boolean, default: false },
},
    { timestamps: true }
);

export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);