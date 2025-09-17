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
    return this.sendRequest<ArkeselVerifyResponse>("/otp/verify", {
      code,
      number,
    });
  };
}

export const smsService = new SmsService();
