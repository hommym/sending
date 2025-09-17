"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const axios_1 = __importDefault(require("axios"));
const errorHandler_1 = require("../middlewares/errorHandler");
const ARKESEL_API_KEY = process.env.SMS_APIKEY;
const ARKESEL_BASE_URL = "https://sms.arkesel.com/api";
class SmsService {
    constructor() {
        this.generateAndSendOtp = async (args) => {
            const { number, sender_id, message, type, medium, expiry, length } = args;
            if (!number || !sender_id || !message || !type || !medium || !expiry || !length) {
                throw new errorHandler_1.AppError("Missing required fields for OTP generation", 400);
            }
            if (typeof number !== "string" || !/^\\+?[1-9]\d{1,14}$/.test(number)) {
                throw new errorHandler_1.AppError("Invalid phone number format for OTP generation. Please use E.164 format (e.g., +1234567890)", 400);
            }
            if (typeof sender_id !== "string") {
                throw new errorHandler_1.AppError("Sender ID must be a string", 400);
            }
            if (typeof message !== "string" || message.length === 0) {
                throw new errorHandler_1.AppError("Message cannot be empty", 400);
            }
            if (!["numeric", "alphanumeric"].includes(type)) {
                throw new errorHandler_1.AppError("OTP type must be 'numeric' or 'alphanumeric'", 400);
            }
            if (!["sms", "voice"].includes(medium)) {
                throw new errorHandler_1.AppError("OTP medium must be 'sms' or 'voice'", 400);
            }
            if (typeof expiry !== "number" || expiry <= 0) {
                throw new errorHandler_1.AppError("Expiry must be a positive number", 400);
            }
            if (typeof length !== "number" || length <= 0) {
                throw new errorHandler_1.AppError("Length must be a positive number", 400);
            }
            return this.sendRequest("/otp/generate", {
                number,
                sender_id,
                message,
                type,
                medium,
                expiry,
                length,
            });
        };
        this.verifyOtp = async (args) => {
            const { code, number } = args;
            if (!code || !number) {
                throw new errorHandler_1.AppError("Missing required fields for OTP verification", 400);
            }
            if (typeof code !== "string" || code.length === 0) {
                throw new errorHandler_1.AppError("OTP code cannot be empty", 400);
            }
            if (typeof number !== "string" || !/^\\+?[1-9]\d{1,14}$/.test(number)) {
                throw new errorHandler_1.AppError("Invalid phone number format for OTP verification. Please use E.164 format (e.g., +1234567890)", 400);
            }
            return this.sendRequest("/otp/verify", {
                code,
                number,
            });
        };
    }
    async sendRequest(endpoint, data) {
        if (!ARKESEL_API_KEY) {
            throw new errorHandler_1.AppError("Arkesel API key not configured", 500);
        }
        try {
            const response = await axios_1.default.post(`${ARKESEL_BASE_URL}${endpoint}`, data, {
                headers: {
                    "api-key": ARKESEL_API_KEY,
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                throw new errorHandler_1.AppError(error.response.data.message || "Arkesel API Error", error.response.status);
            }
            else {
                throw new errorHandler_1.AppError("Failed to communicate with Arkesel API", 500);
            }
        }
    }
}
exports.smsService = new SmsService();
