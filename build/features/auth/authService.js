"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const db_1 = require("../../db/db");
const bcrypt_1 = require("../../middlewares/bcrypt");
const errorHandler_1 = require("../../middlewares/errorHandler");
const jwt_1 = require("../../middlewares/jwt");
const emailService_1 = require("../../utils/emailService");
class AuthService {
    constructor() {
        this.signIn = async (args) => {
            const { email, password, name } = args;
            const existingUser = await db_1.database.user.findUnique({ where: { email } });
            if (existingUser) {
                throw new errorHandler_1.AppError("User with this email already exists", 409);
            }
            const hashedPassword = await (0, bcrypt_1.encryptData)(password);
            const newUser = await db_1.database.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                },
            });
            const token = (0, jwt_1.jwtForLogIn)(newUser.id);
            await emailService_1.emailService.sendWelcomeEmail({ fullName: newUser.name || "User", recipientEmail: newUser.email });
            return { token, user: newUser };
        };
        this.sendOtp = async (args) => {
            const { email } = args;
            const user = await db_1.database.user.findUnique({ where: { email } });
            if (!user) {
                throw new errorHandler_1.AppError("User not found", 404);
            }
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
            await db_1.database.otp.upsert({
                where: { userId: user.id },
                update: { code: otpCode, expiresAt },
                create: { userId: user.id, code: otpCode, expiresAt },
            });
            await emailService_1.emailService.sendPasswordResetEmail({
                fullName: user.name || "User",
                recipientEmail: user.email,
                plainPassword: otpCode, // Sending OTP as plain password for simplicity, can be changed to a dedicated OTP email
            });
            return { message: "OTP sent successfully" };
        };
        this.verifyOtp = async (args) => {
            const { email, otp } = args;
            const user = await db_1.database.user.findUnique({ where: { email } });
            if (!user) {
                throw new errorHandler_1.AppError("User not found", 404);
            }
            const storedOtp = await db_1.database.otp.findUnique({ where: { userId: user.id } });
            if (!storedOtp || storedOtp.code !== otp || storedOtp.expiresAt < new Date()) {
                throw new errorHandler_1.AppError("Invalid or expired OTP", 400);
            }
            await db_1.database.otp.delete({ where: { userId: user.id } });
            return { message: "OTP verified successfully" };
        };
        this.logIn = async (args) => {
            const { email, password } = args;
            const user = await db_1.database.user.findUnique({ where: { email } });
            if (!user) {
                throw new errorHandler_1.AppError("Invalid credentials", 401);
            }
            await (0, bcrypt_1.verifyEncryptedData)(password, user.password);
            const token = (0, jwt_1.jwtForLogIn)(user.id);
            return { token, user };
        };
        this.resetPassword = async (args) => {
            const { email, newPassword, otp } = args;
            const user = await db_1.database.user.findUnique({ where: { email } });
            if (!user) {
                throw new errorHandler_1.AppError("User not found", 404);
            }
            const storedOtp = await db_1.database.otp.findUnique({ where: { userId: user.id } });
            if (!storedOtp || storedOtp.code !== otp || storedOtp.expiresAt < new Date()) {
                throw new errorHandler_1.AppError("Invalid or expired OTP", 400);
            }
            const hashedPassword = await (0, bcrypt_1.encryptData)(newPassword);
            await db_1.database.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });
            await db_1.database.otp.delete({ where: { userId: user.id } });
            return { message: "Password reset successfully" };
        };
    }
}
exports.authService = new AuthService();
