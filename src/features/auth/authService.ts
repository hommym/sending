import { database } from "../../db/db";
import { encryptData, verifyEncryptedData } from "../../utils/bcrypt";
import { AppError } from "../../middlewares/errorHandler";
import { jwtForLogIn } from "../../utils/jwt";
import { emailService } from "../../utils/emailService";
import { AuthSignUpArgs, AuthLogInArgs, AuthSendOtpArgs, AuthVerifyOtpArgs, AuthResetPasswordArgs, AuthVerifyAccountArgs, OtpEmailArgs } from "../../types/generalTypes";
import { PrismaClient } from "@prisma/client";

const prisma = database as PrismaClient;

class AuthService {
  public signUp = async (args: AuthSignUpArgs) => {
    const { email, password, name } = args;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
    }

    const hashedPassword = await encryptData(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Send OTP for account verification
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    await prisma.otp.upsert({
      where: { userId: newUser.id },
      update: { code: otpCode, expiresAt },
      create: { userId: newUser.id, code: otpCode, expiresAt },
    });

    await emailService.sendOtpEmail({
      fullName: newUser.name || "User",
      recipientEmail: newUser.email,
      otp: otpCode,
    });

    return { message: "Account created. Please verify your email with the OTP." };
  };

  public sendOtp = async (args: AuthSendOtpArgs) => {
    const { email } = args;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    await prisma.otp.upsert({
      where: { userId: user.id },
      update: { code: otpCode, expiresAt },
      create: { userId: user.id, code: otpCode, expiresAt },
    });

    await emailService.sendOtpEmail({
      fullName: user.name || "User",
      recipientEmail: user.email,
      otp: otpCode,
    });

    return { message: "OTP sent successfully" };
  };

  public verifyOtp = async (args: AuthVerifyOtpArgs) => {
    const { email, otp } = args;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const storedOtp = await prisma.otp.findUnique({ where: { userId: user.id } });

    if (!storedOtp || storedOtp.code !== otp || storedOtp.expiresAt < new Date()) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    await prisma.otp.delete({ where: { userId: user.id } });

    return { message: "OTP verified successfully" };
  };

  public logIn = async (args: AuthLogInArgs) => {
    const { email, password, isAdmin } = args;

    if (isAdmin) {
      const admin = await prisma.admin.findUnique({ where: { email } });
      if (!admin) {
        throw new AppError("Invalid credentials", 401);
      }

      await verifyEncryptedData(password, admin.password);

      const token = jwtForLogIn(admin.id, true);

      return { token, user: admin, role: "admin" };
    } else {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new AppError("Invalid credentials", 401);
      }

      if (!user.isVerified) {
        throw new AppError("Account not verified. Please verify your email.", 401);
      }

      await verifyEncryptedData(password, user.password);

      const token = jwtForLogIn(user.id);

      // Check if the user has an account, if not, create one
      let account = await prisma.account.findUnique({ where: { userId: user.id } });

      if (!account) {
        const accountNumber = await this.generateTenDigitAccountNumber();
        account = await prisma.account.create({
          data: {
            userId: user.id,
            accountNo: accountNumber,
          },
        });
      }

      return { token, user, role: "user" };
    }
  };

  private generateTenDigitAccountNumber = async (): Promise<number> => {
    let accountNumber: number;
    let isUnique = false;
    do {
      accountNumber = Math.floor(1000000000 + Math.random() * 9000000000); // 10-digit number
      const existingAccount = await prisma.account.findUnique({
        where: { accountNo: accountNumber },
      });
      if (!existingAccount) {
        isUnique = true;
      }
    } while (!isUnique);
    return accountNumber;
  };

  public resetPassword = async (args: AuthResetPasswordArgs) => {
    const { email, newPassword, otp } = args;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const storedOtp = await prisma.otp.findUnique({ where: { userId: user.id } });

    if (!storedOtp || storedOtp.code !== otp || storedOtp.expiresAt < new Date()) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    const hashedPassword = await encryptData(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await prisma.otp.delete({ where: { userId: user.id } });

    return { message: "Password reset successfully" };
  };

  public verifyAccount = async (args: AuthVerifyAccountArgs) => {
    const { email, otp } = args;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.isVerified) {
      throw new AppError("Account already verified", 400);
    }

    const storedOtp = await prisma.otp.findUnique({ where: { userId: user.id } });

    if (!storedOtp || storedOtp.code !== otp || storedOtp.expiresAt < new Date()) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    await prisma.otp.delete({ where: { userId: user.id } });

    return { message: "Account verified successfully." };
  };
}

export const authService = new AuthService();
