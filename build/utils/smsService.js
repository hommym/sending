"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsService = void 0;
const axios_1 = __importDefault(require("axios"));
const errorHandler_1 = require("../middlewares/errorHandler");
class SmsService {
    constructor() {
        this.apiKey = process.env.SMS_APIKEY;
        this.generateOtpUrl = "https://sms.arkesel.com/api/otp/generate";
        this.verifyOtpUrl = "https://sms.arkesel.com/api/otp/verify";
        this.generateOtp = async (args) => {
            const { expiry = 5, length = 6, medium = "sms", message = "This is your OTP from Arkesel: %otp_code%", number, sender_id = "Arkesel", type = "numeric", } = args;
            try {
                const response = await axios_1.default.post(this.generateOtpUrl, {
                    expiry,
                    length,
                    medium,
                    message,
                    number,
                    sender_id,
                    type,
                }, {
                    headers: {
                        "api-key": this.apiKey,
                    },
                });
                if (response.data.code !== "1000") {
                    throw new errorHandler_1.AppError(response.data.message, 400);
                }
                return response.data;
            }
            catch (error) {
                throw new errorHandler_1.AppError(error.message || "Failed to send OTP", 500);
            }
        };
        this.verifyOtp = async (args) => {
            const { code, number } = args;
            try {
                const response = await axios_1.default.post(this.verifyOtpUrl, {
                    code,
                    number,
                }, {
                    headers: {
                        "api-key": this.apiKey,
                    },
                });
                if (response.data.code !== "1000") {
                    throw new errorHandler_1.AppError(response.data.message, 400);
                }
                return response.data;
            }
            catch (error) {
                throw new errorHandler_1.AppError(error.message || "Failed to verify OTP", 500);
            }
        };
    }
}
exports.smsService = new SmsService();
