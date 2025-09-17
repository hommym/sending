# Account Feature Documentation

This document outlines the functionality provided by the account management feature, including API endpoints for updating user information, changing passwords, retrieving account details, and deleting accounts.

## Endpoints

All account-related endpoints are prefixed with `/account`.

### 1. Update Account Information

- **URL:** `/account/update-info`
- **Method:** `PUT`
- **Authentication:** Required (JWT token)
- **Description:** Allows a logged-in user or admin to update their name and/or email address.
- **Request Body:**
  ```json
  {
    "name": "New Name (optional)",
    "email": "new.email@example.com (optional)"
  }
  ```
- **Response (Success - 200 OK):**
  ```json
  {
    "message": "Account updated successfully",
    "account": {
      "id": 1,
      "name": "Updated Name",
      "email": "updated.email@example.com",
      "createdAt": "2025-01-01T12:00:00.000Z",
      "updatedAt": "2025-01-01T13:00:00.000Z" // Only for admin
      "isVerified": true // Only for user
    }
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: If `userId` is not found in the request (e.g., invalid or missing token).
  - `404 Not Found`: If the user or admin account does not exist.
  - `409 Conflict`: If the provided email is already in use by another account.

### 2. Change Password

- **URL:** `/account/change-password`
- **Method:** `PATCH`
- **Authentication:** Required (JWT token)
- **Description:** Allows a logged-in user or admin to change their password.
- **Request Body:**
  ```json
  {
    "oldPassword": "current_password",
    "newPassword": "new_strong_password"
  }
  ```
- **Response (Success - 200 OK):**
  ```json
  {
    "message": "Password changed successfully"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: If `userId` is not found in the request.
  - `404 Not Found`: If the user or admin account does not exist.
  - `400 Bad Request`: If `oldPassword` does not match the current password.

### 3. Get Account Details

- **URL:** `/account/details`
- **Method:** `GET`
- **Authentication:** Required (JWT token)
- **Description:** Retrieves the details of the logged-in user or admin account.
- **Response (Success - 200 OK):**
  ```json
  {
    "account": {
      "id": 1,
      "name": "User Name",
      "email": "user.email@example.com",
      "createdAt": "2025-01-01T12:00:00.000Z",
      "updatedAt": "2025-01-01T13:00:00.000Z" // Only for admin
      "isVerified": true // Only for user
    }
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: If `userId` is not found in the request.
  - `404 Not Found`: If the user or admin account does not exist.

### 4. Delete Account

- **URL:** `/account`
- **Method:** `DELETE`
- **Authentication:** Required (JWT token)
- **Description:** Deletes the logged-in user or admin account after verifying the password.
- **Request Body:**
  ```json
  {
    "password": "current_password"
  }
  ```
- **Response (Success - 200 OK):**
  ```json
  {
    "message": "Account deleted successfully"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: If `userId` is not found in the request.
  - `404 Not Found`: If the user or admin account does not exist.
  - `400 Bad Request`: If `password` does not match the current password.