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
    "name": "Your Name" (optional),
    "phone": "+1234567890" (optional, E.164 format, e.g., +23350304789)
  }
  ```
- **Validation:**

  - `email`: Required, valid email format.
  - `password`: Required, minimum 6 characters.
  - `name`: Optional, string.
  - `phone`: Optional, E.164 format (e.g., +1234567890).

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
- **Validation:**
  - `email`: Required, valid email format.
  - `password`: Required.
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
- **Validation:**
  - `email`: Required, valid email format.
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
- **Validation:**
  - `email`: Required, valid email format.
  - `otp`: Required, 6-digit number string.
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
- **Validation:**
  - `email`: Required, valid email format.
  - `otp`: Required, 6-digit number string.
  - `newPassword`: Required, minimum 6 characters.
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
- **Validation:**
  - `email`: Required, valid email format.
  - `otp`: Required, 6-digit number string.
- **Response:**
  ```json
  {
    "message": "Account verified successfully."
  }
  ```

## Account Service

This section details endpoints for managing user and admin accounts.

### 1. Update Account Information

- **URL:** `/api/account/update-info`
- **Method:** `PUT`
- **Description:** Updates the authenticated user's or admin's name and/or email.
- **Authentication:** Required (JWT Token)
- **Request Body:**
  ```json
  {
    "name": "New Name" (optional),
    "email": "new_email@example.com" (optional)
  }
  ```
- **Validation:**
  - At least one of `name` or `email` must be provided.
  - `name`: Optional, string.
  - `email`: Optional, valid email format.
- **Response:**
  ```json
  {
    "message": "Account updated successfully",
    "account": {
      "id": 1,
      "name": "New Name",
      "email": "new_email@example.com",
      "createdAt": "2023-01-01T12:00:00.000Z",
      "isVerified": true (for users) or "updatedAt": "2023-01-01T13:00:00.000Z" (for admins)
    }
  }
  ```

### 2. Change Password

- **URL:** `/api/account/change-password`
- **Method:** `PATCH`
- **Description:** Changes the authenticated user's or admin's password.
- **Authentication:** Required (JWT Token)
- **Request Body:**
  ```json
  {
    "oldPassword": "current_password",
    "newPassword": "new_secure_password"
  }
  ```
- **Validation:**
  - `oldPassword`: Required.
  - `newPassword`: Required, minimum 6 characters.
- **Response:**
  ```json
  {
    "message": "Password changed successfully"
  }
  ```

### 3. Get Account Details

- **URL:** `/api/account/details`
- **Method:** `GET`
- **Description:** Retrieves details for the authenticated user's or admin's account.
- **Authentication:** Required (JWT Token)
- **Response:**
  ```json
  {
    "account": {
      "id": 1,
      "name": "Your Name",
      "email": "user@example.com",
      "createdAt": "2023-01-01T12:00:00.000Z",
      "isVerified": true,
      "account": {
        "accountNo": "1234567890",
        "balance": "1000.00"
      }
    }
  }
  ```

### 4. Delete Account

- **URL:** `/api/account/`
- **Method:** `DELETE`
- **Description:** Deletes the authenticated user's or admin's account.
- **Authentication:** Required (JWT Token)
- **Request Body:**
  ```json
  {
    "password": "your_current_password"
  }
  ```
- **Validation:**
  - `password`: Required.
- **Response:**
  ```json
  {
    "message": "Account deleted successfully"
  }
  ```

### 5. Get All Accounts (Admin Only)

- **URL:** `/api/account/admin/all-accounts`
- **Method:** `GET`
- **Description:** Admin-only endpoint to retrieve details of all user and admin accounts in the system.
- **Authentication:** Required (Admin JWT Token)
- **Response:**
  ```json
  {
    "users": [
      {
        "id": 1,
        "name": "User Name",
        "email": "user@example.com",
        "createdAt": "2023-01-01T12:00:00.000Z",
        "isVerified": true,
        "account": {
          "accountNo": "1234567890",
          "balance": "1000.00"
        }
      }
    ],
    "admins": [
      {
        "id": 1,
        "name": "Admin Name",
        "email": "admin@example.com",
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T13:00:00.000Z"
      }
    ]
  }
  ```

## Transaction Service

This section outlines endpoints for managing money transactions.

### 1. Credit Account (Admin Only)

- **URL:** `/api/transactions/credit`
- **Method:** `POST`
- **Description:** Admin-only endpoint to credit a user's or admin's account with a specified amount.
- **Authentication:** Required (Admin JWT Token)
- **Request Body:**
  ```json
  {
    "recipientId": 1,
    "amount": 100.00,
    "recipientIsAdmin": false (optional)
  }
  ```
- **Validation:**
  - `recipientId`: Required, number or string.
  - `amount`: Required, positive number.
  - `recipientIsAdmin`: Optional, boolean.
- **Response:**
  ```json
  {
    "message": "Account credited successfully",
    "newBalance": 1100.0
  }
  ```

### 2. Send Money

- **URL:** `/api/transactions/send`
- **Method:** `POST`
- **Description:** Sends money from the authenticated user's account to another user's account.
- **Authentication:** Required (User JWT Token)
- **Request Body:**
  ```json
  {
    "recipientAccountNo": 1234567890,
    "amount": 50.00,
    "description": "For groceries" (optional),
    "createdAt": "2023-01-01T12:00:00.000Z" (optional)
  }
  ```
- **Validation:**
  - `recipientAccountNo`: Required, number.
  - `amount`: Required, positive number.
  - `description`: Optional, string.
  - `createdAt`: Optional, valid ISO 8601 date string.
- **Response:**
  ```json
  {
    "message": "Money sent successfully",
    "newBalance": 950.0
  }
  ```

### 3. Get User Transactions

- **URL:** `/api/transactions/history`
- **Method:** `GET`
- **Description:** Retrieves all transaction history for the authenticated user.
- **Authentication:** Required (User JWT Token)
- **Response:**
  ```json
  {
    "transactions": [
      {
        "ref": 1,
        "amount": 100.0,
        "description": "Initial credit",
        "type": "recipient",
        "ownerId": 1,
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      }
    ]
  }
  ```

### 4. Get All Transactions (Admin Only)

- **URL:** `/api/transactions/admin/history`
- **Method:** `GET`
- **Description:** Admin-only endpoint to retrieve all transaction history in the system.
- **Authentication:** Required (Admin JWT Token)
- **Response:**
  ```json
  {
    "transactions": [
      {
        "ref": 1,
        "amount": 100.0,
        "description": "Initial credit",
        "type": "recipient",
        "ownerId": 1,
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      }
      // ... more transactions
    ]
  }
  ```
