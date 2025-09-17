"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authService_1 = require("./authService");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/signin", async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const { token, user } = await authService_1.authService.signIn({ email, password, name });
        res.status(201).json({ token, user });
    }
    catch (error) {
        next(error);
    }
});
exports.authRouter.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await authService_1.authService.logIn({ email, password });
        res.status(200).json({ token, user });
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
