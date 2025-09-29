"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountService = void 0;
const db_1 = require("../../db/db");
const errorHandler_1 = require("../../middlewares/errorHandler");
const bcrypt_1 = require("../../utils/bcrypt");
const prisma = db_1.database;
class AccountService {
    constructor() {
        this.updateAccountInfo = async (args) => {
            const { userId, name, email, isAdmin } = args;
            let entity;
            if (isAdmin) {
                entity = await prisma.admin.findUnique({ where: { id: Number(userId) } });
            }
            else {
                entity = await prisma.user.findUnique({ where: { id: Number(userId) } });
            }
            if (!entity) {
                throw new errorHandler_1.AppError(isAdmin ? "Admin not found" : "User not found", 404);
            }
            if (email && email !== entity.email) {
                let existingEntityWithEmail;
                if (isAdmin) {
                    existingEntityWithEmail = await prisma.admin.findUnique({ where: { email } });
                }
                else {
                    existingEntityWithEmail = await prisma.user.findUnique({ where: { email } });
                }
                if (existingEntityWithEmail && existingEntityWithEmail.id !== Number(userId)) {
                    throw new errorHandler_1.AppError("Email already in use", 409);
                }
            }
            let updatedEntity;
            if (isAdmin) {
                updatedEntity = await prisma.admin.update({
                    where: { id: Number(userId) },
                    data: {
                        name: name || entity.name,
                        email: email || entity.email,
                    },
                    select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
                });
            }
            else {
                updatedEntity = await prisma.user.update({
                    where: { id: Number(userId) },
                    data: {
                        name: name || entity.name,
                        email: email || entity.email,
                    },
                    select: { id: true, name: true, email: true, createdAt: true, isVerified: true },
                });
            }
            return { message: "Account updated successfully", account: updatedEntity };
        };
        this.changePassword = async (args) => {
            const { userId, oldPassword, newPassword, isAdmin } = args;
            let entity;
            if (isAdmin) {
                entity = await prisma.admin.findUnique({ where: { id: Number(userId) } });
            }
            else {
                entity = await prisma.user.findUnique({ where: { id: Number(userId) } });
            }
            if (!entity) {
                throw new errorHandler_1.AppError(isAdmin ? "Admin not found" : "User not found", 404);
            }
            await (0, bcrypt_1.verifyEncryptedData)(oldPassword, entity.password);
            const hashedPassword = await (0, bcrypt_1.encryptData)(newPassword);
            if (isAdmin) {
                await prisma.admin.update({
                    where: { id: Number(userId) },
                    data: { password: hashedPassword },
                });
            }
            else {
                await prisma.user.update({
                    where: { id: Number(userId) },
                    data: { password: hashedPassword },
                });
            }
            return { message: "Password changed successfully" };
        };
        this.getAccountDetails = async (userId, isAdmin) => {
            let entity;
            if (isAdmin) {
                entity = await prisma.admin.findUnique({
                    where: { id: Number(userId) },
                    select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
                });
            }
            else {
                entity = await prisma.user.findUnique({
                    where: { id: Number(userId) },
                    select: { id: true, name: true, email: true, createdAt: true, isVerified: true, account: { select: { accountNo: true, balance: true } } },
                });
            }
            if (!entity) {
                throw new errorHandler_1.AppError(isAdmin ? "Admin not found" : "User not found", 404);
            }
            if (entity && "account" in entity && entity.account) {
                return { account: Object.assign(Object.assign({}, entity), { account: Object.assign(Object.assign({}, entity.account), { accountNo: String(entity.account.accountNo) }) }) };
            }
            return { account: entity };
        };
        this.deleteAccount = async (args) => {
            const { userId, password, isAdmin } = args;
            let entity;
            if (isAdmin) {
                entity = await prisma.admin.findUnique({ where: { id: Number(userId) } });
            }
            else {
                entity = await prisma.user.findUnique({ where: { id: Number(userId) } });
            }
            if (!entity) {
                throw new errorHandler_1.AppError(isAdmin ? "Admin not found" : "User not found", 404);
            }
            await (0, bcrypt_1.verifyEncryptedData)(password, entity.password);
            if (isAdmin) {
                await prisma.admin.delete({ where: { id: Number(userId) } });
            }
            else {
                await prisma.user.delete({ where: { id: Number(userId) } });
            }
            return { message: "Account deleted successfully" };
        };
        this.getAllAccounts = async () => {
            const users = await prisma.user.findMany({
                select: { id: true, name: true, email: true, createdAt: true, isVerified: true, account: { select: { accountNo: true, balance: true } } },
            });
            const admins = await prisma.admin.findMany({
                select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
            });
            const usersWithSerializedAccountNo = users.map((user) => {
                if (user.account) {
                    return Object.assign(Object.assign({}, user), { account: Object.assign(Object.assign({}, user.account), { accountNo: String(user.account.accountNo) }) });
                }
                return user;
            });
            return { users: usersWithSerializedAccountNo, admins };
        };
        this.deleteUserAccountByAdmin = async (args) => {
            const { accountId } = args;
            let entity = await prisma.user.findUnique({ where: { id: Number(accountId) } });
            if (!entity) {
                throw new errorHandler_1.AppError("User not found", 404);
            }
            await prisma.user.delete({ where: { id: Number(accountId) } });
            return { message: "Account deleted successfully by admin" };
        };
    }
}
exports.accountService = new AccountService();
