"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authService_1 = require("./authService");
const validation_1 = require("../../middlewares/validation");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/signup", validation_1.validateSignUp, async (req, res, next) => {
    try {
        const { email, password, name, phone } = req.body;
        const result = await authService_1.authService.signUp({ email, password, name, phone });
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.authRouter.post("/login", validation_1.validateLogin, async (req, res, next) => {
    try {
        const { email, password, isAdmin } = req.body;
        const { token, user, role } = await authService_1.authService.logIn({ email, password, isAdmin });
        res.status(200).json({ token, user, role });
    }
    catch (error) {
        next(error);
    }
});
exports.authRouter.post("/send-otp", validation_1.validateSendOtp, async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await authService_1.authService.sendOtp({ email });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.authRouter.post("/verify-otp", validation_1.validateVerifyOtp, async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const result = await authService_1.authService.verifyOtp({ email, otp });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.authRouter.post("/reset-password", validation_1.validateResetPassword, async (req, res, next) => {
    try {
        const { email, newPassword, otp } = req.body;
        const result = await authService_1.authService.resetPassword({ email, newPassword, otp });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.authRouter.post("/verify-account", validation_1.validateVerifyOtp, async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const result = await authService_1.authService.verifyAccount({ email, otp });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
