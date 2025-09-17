"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const db_1 = require("../../db/db");
const bcrypt_1 = require("../../middlewares/bcrypt");
const errorHandler_1 = require("../../middlewares/errorHandler");
const jwt_1 = require("../../middlewares/jwt");
const emailService_1 = require("../../utils/emailService");
const prisma = db_1.database;
class AuthService {
    constructor() {
        this.signUp = async (args) => {
            const { email, password, name } = args;
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                throw new errorHandler_1.AppError("User with this email already exists", 409);
            }
            const hashedPassword = await (0, bcrypt_1.encryptData)(password);
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                },
            });
            // Send OTP for account verification
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
            await prisma.otp.upsert({
                where: { userId: newUser.id },
                update: { code: otpCode, expiresAt },
                create: { userId: newUser.id, code: otpCode, expiresAt },
            });
            await emailService_1.emailService.sendOtpEmail({
                fullName: newUser.name || "User",
                recipientEmail: newUser.email,
                otp: otpCode,
            });
            return { message: "Account created. Please verify your email with the OTP." };
        };
        this.sendOtp = async (args) => {
            const { email } = args;
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new errorHandler_1.AppError("User not found", 404);
            }
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
            await prisma.otp.upsert({
                where: { userId: user.id },
                update: { code: otpCode, expiresAt },
                create: { userId: user.id, code: otpCode, expiresAt },
            });
            await emailService_1.emailService.sendOtpEmail({
                fullName: user.name || "User",
                recipientEmail: user.email,
                otp: otpCode,
            });
            return { message: "OTP sent successfully" };
        };
        this.verifyOtp = async (args) => {
            const { email, otp } = args;
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new errorHandler_1.AppError("User not found", 404);
            }
            const storedOtp = await prisma.otp.findUnique({ where: { userId: user.id } });
            if (!storedOtp || storedOtp.code !== otp || storedOtp.expiresAt < new Date()) {
                throw new errorHandler_1.AppError("Invalid or expired OTP", 400);
            }
            await prisma.otp.delete({ where: { userId: user.id } });
            return { message: "OTP verified successfully" };
        };
        this.logIn = async (args) => {
            const { email, password, isAdmin } = args;
            if (isAdmin) {
                const admin = await prisma.admin.findUnique({ where: { email } });
                if (!admin) {
                    throw new errorHandler_1.AppError("Invalid credentials", 401);
                }
                await (0, bcrypt_1.verifyEncryptedData)(password, admin.password);
                const token = (0, jwt_1.jwtForLogIn)(admin.id, true);
                return { token, user: admin, role: "admin" };
            }
            else {
                const user = await prisma.user.findUnique({ where: { email } });
                if (!user) {
                    throw new errorHandler_1.AppError("Invalid credentials", 401);
                }
                if (!user.isVerified) {
                    throw new errorHandler_1.AppError("Account not verified. Please verify your email.", 401);
                }
                await (0, bcrypt_1.verifyEncryptedData)(password, user.password);
                const token = (0, jwt_1.jwtForLogIn)(user.id);
                return { token, user, role: "user" };
            }
        };
        this.resetPassword = async (args) => {
            const { email, newPassword, otp } = args;
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new errorHandler_1.AppError("User not found", 404);
            }
            const storedOtp = await prisma.otp.findUnique({ where: { userId: user.id } });
            if (!storedOtp || storedOtp.code !== otp || storedOtp.expiresAt < new Date()) {
                throw new errorHandler_1.AppError("Invalid or expired OTP", 400);
            }
            const hashedPassword = await (0, bcrypt_1.encryptData)(newPassword);
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });
            await prisma.otp.delete({ where: { userId: user.id } });
            return { message: "Password reset successfully" };
        };
        this.verifyAccount = async (args) => {
            const { email, otp } = args;
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new errorHandler_1.AppError("User not found", 404);
            }
            if (user.isVerified) {
                throw new errorHandler_1.AppError("Account already verified", 400);
            }
            const storedOtp = await prisma.otp.findUnique({ where: { userId: user.id } });
            if (!storedOtp || storedOtp.code !== otp || storedOtp.expiresAt < new Date()) {
                throw new errorHandler_1.AppError("Invalid or expired OTP", 400);
            }
            await prisma.user.update({
                where: { id: user.id },
                data: { isVerified: true },
            });
            await prisma.otp.delete({ where: { userId: user.id } });
            return { message: "Account verified successfully." };
        };
    }
}
exports.authService = new AuthService();
