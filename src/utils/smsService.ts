import axios from "axios";
import { AppError } from "../middlewares/errorHandler";

interface GenerateOtpArgs {
  expiry?: number;
  length?: number;
  medium?: "sms" | "voice";
  message?: string;
  number: string;
  sender_id?: string;
  type?: "numeric" | "alphanumeric";
}

interface VerifyOtpArgs {
  code: string;
  number: string;
}

class SmsService {
  private apiKey = process.env.SMS_APIKEY;
  private generateOtpUrl = "https://sms.arkesel.com/api/otp/generate";
  private verifyOtpUrl = "https://sms.arkesel.com/api/otp/verify";

  public generateOtp = async (args: GenerateOtpArgs) => {
    const {
      expiry = 5,
      length = 6,
      medium = "sms",
      message = "This is your OTP from Arkesel: %otp_code%",
      number,
      sender_id = "Arkesel",
      type = "numeric",
    } = args;

    try {
      const response = await axios.post(
        this.generateOtpUrl,
        {
          expiry,
          length,
          medium,
          message,
          number,
          sender_id,
          type,
        },
        {
          headers: {
            "api-key": this.apiKey,
          },
        }
      );

      if (response.data.code !== "1000") {
        throw new AppError(response.data.message, 400);
      }

      return response.data;
    } catch (error: any) {
      throw new AppError(error.message || "Failed to send OTP", 500);
    }
  };

  public verifyOtp = async (args: VerifyOtpArgs) => {
    const { code, number } = args;

    try {
      const response = await axios.post(
        this.verifyOtpUrl,
        {
          code,
          number,
        },
        {
          headers: {
            "api-key": this.apiKey,
          },
        }
      );

      if (response.data.code !== "1000") {
        throw new AppError(response.data.message, 400);
      }

      return response.data;
    } catch (error: any) {
      throw new AppError(error.message || "Failed to verify OTP", 500);
    }
  };
}

export const smsService = new SmsService();