"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authService_1 = require("./authService");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/signup", async (req, res, next) => {
    try {
        const { email, password, name, phone } = req.body;
        const result = await authService_1.authService.signUp({ email, password, name, phone });
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.authRouter.post("/login", async (req, res, next) => {
    try {
        const { email, password, isAdmin } = req.body;
        const { token, user, role } = await authService_1.authService.logIn({ email, password, isAdmin });
        res.status(200).json({ token, user, role });
    }
    catch (error) {
        next(error);
    }
});
exports.authRouter.post("/send-otp", async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await authService_1.authService.sendOtp({ email });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.authRouter.post("/verify-otp", async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const result = await authService_1.authService.verifyOtp({ email, otp });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.authRouter.post("/reset-password", async (req, res, next) => {
    try {
        const { email, newPassword, otp } = req.body;
        const result = await authService_1.authService.resetPassword({ email, newPassword, otp });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.authRouter.post("/verify-account", async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const result = await authService_1.authService.verifyAccount({ email, otp });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
