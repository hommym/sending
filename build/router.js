"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpRouter = void 0;
const express_1 = require("express");
const authController_1 = require("./features/auth/authController");
exports.httpRouter = (0, express_1.Router)();
// main routes
exports.httpRouter.use("/auth", authController_1.authRouter);
// httpRouter.use("/contacts", contactsRouter);
// httpRouter.use("/chat", chatRouter);
// httpRouter.use("/community", communityRouter);
// httpRouter.use("/dashboard", dashboardRouter);
// httpRouter.use("/report", reportRouter);
// httpRouter.use("/post", postsRouter);
// httpRouter.use("/subscription", subscriptionRouter);
