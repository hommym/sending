import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

export const validateSignUp = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name, phone } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError("Invalid email format", 400);
  }

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters long", 400);
  }

  if (name && typeof name !== "string") {
    throw new AppError("Name must be a string", 400);
  }

  if (phone && !/^\+\d{7,15}$/.test(phone)) {
    throw new AppError("Invalid phone number format. Please use E.164 format (e.g., +1234567890)", 400);
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError("Invalid email format", 400);
  }

  next();
};

export const validateSendOtp = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email is required", 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError("Invalid email format", 400);
  }

  next();
};

export const validateVerifyOtp = (req: Request, res: Response, next: NextFunction) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new AppError("Email and OTP are required", 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError("Invalid email format", 400);
  }

  if (!/^\d{6}$/.test(otp)) {
    throw new AppError("OTP must be a 6-digit number", 400);
  }

  next();
};

export const validateResetPassword = (req: Request, res: Response, next: NextFunction) => {
  const { email, newPassword, otp } = req.body;

  if (!email || !newPassword || !otp) {
    throw new AppError("Email, new password, and OTP are required", 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError("Invalid email format", 400);
  }

  if (newPassword.length < 6) {
    throw new AppError("New password must be at least 6 characters long", 400);
  }

  if (!/^\d{6}$/.test(otp)) {
    throw new AppError("OTP must be a 6-digit number", 400);
  }

  next();
};

export const validateUpdateAccountInfo = (req: Request, res: Response, next: NextFunction) => {
  const { name, email } = req.body;

  if (!name && !email) {
    throw new AppError("At least one of 'name' or 'email' must be provided for update", 400);
  }

  if (name && typeof name !== "string") {
    throw new AppError("Name must be a string", 400);
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError("Invalid email format", 400);
  }

  next();
};

export const validateChangePassword = (req: Request, res: Response, next: NextFunction) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new AppError("Old password and new password are required", 400);
  }

  if (newPassword.length < 6) {
    throw new AppError("New password must be at least 6 characters long", 400);
  }

  next();
};

export const validateDeleteAccount = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  if (!password) {
    throw new AppError("Password is required to delete account", 400);
  }

  next();
};

export const validateCreditAccount = (req: Request, res: Response, next: NextFunction) => {
  const { recipientId, amount, recipientIsAdmin } = req.body;

  if (!recipientId || !amount) {
    throw new AppError("Recipient ID and amount are required", 400);
  }

  if (typeof recipientId !== "number" && typeof recipientId !== "string") {
    throw new AppError("Recipient ID must be a number or string", 400);
  }

  if (typeof amount !== "number" || amount <= 0) {
    throw new AppError("Amount must be a positive number", 400);
  }

  if (recipientIsAdmin !== undefined && typeof recipientIsAdmin !== "boolean") {
    throw new AppError("recipientIsAdmin must be a boolean", 400);
  }

  next();
};

export const validateSendMoney = (req: Request, res: Response, next: NextFunction) => {
  const { recipientAccountNo, amount, description } = req.body;

  if (!recipientAccountNo || !amount) {
    throw new AppError("Recipient account number and amount are required", 400);
  }

  if (typeof recipientAccountNo !== "number") {
    throw new AppError("Recipient account number must be a number", 400);
  }

  if (typeof amount !== "number" || amount <= 0) {
    throw new AppError("Amount must be a positive number", 400);
  }

  if (description && typeof description !== "string") {
    throw new AppError("Description must be a string", 400);
  }

  next();
};
