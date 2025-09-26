"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSendInternationalMoney = exports.validateSendMoney = exports.validateCreditAccount = exports.validateDeleteAccount = exports.validateChangePassword = exports.validateUpdateAccountInfo = exports.validateResetPassword = exports.validateVerifyOtp = exports.validateSendOtp = exports.validateLogin = exports.validateSignUp = void 0;
const errorHandler_1 = require("./errorHandler");
const validateSignUp = (req, res, next) => {
    const { email, password, name, phone } = req.body;
    if (!email || !password) {
        throw new errorHandler_1.AppError("Email and password are required", 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new errorHandler_1.AppError("Invalid email format", 400);
    }
    if (password.length < 6) {
        throw new errorHandler_1.AppError("Password must be at least 6 characters long", 400);
    }
    if (name && typeof name !== "string") {
        throw new errorHandler_1.AppError("Name must be a string", 400);
    }
    if (phone && !/^\+\d{7,15}$/.test(phone)) {
        throw new errorHandler_1.AppError("Invalid phone number format. Please use E.164 format (e.g., +1234567890)", 400);
    }
    next();
};
exports.validateSignUp = validateSignUp;
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new errorHandler_1.AppError("Email and password are required", 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new errorHandler_1.AppError("Invalid email format", 400);
    }
    next();
};
exports.validateLogin = validateLogin;
const validateSendOtp = (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        throw new errorHandler_1.AppError("Email is required", 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new errorHandler_1.AppError("Invalid email format", 400);
    }
    next();
};
exports.validateSendOtp = validateSendOtp;
const validateVerifyOtp = (req, res, next) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        throw new errorHandler_1.AppError("Email and OTP are required", 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new errorHandler_1.AppError("Invalid email format", 400);
    }
    if (!/^\d{6}$/.test(otp)) {
        throw new errorHandler_1.AppError("OTP must be a 6-digit number", 400);
    }
    next();
};
exports.validateVerifyOtp = validateVerifyOtp;
const validateResetPassword = (req, res, next) => {
    const { email, newPassword, otp } = req.body;
    if (!email || !newPassword || !otp) {
        throw new errorHandler_1.AppError("Email, new password, and OTP are required", 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new errorHandler_1.AppError("Invalid email format", 400);
    }
    if (newPassword.length < 6) {
        throw new errorHandler_1.AppError("New password must be at least 6 characters long", 400);
    }
    if (!/^\d{6}$/.test(otp)) {
        throw new errorHandler_1.AppError("OTP must be a 6-digit number", 400);
    }
    next();
};
exports.validateResetPassword = validateResetPassword;
const validateUpdateAccountInfo = (req, res, next) => {
    const { name, email } = req.body;
    if (!name && !email) {
        throw new errorHandler_1.AppError("At least one of 'name' or 'email' must be provided for update", 400);
    }
    if (name && typeof name !== "string") {
        throw new errorHandler_1.AppError("Name must be a string", 400);
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new errorHandler_1.AppError("Invalid email format", 400);
    }
    next();
};
exports.validateUpdateAccountInfo = validateUpdateAccountInfo;
const validateChangePassword = (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new errorHandler_1.AppError("Old password and new password are required", 400);
    }
    if (newPassword.length < 6) {
        throw new errorHandler_1.AppError("New password must be at least 6 characters long", 400);
    }
    next();
};
exports.validateChangePassword = validateChangePassword;
const validateDeleteAccount = (req, res, next) => {
    const { password } = req.body;
    if (!password) {
        throw new errorHandler_1.AppError("Password is required to delete account", 400);
    }
    next();
};
exports.validateDeleteAccount = validateDeleteAccount;
const validateCreditAccount = (req, res, next) => {
    const { recipientId, amount, recipientIsAdmin } = req.body;
    if (!recipientId || !amount) {
        throw new errorHandler_1.AppError("Recipient ID and amount are required", 400);
    }
    if (typeof recipientId !== "number" && typeof recipientId !== "string") {
        throw new errorHandler_1.AppError("Recipient ID must be a number or string", 400);
    }
    // if (typeof amount !== "number" || amount <= 0) {
    //   throw new AppError("Amount must be a positive number", 400);
    // }
    if (recipientIsAdmin !== undefined && typeof recipientIsAdmin !== "boolean") {
        throw new errorHandler_1.AppError("recipientIsAdmin must be a boolean", 400);
    }
    next();
};
exports.validateCreditAccount = validateCreditAccount;
const validateSendMoney = (req, res, next) => {
    const { recipientAccountNo, amount, description, createdAt } = req.body;
    if (!recipientAccountNo || !amount) {
        throw new errorHandler_1.AppError("Recipient account number and amount are required", 400);
    }
    if (typeof recipientAccountNo !== "number") {
        throw new errorHandler_1.AppError("Recipient account number must be a number", 400);
    }
    if (typeof amount !== "number" || amount <= 0) {
        throw new errorHandler_1.AppError("Amount must be a positive number", 400);
    }
    if (description && typeof description !== "string") {
        throw new errorHandler_1.AppError("Description must be a string", 400);
    }
    if (createdAt && isNaN(new Date(createdAt).getTime())) {
        throw new errorHandler_1.AppError("Invalid createdAt date format", 400);
    }
    next();
};
exports.validateSendMoney = validateSendMoney;
const validateSendInternationalMoney = (req, res, next) => {
    const { recipientBankName, swiftCode, senderName, senderPhone, senderAddress, senderCity, senderState, senderZip, recipientName, recipientAccount, recipientAddress, recipientCity, recipientState, recipientZip, amount, description, additionalInfo, createdAt, } = req.body;
    if (!recipientBankName ||
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
        !amount) {
        throw new errorHandler_1.AppError("All required international transfer fields must be provided", 400);
    }
    if (typeof recipientBankName !== "string" || recipientBankName.trim() === "") {
        throw new errorHandler_1.AppError("Recipient bank name must be a non-empty string", 400);
    }
    if (typeof swiftCode !== "string" || !/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(swiftCode)) {
        throw new errorHandler_1.AppError("Invalid SWIFT/BIC code format", 400);
    }
    if (typeof senderName !== "string" || senderName.trim() === "") {
        throw new errorHandler_1.AppError("Sender name must be a non-empty string", 400);
    }
    if (!/^\+\d{7,15}$/.test(senderPhone)) {
        throw new errorHandler_1.AppError("Invalid sender phone number format. Please use E.164 format (e.g., +1234567890)", 400);
    }
    if (typeof senderAddress !== "string" || senderAddress.trim() === "") {
        throw new errorHandler_1.AppError("Sender address must be a non-empty string", 400);
    }
    if (typeof senderCity !== "string" || senderCity.trim() === "") {
        throw new errorHandler_1.AppError("Sender city must be a non-empty string", 400);
    }
    if (typeof senderState !== "string" || senderState.trim() === "") {
        throw new errorHandler_1.AppError("Sender state must be a non-empty string", 400);
    }
    if (typeof senderZip !== "string" || senderZip.trim() === "") {
        throw new errorHandler_1.AppError("Sender ZIP must be a non-empty string", 400);
    }
    if (typeof recipientName !== "string" || recipientName.trim() === "") {
        throw new errorHandler_1.AppError("Recipient name must be a non-empty string", 400);
    }
    if (typeof recipientAccount !== "number" && typeof recipientAccount !== "string") {
        throw new errorHandler_1.AppError("Recipient account number must be a number or string", 400);
    }
    // Further validation for recipientAccount if it's a string to ensure it's convertible to BigInt
    if (typeof recipientAccount === "string" && !/^[0-9]+$/.test(recipientAccount)) {
        throw new errorHandler_1.AppError("Recipient account number string must contain only digits", 400);
    }
    if (typeof recipientAddress !== "string" || recipientAddress.trim() === "") {
        throw new errorHandler_1.AppError("Recipient address must be a non-empty string", 400);
    }
    if (typeof recipientCity !== "string" || recipientCity.trim() === "") {
        throw new errorHandler_1.AppError("Recipient city must be a non-empty string", 400);
    }
    if (typeof recipientState !== "string" || recipientState.trim() === "") {
        throw new errorHandler_1.AppError("Recipient state must be a non-empty string", 400);
    }
    if (typeof recipientZip !== "string" || recipientZip.trim() === "") {
        throw new errorHandler_1.AppError("Recipient ZIP must be a non-empty string", 400);
    }
    if (typeof amount !== "string" || parseFloat(amount) <= 0) {
        throw new errorHandler_1.AppError("Amount must be a positive number string", 400);
    }
    if (description && typeof description !== "string") {
        throw new errorHandler_1.AppError("Description must be a string", 400);
    }
    if (additionalInfo && typeof additionalInfo !== "string") {
        throw new errorHandler_1.AppError("Additional info must be a string", 400);
    }
    if (createdAt && isNaN(new Date(createdAt).getTime())) {
        throw new errorHandler_1.AppError("Invalid createdAt date format", 400);
    }
    next();
};
exports.validateSendInternationalMoney = validateSendInternationalMoney;
