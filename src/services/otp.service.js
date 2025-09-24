import { env } from '../config/environment.js';
import { OtpRepository } from '../repositories/otp.repository.js';
import { compare, hash } from '../utils/bcrypt.util.js';

export const OtpService = {
    async generate(email) {
        await OtpRepository.deleteByEmail(email);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + env.OTP_EXPIRE_MINUTES * 60 * 1000);
        await OtpRepository.create({ email, otp: await hash(otp), expiresAt });
        return otp;
    },

    async verify(email, otpInput) {
        const record = await OtpRepository.findByEmail(email);
        console.log(record);
        if (!record) {
            return false;
        }

        if (record.expiresAt < new Date()) {
            return false;
        }

        if (!await compare(otpInput, record.otp)) {
            return false;
        }

        await OtpRepository.deleteByEmail(email); // Xoá sau khi dùng
        return true;
    }
};
