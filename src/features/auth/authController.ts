import { Router } from "express";
import { authService } from "./authService";
import { AppError } from "../../middlewares/errorHandler";
import { validateSignUp, validateLogin, validateSendOtp, validateVerifyOtp, validateResetPassword } from "../../middlewares/validation";

export const authRouter = Router();

authRouter.post("/signup", validateSignUp, async (req, res, next) => {
  try {
    const { email, password, name, phone } = req.body;
    const result = await authService.signUp({ email, password, name, phone });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", validateLogin, async (req, res, next) => {
  try {
    const { email, password, isAdmin } = req.body;
    const { token, user, role } = await authService.logIn({ email, password, isAdmin });
    res.status(200).json({ token, user, role });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/send-otp", validateSendOtp, async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.sendOtp({ email });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/verify-otp", validateVerifyOtp, async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyOtp({ email, otp });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/reset-password", validateResetPassword, async (req, res, next) => {
  try {
    const { email, newPassword, otp } = req.body;
    const result = await authService.resetPassword({ email, newPassword, otp });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/verify-account", validateVerifyOtp, async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyAccount({ email, otp });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
