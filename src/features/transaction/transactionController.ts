import { Router } from "express";
import { transactionService } from "./transactionService";
import { verifyAuthToken } from "../../utils/jwt";
import { AppError } from "../../middlewares/errorHandler";
import { validateCreditAccount, validateSendMoney, validateSendInternationalMoney } from "../../middlewares/validation";

export const transactionRouter = Router();

// Admin only: Credit a user's account
transactionRouter.post("/credit", verifyAuthToken, validateCreditAccount, async (req, res, next) => {
  try {
    const { recipientId, amount, recipientIsAdmin } = req.body;
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
      throw new AppError("Unauthorized: Admins only", 403);
    }

    if (!recipientId || !amount) {
      throw new AppError("Recipient ID and amount are required", 400);
    }

    const result = await transactionService.creditAccount({ recipientId, amount, recipientIsAdmin });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// User: Send money to another account
transactionRouter.post("/send", verifyAuthToken, validateSendMoney, async (req, res, next) => {
  try {
    const { recipientAccountNo, amount, description, createdAt } = req.body;
    const senderId = req.userId;

    if (!senderId) {
      throw new AppError("Unauthorized: User ID not found", 401);
    }

    if (!recipientAccountNo || !amount) {
      throw new AppError("Recipient account number and amount are required", 400);
    }

    const result = await transactionService.sendMoney({ senderId, recipientAccountNo, amount, description, createdAt });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// User: Send money to another account (international)
transactionRouter.post("/international-send", verifyAuthToken, validateSendInternationalMoney, async (req, res, next) => {
  try {
    const {
      recipientBankName,
      swiftCode,
      senderName,
      senderPhone,
      senderAddress,
      senderCity,
      senderState,
      senderZip,
      recipientName,
      recipientAccount,
      recipientAddress,
      recipientCity,
      recipientState,
      recipientZip,
      amount,
      description,
      additionalInfo,
      createdAt,
    } = req.body;
    const senderId = req.userId;

    if (!senderId) {
      throw new AppError("Unauthorized: User ID not found", 401);
    }

    const result = await transactionService.sendInternationalMoney({
      senderId,
      recipientBankName,
      swiftCode,
      senderName,
      senderPhone,
      senderAddress,
      senderCity,
      senderState,
      senderZip,
      recipientName,
      recipientAccount,
      recipientAddress,
      recipientCity,
      recipientState,
      recipientZip,
      amount,
      description,
      additionalInfo,
      createdAt,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// User: Get all transactions for the authenticated user
transactionRouter.get("/history", verifyAuthToken, async (req, res, next) => {
  try {
    const userId = req.userId;
    const isAdmin = req.isAdmin || false; // Default to false for user endpoint

    if (!userId) {
      throw new AppError("Unauthorized: User ID not found", 401);
    }

    const result = await transactionService.getTransactions({ userId, isAdmin: false }); // Explicitly set isAdmin to false for user history
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// Admin only: Get all transactions in the system
transactionRouter.get("/admin/history", verifyAuthToken, async (req, res, next) => {
  try {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
      throw new AppError("Unauthorized: Admins only", 403);
    }

    const result = await transactionService.getTransactions({ userId: "", isAdmin: true }); // userId is not relevant for admin all transactions
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
