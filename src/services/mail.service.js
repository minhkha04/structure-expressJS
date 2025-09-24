import nodemailer from "nodemailer";
import { MAIL_TYPE } from "../contants/mail.contant.js"; // nhớ thêm .js khi import file local
import fs from "fs-extra";
import handlebars from "handlebars";
import { env } from "../config/environment.js";
import { BaseError } from "../utils/base-error.util.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS,
    },
});

async function renderTemplate(fileName, data) {
    try {
        if (!fileName) {
            throw new BaseError(500, "Template file name is required");
        }
        const layoutUrl = new URL("../templates/emails/layout.html", import.meta.url);
        const templateUrl = new URL(`../templates/emails/${fileName}`, import.meta.url);

        const [layoutHTML, bodyHTML] = await Promise.all([
            fs.readFile(layoutUrl, "utf8"),
            fs.readFile(templateUrl, "utf8"),
        ]);

        const layout = handlebars.compile(layoutHTML);
        const body = handlebars.compile(bodyHTML)(data);

        return layout({ body, ...data, year: new Date().getFullYear(), appName: env.APP_NAME });
    } catch (e) {
        throw new BaseError(500, "Error rendering email template: " + e.message);
    }
}

async function sendMail(to, type, data = {}) {
    let subject = "Thông báo";
    let templateFile = "";

    switch (type) {
        case MAIL_TYPE.REGISTER_SUCCESS:
            subject = "Đăng ký tài khoản thành công";
            templateFile = "register-success.html";
            break;
        case MAIL_TYPE.SIGN_UP:
            subject = "OTP xác thực đăng ký";
            templateFile = "sign-up.html";
            break;
        case MAIL_TYPE.RESET_PASSWORD:
            subject = "Khôi phục mật khẩu";
            templateFile = "reset-password.html";
            break;
        case MAIL_TYPE.ACCOUNT_CREATED:
            subject = "Tài khoản của bạn đã được tạo";
            templateFile = "account-created.html";
            break;
        default:
            break;

    }

    const html = await renderTemplate(templateFile, data);

    const mailOptions = {
        from: `${env.APP_NAME} <${env.MAIL_USER}>`,
        to,
        subject,
        html,
    };

    return transporter.sendMail(mailOptions);
}

export {
    sendMail,
};
