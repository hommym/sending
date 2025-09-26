"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRouter = void 0;
const express_1 = require("express");
const transactionService_1 = require("./transactionService");
const jwt_1 = require("../../utils/jwt");
const errorHandler_1 = require("../../middlewares/errorHandler");
const validation_1 = require("../../middlewares/validation");
exports.transactionRouter = (0, express_1.Router)();
// Admin only: Credit a user's account
exports.transactionRouter.post("/credit", jwt_1.verifyAuthToken, validation_1.validateCreditAccount, async (req, res, next) => {
    try {
        const { recipientId, amount, recipientIsAdmin } = req.body;
        const isAdmin = req.isAdmin;
        if (!isAdmin) {
            throw new errorHandler_1.AppError("Unauthorized: Admins only", 403);
        }
        if (!recipientId || !amount) {
            throw new errorHandler_1.AppError("Recipient ID and amount are required", 400);
        }
        const result = await transactionService_1.transactionService.creditAccount({ recipientId, amount, recipientIsAdmin });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
// User: Send money to another account
exports.transactionRouter.post("/send", jwt_1.verifyAuthToken, validation_1.validateSendMoney, async (req, res, next) => {
    try {
        const { recipientAccountNo, amount, description, createdAt } = req.body;
        const senderId = req.userId;
        if (!senderId) {
            throw new errorHandler_1.AppError("Unauthorized: User ID not found", 401);
        }
        if (!recipientAccountNo || !amount) {
            throw new errorHandler_1.AppError("Recipient account number and amount are required", 400);
        }
        const result = await transactionService_1.transactionService.sendMoney({ senderId, recipientAccountNo, amount, description, createdAt });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
// User: Get all transactions for the authenticated user
exports.transactionRouter.get("/history", jwt_1.verifyAuthToken, async (req, res, next) => {
    try {
        const userId = req.userId;
        const isAdmin = req.isAdmin || false; // Default to false for user endpoint
        if (!userId) {
            throw new errorHandler_1.AppError("Unauthorized: User ID not found", 401);
        }
        const result = await transactionService_1.transactionService.getTransactions({ userId, isAdmin: false }); // Explicitly set isAdmin to false for user history
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
// Admin only: Get all transactions in the system
exports.transactionRouter.get("/admin/history", jwt_1.verifyAuthToken, async (req, res, next) => {
    try {
        const isAdmin = req.isAdmin;
        if (!isAdmin) {
            throw new errorHandler_1.AppError("Unauthorized: Admins only", 403);
        }
        const result = await transactionService_1.transactionService.getTransactions({ userId: "", isAdmin: true }); // userId is not relevant for admin all transactions
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
