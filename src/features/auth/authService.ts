import { database } from "../../db/db";
import { encryptData, verifyEncryptedData } from "../../middlewares/bcrypt";
import { AppError } from "../../middlewares/errorHandler";
import { jwtForLogIn } from "../../middlewares/jwt";
import { emailService } from "../../utils/emailService";
import { AuthSignInArgs, AuthLogInArgs, AuthSendOtpArgs, AuthVerifyOtpArgs, AuthResetPasswordArgs } from "../../types/generalTypes";

class AuthService {
  public signIn = async (args: AuthSignInArgs) => {
    const { email, password, name } = args;

    const existingUser = await database.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
    }

    const hashedPassword = await encryptData(password);

    const newUser = await database.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = jwtForLogIn(newUser.id);
    await emailService.sendWelcomeEmail({ fullName: newUser.name || "User", recipientEmail: newUser.email });

    return { token, user: newUser };
  };

  public sendOtp = async (args: AuthSendOtpArgs) => {
    const { email } = args;

    const user = await database.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    await database.otp.upsert({
      where: { userId: user.id },
      update: { code: otpCode, expiresAt },
      create: { userId: user.id, code: otpCode, expiresAt },
    });

    await emailService.sendPasswordResetEmail({
      fullName: user.name || "User",
      recipientEmail: user.email,
      plainPassword: otpCode, // Sending OTP as plain password for simplicity, can be changed to a dedicated OTP email
    });

    return { message: "OTP sent successfully" };
  };

  public verifyOtp = async (args: AuthVerifyOtpArgs) => {
    const { email, otp } = args;

    const user = await database.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const storedOtp = await database.otp.findUnique({ where: { userId: user.id } });

    if (!storedOtp || storedOtp.code !== otp || storedOtp.expiresAt < new Date()) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    await database.otp.delete({ where: { userId: user.id } });

    return { message: "OTP verified successfully" };
  };

  public logIn = async (args: AuthLogInArgs) => {
    const { email, password } = args;

    const user = await database.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    await verifyEncryptedData(password, user.password);

    const token = jwtForLogIn(user.id);

    return { token, user };
  };

  public resetPassword = async (args: AuthResetPasswordArgs) => {
    const { email, newPassword, otp } = args;

    const user = await database.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const storedOtp = await database.otp.findUnique({ where: { userId: user.id } });

    if (!storedOtp || storedOtp.code !== otp || storedOtp.expiresAt < new Date()) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    const hashedPassword = await encryptData(newPassword);

    await database.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await database.otp.delete({ where: { userId: user.id } });

    return { message: "Password reset successfully" };
  };
}

export const authService = new AuthService();
