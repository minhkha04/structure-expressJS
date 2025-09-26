import mongoose from 'mongoose';
import { ACCOUNT_TYPE } from '../constants/account-type.constant.js';
import { ROLE } from '../constants/role.constant.js';

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, },
    password: { type: String, required: true, },
    accountType: { type: String, enum: [ACCOUNT_TYPE.LOCAL, ACCOUNT_TYPE.GOOGLE, ACCOUNT_TYPE.FACEBOOK], },
    role: { type: String, enum: [ROLE.ADMIN, ROLE.USER], },
    isActive: { type: Boolean, default: true, },
    fullName: { type: String },
    avatarUrl: { type: String },
}, { timestamps: true }
);

userSchema.index({ email: 1, accountType: 1 }, { unique: true });
const User = mongoose.model('User', userSchema);

export default User;
