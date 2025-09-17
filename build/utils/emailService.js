"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const nodemailer_1 = __importDefault(require("nodemailer"));
const errorHandler_1 = require("../middlewares/errorHandler");
class EmailService {
    constructor() {
        this.sendWelcomeEmail = async (args) => {
            const { fullName, recipientEmail } = args;
            const subject = `Welcome to ${this.companyName}`;
            const text = `Hi ${fullName},\n\nYour ${this.companyName} account has been created successfully. Enjoy the experience!`;
            const html = this.wrapHtmlTemplate(`
      <p>Hi <strong>${this.escapeHtml(fullName)}</strong>,</p>
      <p>Your ${this.escapeHtml(this.companyName)} account has been created successfully. Enjoy the experience!</p>
    `);
            await this.sendWithRetry({ to: recipientEmail, subject, text, html });
        };
        this.sendOtpEmail = async (args) => {
            const { fullName, otp, recipientEmail } = args;
            const subject = `${this.companyName} - Your Verification Code`;
            const text = `Hi ${fullName},\n\nYour ${this.companyName} verification code is: ${otp}\nThis code is valid for 10 minutes.`;
            const html = this.wrapHtmlTemplate(`
      <p>Hi <strong>${this.escapeHtml(fullName)}</strong>,</p>
      <p>Your ${this.escapeHtml(this.companyName)} verification code is:</p>
      <p style="font-size: 24px; font-weight: bold;"><code>${this.escapeHtml(otp)}</code></p>
      <p>This code is valid for 10 minutes.</p>
    `);
            await this.sendWithRetry({ to: recipientEmail, subject, text, html });
        };
        const host = process.env.SMTP_HOST;
        const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;
        const from = process.env.MAIL_FROM;
        const retries = process.env.EMAIL_MAX_RETRIES ? Number(process.env.EMAIL_MAX_RETRIES) : 3;
        const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : false;
        if (!host)
            throw new errorHandler_1.AppError("No value found for env var: SMTP_HOST", 500);
        if (!port)
            throw new errorHandler_1.AppError("No value found for env var: SMTP_PORT", 500);
        if (!user)
            throw new errorHandler_1.AppError("No value found for env var: SMTP_USER", 500);
        if (!pass)
            throw new errorHandler_1.AppError("No value found for env var: SMTP_PASS", 500);
        if (!from)
            throw new errorHandler_1.AppError("No value found for env var: MAIL_FROM", 500);
        this.transporter = nodemailer_1.default.createTransport({
            host,
            port,
            secure,
            auth: { user, pass },
        });
        this.fromAddress = from;
        this.maxRetries = Number.isFinite(retries) && retries > 0 ? retries : 3;
        this.companyName = process.env.COMPANY_NAME || "Aceldaa Bank";
    }
    async sendWithRetry(params) {
        let lastError = undefined;
        for (let attempt = 1; attempt <= this.maxRetries; attempt += 1) {
            try {
                await this.transporter.sendMail({
                    from: this.fromAddress,
                    to: params.to,
                    subject: params.subject,
                    text: params.text,
                    html: params.html,
                });
                return; // success
            }
            catch (error) {
                lastError = error;
                if (attempt === this.maxRetries) {
                    break;
                }
                await this.delay(this.backoffMs(attempt));
            }
        }
        throw new errorHandler_1.AppError(`Failed to send email after some attempts`, 500);
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    backoffMs(attempt) {
        const base = 250; // 250ms base backoff
        const max = 2000; // cap at 2s
        return Math.min(base * Math.pow(2, attempt - 1), max);
    }
    wrapHtmlTemplate(innerHtml) {
        return `
      <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color: #111;">
        <h2 style="margin: 0 0 12px 0;">${this.escapeHtml(this.companyName)}</h2>
        ${innerHtml}
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #666;">This is an automated message. Please do not reply.</p>
      </div>
    `;
    }
    escapeHtml(value) {
        return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
}
exports.emailService = new EmailService();
