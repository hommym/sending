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
