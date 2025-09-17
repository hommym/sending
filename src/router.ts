import { Router } from "express";
import { authRouter } from "./features/auth/authController";


export const httpRouter = Router();

// main routes

httpRouter.use("/auth", authRouter);
// httpRouter.use("/contacts", contactsRouter);
// httpRouter.use("/chat", chatRouter);
// httpRouter.use("/community", communityRouter);
// httpRouter.use("/dashboard", dashboardRouter);
// httpRouter.use("/report", reportRouter);
// httpRouter.use("/post", postsRouter);
// httpRouter.use("/subscription", subscriptionRouter);
