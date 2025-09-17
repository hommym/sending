import { Router } from "express";
import { authService } from "./authService";
import { AppError } from "../../middlewares/errorHandler";

export const authRouter = Router();

authRouter.post("/signup", async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const result = await authService.signUp({ email, password, name });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password, isAdmin } = req.body;
    const { token, user, role } = await authService.logIn({ email, password, isAdmin });
    res.status(200).json({ token, user, role });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/send-otp", async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.sendOtp({ email });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/verify-otp", async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyOtp({ email, otp });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/reset-password", async (req, res, next) => {
  try {
    const { email, newPassword, otp } = req.body;
    const result = await authService.resetPassword({ email, newPassword, otp });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/verify-account", async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyAccount({ email, otp });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
