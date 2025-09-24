import User from "../models/user.model.js";

export const UserRepository = {
    async findUserByEmail(email, accountType) {
        return await User.findOne({ email, accountType });
    },

    async createUser(userData) {
        const newUser = new User(userData);
        return await newUser.save();
    },

    async updateUser(userId, updateData) {
        return await User.findByIdAndUpdate(userId, updateData, { new: true });
    },

    async findById(userId) {
        return await User.findById(userId);
    }
}