"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountRouter = void 0;
const express_1 = require("express");
const accountService_1 = require("./accountService");
const jwt_1 = require("../../utils/jwt");
const errorHandler_1 = require("../../middlewares/errorHandler");
exports.accountRouter = (0, express_1.Router)();
exports.accountRouter.put("/update-info", jwt_1.verifyAuthToken, async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const userId = req.userId;
        const isAdmin = req.isAdmin;
        if (!userId) {
            throw new errorHandler_1.AppError("Unauthorized: User ID not found", 401);
        }
        const result = await accountService_1.accountService.updateAccountInfo({ userId, name, email, isAdmin });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.accountRouter.patch("/change-password", jwt_1.verifyAuthToken, async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.userId;
        const isAdmin = req.isAdmin;
        if (!userId) {
            throw new errorHandler_1.AppError("Unauthorized: User ID not found", 401);
        }
        const result = await accountService_1.accountService.changePassword({ userId, oldPassword, newPassword, isAdmin });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.accountRouter.get("/details", jwt_1.verifyAuthToken, async (req, res, next) => {
    try {
        const userId = req.userId;
        const isAdmin = req.isAdmin || false;
        if (!userId) {
            throw new errorHandler_1.AppError("Unauthorized: User ID not found", 401);
        }
        const result = await accountService_1.accountService.getAccountDetails(userId, isAdmin);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.accountRouter.delete("/", jwt_1.verifyAuthToken, async (req, res, next) => {
    try {
        const { password } = req.body;
        const userId = req.userId;
        const isAdmin = req.isAdmin;
        if (!userId) {
            throw new errorHandler_1.AppError("Unauthorized: User ID not found", 401);
        }
        const result = await accountService_1.accountService.deleteAccount({ userId, password, isAdmin });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
