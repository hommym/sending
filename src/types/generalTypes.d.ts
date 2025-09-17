export type WelcomeEmailArgs = {
  recipientEmail: string;
  fullName: string;
};

export type OtpEmailArgs = {
  recipientEmail: string;
  fullName: string;
  otp: string;
};

export type AuthSignUpArgs = {
  email: string;
  password: string;
  name?: string;
};

export type AuthLogInArgs = {
  email: string;
  password: string;
  isAdmin?: boolean;
};

export type AuthSendOtpArgs = {
  email: string;
};

export type AuthVerifyOtpArgs = {
  email: string;
  otp: string;
};

export type AuthResetPasswordArgs = {
  email: string;
  newPassword: string;
  otp: string;
};

export type AuthVerifyAccountArgs = {
  email: string;
  otp: string;
};

export type AccountUpdateInfoArgs = {
  userId: number | string;
  name?: string;
  email?: string;
  isAdmin?: boolean;
};

export type AccountChangePasswordArgs = {
  userId: number | string;
  oldPassword: string;
  newPassword: string;
  isAdmin?: boolean;
};

export type AccountDeleteArgs = {
  userId: number | string;
  password: string;
  isAdmin?: boolean;
};

export type CreditAccountArgs = {
  recipientId: number | string;
  amount: string;
  recipientIsAdmin?: boolean;
};

export type SendMoneyArgs = {
  senderId: number | string;
  recipientAccountNo: number;
  amount: string;
  description?: string;
};

export type GetTransactionsArgs = {
  userId: number | string;
  isAdmin?: boolean;
};

export type GenerateAndSendOtpArgs = {
  number: string;
  sender_id: string;
  message: string;
  type: "numeric" | "alphanumeric";
  medium: "sms" | "voice";
  expiry: number;
  length: number;
};

export type VerifySmsOtpArgs = {
  code: string;
  number: string;
};

export type ArkeselGenerateResponse = {
  code: string;
  ussd_code: string;
  message: string;
};

export type ArkeselVerifyResponse = {
  code: string;
  ussd_code: string;
  message: string;
};
