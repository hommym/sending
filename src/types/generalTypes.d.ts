export type WelcomeEmailArgs = {
  recipientEmail: string;
  fullName: string;
};

export type ResetAccountEmailArgs = {
  recipientEmail: string;
  fullName: string;
  plainPassword: string;
};

export type AuthSignInArgs = {
  email: string;
  password: string;
  name?: string;
};

export type AuthLogInArgs = {
  email: string;
  password: string;
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
