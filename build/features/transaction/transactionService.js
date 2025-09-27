"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionService = void 0;
const db_1 = require("../../db/db");
const errorHandler_1 = require("../../middlewares/errorHandler");
const prisma = db_1.database;
class TransactionService {
    constructor() {
        this.creditAccount = async (args) => {
            const { recipientId, amount, recipientIsAdmin } = args;
            let recipientEntity;
            if (recipientIsAdmin) {
                recipientEntity = await prisma.admin.findUnique({ where: { id: Number(recipientId) } });
            }
            else {
                recipientEntity = await prisma.user.findUnique({ where: { id: Number(recipientId) } });
            }
            if (!recipientEntity) {
                throw new errorHandler_1.AppError("Recipient not found", 404);
            }
            const account = await prisma.account.findUnique({ where: { userId: recipientEntity.id } });
            if (!account) {
                throw new errorHandler_1.AppError("Recipient account not found", 404);
            }
            const newBalance = (parseFloat(account.balance) + parseFloat(amount)).toFixed(2);
            await prisma.account.update({
                where: { userId: recipientEntity.id },
                data: { balance: newBalance },
            });
            // Create a transaction record for the credit
            await prisma.transaction.create({
                data: {
                    ownerId: recipientEntity.id,
                    amount: `${amount}`,
                    type: "recipient",
                    description: `Account credited by admin`,
                },
            });
            return { message: "Account credited successfully", newBalance };
        };
        this.sendMoney = async (args) => {
            const { senderId, recipientAccountNo, amount, description, createdAt } = args;
            if (parseFloat(amount) <= 0) {
                throw new errorHandler_1.AppError("Amount must be greater than zero", 400);
            }
            const senderAccount = await prisma.account.findUnique({ where: { userId: Number(senderId) } });
            if (!senderAccount) {
                throw new errorHandler_1.AppError("Sender account not found", 404);
            }
            if (parseFloat(senderAccount.balance) < parseFloat(amount)) {
                throw new errorHandler_1.AppError("Insufficient balance", 400);
            }
            const recipientAccount = await prisma.account.findUnique({ where: { accountNo: recipientAccountNo } });
            if (!recipientAccount) {
                throw new errorHandler_1.AppError("Recipient account not found", 404);
            }
            if (senderAccount.userId === recipientAccount.userId) {
                throw new errorHandler_1.AppError("Cannot send money to yourself", 400);
            }
            const newSenderBalance = (parseFloat(senderAccount.balance) - parseFloat(amount)).toFixed(2);
            const newRecipientBalance = (parseFloat(recipientAccount.balance) + parseFloat(amount)).toFixed(2);
            await prisma.$transaction(async (tx) => {
                await tx.account.update({
                    where: { userId: senderAccount.userId },
                    data: { balance: newSenderBalance },
                });
                await tx.account.update({
                    where: { userId: recipientAccount.userId },
                    data: { balance: newRecipientBalance },
                });
                // Create transaction record for sender
                await tx.transaction.create({
                    data: {
                        ownerId: senderAccount.userId,
                        amount: `${amount}`,
                        type: "sender",
                        description: description || `Sent money to account ${recipientAccountNo}`,
                        createdAt: createdAt || new Date(),
                        updatedAt: createdAt || new Date(),
                    },
                });
                // Create transaction record for recipient
                await tx.transaction.create({
                    data: {
                        ownerId: recipientAccount.userId,
                        amount: `${amount}`,
                        type: "recipient",
                        description: description || `Received money from account ${senderAccount.accountNo}`,
                        createdAt: createdAt ? new Date(createdAt) : new Date(),
                        updatedAt: createdAt ? new Date(createdAt) : new Date(),
                    },
                });
            });
            return { message: "Money sent successfully", newBalance: newSenderBalance };
        };
        this.sendInternationalMoney = async (args) => {
            const { senderId, recipientBankName, swiftCode, senderName, senderPhone, senderAddress, senderCity, senderState, senderZip, recipientName, recipientAccount, recipientAddress, recipientCity, recipientState, recipientZip, amount, description, additionalInfo, createdAt, } = args;
            if (parseFloat(amount) <= 0) {
                throw new errorHandler_1.AppError("Amount must be greater than zero", 400);
            }
            const senderAccount = await prisma.account.findUnique({ where: { userId: Number(senderId) } });
            if (!senderAccount) {
                throw new errorHandler_1.AppError("Sender account not found", 404);
            }
            if (parseFloat(senderAccount.balance) < parseFloat(amount)) {
                throw new errorHandler_1.AppError("Insufficient balance", 400);
            }
            const newSenderBalance = (parseFloat(senderAccount.balance) - parseFloat(amount)).toFixed(2);
            await prisma.$transaction(async (tx) => {
                await tx.account.update({
                    where: { userId: senderAccount.userId },
                    data: { balance: newSenderBalance },
                });
                const transaction = await tx.transaction.create({
                    data: {
                        ownerId: senderAccount.userId,
                        amount: `${amount}`,
                        type: "sender",
                        description: description || `Sent international money to ${recipientName} (${recipientBankName})`,
                        createdAt: createdAt ? new Date(createdAt) : new Date(),
                        updatedAt: createdAt ? new Date(createdAt) : new Date(),
                        interTransc: {
                            create: {
                                recipientBankName,
                                swiftCode,
                                senderName,
                                senderPhone,
                                senderAddress,
                                senderCity,
                                senderState,
                                senderZip,
                                recipientName,
                                recipientAccount: BigInt(recipientAccount),
                                recipientAddress,
                                recipientCity,
                                recipientState,
                                recipientZip,
                                additionalInfo,
                                createdAt: createdAt || new Date(),
                                updatedAt: createdAt || new Date(),
                            },
                        },
                    },
                    include: { interTransc: true },
                });
            });
            return { message: "International money sent successfully", newBalance: newSenderBalance };
        };
        this.getTransactions = async (args) => {
            const { userId, isAdmin } = args;
            let transactions;
            if (isAdmin) {
                transactions = await prisma.transaction.findMany({
                    orderBy: { createdAt: "desc" },
                    include: { interTransc: true },
                });
            }
            else {
                transactions = await prisma.transaction.findMany({
                    where: { ownerId: Number(userId) },
                    orderBy: { createdAt: "desc" },
                    include: { interTransc: true },
                });
            }
            transactions.forEach((transaction) => {
                if (transaction.interTransc) {
                    transaction.interTransc.recipientAccount = String(transaction.interTransc.recipientAccount);
                }
            });
            return { transactions };
        };
    }
}
exports.transactionService = new TransactionService();
