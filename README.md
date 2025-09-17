# Authentication Service

This document outlines the authentication routes and how to access them.

## Routes

The authentication service provides the following endpoints:

### 1. Sign Up (Register)

- **URL:** `/api/auth/signup`
- **Method:** `POST`
- **Description:** Registers a new user and sends an OTP for email verification.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "your_password",
    "name": "Your Name" (optional)
  }
  ```
- **Response:**
  ```json
  {
    "message": "Account created. Please verify your email with the OTP."
  }
  ```

### 2. Log In

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Description:** Authenticates an existing user (or admin) and returns a JWT token. Requires account to be verified for regular users.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "your_password",
    "isAdmin": false (optional, defaults to false)
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "Your Name",
      "createdAt": "2023-01-01T12:00:00.000Z"
    },
    "role": "user" | "admin"
  }
  ```

### 3. Send OTP (One-Time Password)

- **URL:** `/api/auth/send-otp`
- **Method:** `POST`
- **Description:** Sends an OTP to the user's registered email for password reset or verification.
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "message": "OTP sent successfully"
  }
  ```

### 4. Verify OTP

- **URL:** `/api/auth/verify-otp`
- **Method:** `POST`
- **Description:** Verifies the provided OTP.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "otp": "123456"
  }
  ```
- **Response:**
  ```json
  {
    "message": "OTP verified successfully"
  }
  ```

### 5. Reset Password

- **URL:** `/api/auth/reset-password`
- **Method:** `POST`
- **Description:** Resets the user's password after successful OTP verification.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "otp": "123456",
    "newPassword": "new_secure_password"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Password reset successfully"
  }
  ```

### 6. Verify Account

- **URL:** `/api/auth/verify-account`
- **Method:** `POST`
- **Description:** Verifies a newly registered user's account using an OTP sent to their email.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "otp": "123456"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Account verified successfully."
  }
  ```
