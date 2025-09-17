import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { AppError } from "../middlewares/errorHandler";
import { GenerateAndSendOtpArgs, ArkeselGenerateResponse, VerifySmsOtpArgs, ArkeselVerifyResponse } from "../types/generalTypes";

const ARKESEL_API_KEY = process.env.SMS_APIKEY;
const ARKESEL_BASE_URL = "https://sms.arkesel.com/api";

class SmsService {
  private async sendRequest<T>(endpoint: string, data: any): Promise<T> {
    if (!ARKESEL_API_KEY) {
      throw new AppError("Arkesel API key not configured", 500);
    }
    try {
      const response = await axios.post<T>(`${ARKESEL_BASE_URL}${endpoint}`, data, {
        headers: {
          "api-key": ARKESEL_API_KEY,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new AppError(error.response.data.message || "Arkesel API Error", error.response.status);
      } else {
        throw new AppError("Failed to communicate with Arkesel API", 500);
      }
    }
  }

  public generateAndSendOtp = async (args: GenerateAndSendOtpArgs): Promise<ArkeselGenerateResponse> => {
    const { number, sender_id, message, type, medium, expiry, length } = args;

    if (!number || !sender_id || !message || !type || !medium || !expiry || !length) {
      throw new AppError("Missing required fields for OTP generation", 400);
    }

    if (typeof number !== "string" || !/^\\+?[1-9]\d{1,14}$/.test(number)) {
      throw new AppError("Invalid phone number format for OTP generation. Please use E.164 format (e.g., +1234567890)", 400);
    }
    if (typeof sender_id !== "string") {
      throw new AppError("Sender ID must be a string", 400);
    }
    if (typeof message !== "string" || message.length === 0) {
      throw new AppError("Message cannot be empty", 400);
    }
    if (!["numeric", "alphanumeric"].includes(type)) {
      throw new AppError("OTP type must be 'numeric' or 'alphanumeric'", 400);
    }
    if (!["sms", "voice"].includes(medium)) {
      throw new AppError("OTP medium must be 'sms' or 'voice'", 400);
    }
    if (typeof expiry !== "number" || expiry <= 0) {
      throw new AppError("Expiry must be a positive number", 400);
    }
    if (typeof length !== "number" || length <= 0) {
      throw new AppError("Length must be a positive number", 400);
    }

    return this.sendRequest<ArkeselGenerateResponse>("/otp/generate", {
      number,
      sender_id,
      message,
      type,
      medium,
      expiry,
      length,
    });
  };

  public verifyOtp = async (args: VerifySmsOtpArgs): Promise<ArkeselVerifyResponse> => {
    const { code, number } = args;

    if (!code || !number) {
      throw new AppError("Missing required fields for OTP verification", 400);
    }

    if (typeof code !== "string" || code.length === 0) {
      throw new AppError("OTP code cannot be empty", 400);
    }
    if (typeof number !== "string" || !/^\\+?[1-9]\d{1,14}$/.test(number)) {
      throw new AppError("Invalid phone number format for OTP verification. Please use E.164 format (e.g., +1234567890)", 400);
    }

    return this.sendRequest<ArkeselVerifyResponse>("/otp/verify", {
      code,
      number,
    });
  };
}

export const smsService = new SmsService();
