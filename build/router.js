"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpRouter = void 0;
const express_1 = require("express");
const authController_1 = require("./features/auth/authController");
const accountController_1 = require("./features/account/accountController");
const transactionController_1 = require("./features/transaction/transactionController");
exports.httpRouter = (0, express_1.Router)();
// main routes
exports.httpRouter.use("/auth", authController_1.authRouter);
exports.httpRouter.use("/account", accountController_1.accountRouter);
exports.httpRouter.use("/transactions", transactionController_1.transactionRouter);
