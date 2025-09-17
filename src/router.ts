import { Router } from "express";
import { authRouter } from "./features/auth/authController";
import { accountRouter } from "./features/account/accountController";

export const httpRouter = Router();

// main routes

httpRouter.use("/auth", authRouter);
httpRouter.use("/account", accountRouter);

