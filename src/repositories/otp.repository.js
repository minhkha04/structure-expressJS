import { OtpModel } from "../models/otp.model.js";

export const OtpRepository = {
    async create(data) {
        return OtpModel.create(data);
    },

    async findByEmail(email) {
        return OtpModel.findOne({ email });
    },

    async deleteByEmail(email) {
        return OtpModel.deleteMany({ email });
    }
}