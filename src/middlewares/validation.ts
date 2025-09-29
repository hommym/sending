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




export const validateCreditAccount = (req: Request, res: Response, next: NextFunction) => {
  const { recipientId, amount, recipientIsAdmin } = req.body;

  if (!recipientId || !amount) {
    throw new AppError("Recipient ID and amount are required", 400);
  }

  if (typeof recipientId !== "number" && typeof recipientId !== "string") {
    throw new AppError("Recipient ID must be a number or string", 400);
  }

  // if (typeof amount !== "number" || amount <= 0) {
  //   throw new AppError("Amount must be a positive number", 400);
  // }

  if (recipientIsAdmin !== undefined && typeof recipientIsAdmin !== "boolean") {
    throw new AppError("recipientIsAdmin must be a boolean", 400);
  }

  next();
};

export const validateSendMoney = (req: Request, res: Response, next: NextFunction) => {
  const { recipientAccountNo, amount, description, createdAt } = req.body;

  if (!recipientAccountNo || !amount) {
    throw new AppError("Recipient account number and amount are required", 400);
  }

  if (typeof recipientAccountNo !== "number") {
    throw new AppError("Recipient account number must be a number", 400);
  }

  // if (typeof amount !== "number" || amount <= 0) {
  //   throw new AppError("Amount must be a positive number", 400);
  // }

  if (description && typeof description !== "string") {
    throw new AppError("Description must be a string", 400);
  }

  if (createdAt && isNaN(new Date(createdAt).getTime())) {
    throw new AppError("Invalid createdAt date format", 400);
  }

  next();
};

export const validateSendInternationalMoney = (req: Request, res: Response, next: NextFunction) => {
  const {
    recipientBankName,
    swiftCode,
    senderName,
    senderPhone,
    senderAddress,
    senderCity,
    senderState,
    senderZip,
    recipientName,
    recipientAccount,
    recipientAddress,
    recipientCity,
    recipientState,
    recipientZip,
    amount,
    description,
    additionalInfo,
    createdAt,
  } = req.body;

  if (
    !recipientBankName ||
    !swiftCode ||
    !senderName ||
    !senderPhone ||
    !senderAddress ||
    !senderCity ||
    !senderState ||
    !senderZip ||
    !recipientName ||
    !recipientAccount ||
    !recipientAddress ||
    !recipientCity ||
    !recipientState ||
    !recipientZip ||
    !amount
  ) {
    throw new AppError("All required international transfer fields must be provided", 400);
  }

  if (typeof recipientBankName !== "string" || recipientBankName.trim() === "") {
    throw new AppError("Recipient bank name must be a non-empty string", 400);
  }
  if (typeof swiftCode !== "string" || !/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(swiftCode)) {
    throw new AppError("Invalid SWIFT/BIC code format", 400);
  }
  if (typeof senderName !== "string" || senderName.trim() === "") {
    throw new AppError("Sender name must be a non-empty string", 400);
  }
  if (!/^\+\d{7,15}$/.test(senderPhone)) {
    throw new AppError("Invalid sender phone number format. Please use E.164 format (e.g., +1234567890)", 400);
  }
  if (typeof senderAddress !== "string" || senderAddress.trim() === "") {
    throw new AppError("Sender address must be a non-empty string", 400);
  }
  if (typeof senderCity !== "string" || senderCity.trim() === "") {
    throw new AppError("Sender city must be a non-empty string", 400);
  }
  if (typeof senderState !== "string" || senderState.trim() === "") {
    throw new AppError("Sender state must be a non-empty string", 400);
  }
  if (typeof senderZip !== "string" || senderZip.trim() === "") {
    throw new AppError("Sender ZIP must be a non-empty string", 400);
  }
  if (typeof recipientName !== "string" || recipientName.trim() === "") {
    throw new AppError("Recipient name must be a non-empty string", 400);
  }
  if (typeof recipientAccount !== "number" && typeof recipientAccount !== "string") {
    throw new AppError("Recipient account number must be a number or string", 400);
  }
  // Further validation for recipientAccount if it's a string to ensure it's convertible to BigInt
  if (typeof recipientAccount === "string" && !/^[0-9]+$/.test(recipientAccount)) {
    throw new AppError("Recipient account number string must contain only digits", 400);
  }
  if (typeof recipientAddress !== "string" || recipientAddress.trim() === "") {
    throw new AppError("Recipient address must be a non-empty string", 400);
  }
  if (typeof recipientCity !== "string" || recipientCity.trim() === "") {
    throw new AppError("Recipient city must be a non-empty string", 400);
  }
  if (typeof recipientState !== "string" || recipientState.trim() === "") {
    throw new AppError("Recipient state must be a non-empty string", 400);
  }
  if (typeof recipientZip !== "string" || recipientZip.trim() === "") {
    throw new AppError("Recipient ZIP must be a non-empty string", 400);
  }

  if (typeof amount !== "string" || parseFloat(amount) <= 0) {
    throw new AppError("Amount must be a positive number string", 400);
  }

  if (description && typeof description !== "string") {
    throw new AppError("Description must be a string", 400);
  }

  if (additionalInfo && typeof additionalInfo !== "string") {
    throw new AppError("Additional info must be a string", 400);
  }

  if (createdAt && isNaN(new Date(createdAt).getTime())) {
    throw new AppError("Invalid createdAt date format", 400);
  }

  next();
};

export const validateUpdateTransaction = (req: Request, res: Response, next: NextFunction) => {
  const { transactionId, amount, description, createdAt } = req.body;

  if (!transactionId) {
    throw new AppError("Transaction ID is required", 400);
  }

  if (typeof transactionId !== "number" && typeof transactionId !== "string") {
    throw new AppError("Transaction ID must be a number or string", 400);
  }

  if (amount !== undefined && (typeof amount !== "string" || parseFloat(amount) <= 0)) {
    throw new AppError("Amount must be a positive number string", 400);
  }

  if (description !== undefined && typeof description !== "string") {
    throw new AppError("Description must be a string", 400);
  }

  if (createdAt !== undefined && isNaN(new Date(createdAt).getTime())) {
    throw new AppError("Invalid createdAt date format", 400);
  }

  if (amount === undefined && description === undefined && createdAt === undefined) {
    throw new AppError("At least one field (amount, description, or createdAt) must be provided for update", 400);
  }

  next();
};
