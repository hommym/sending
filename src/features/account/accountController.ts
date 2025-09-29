import { Router } from "express";
import { accountService } from "./accountService";
import { verifyAuthToken } from "../../utils/jwt";
import { AppError } from "../../middlewares/errorHandler";
import { validateUpdateAccountInfo, validateChangePassword } from "../../middlewares/validation";

export const accountRouter = Router();

accountRouter.put("/update-info", verifyAuthToken, validateUpdateAccountInfo, async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.userId;
    const isAdmin = req.isAdmin;

    if (!userId) {
      throw new AppError("Unauthorized: User ID not found", 401);
    }

    const result = await accountService.updateAccountInfo({ userId, name, email, isAdmin });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

accountRouter.patch("/change-password", verifyAuthToken, validateChangePassword, async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.userId;
    const isAdmin = req.isAdmin;

    if (!userId) {
      throw new AppError("Unauthorized: User ID not found", 401);
    }

    const result = await accountService.changePassword({ userId, oldPassword, newPassword, isAdmin });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

accountRouter.get("/details", verifyAuthToken, async (req, res, next) => {
  try {
    const userId = req.userId;
    const isAdmin = req.isAdmin || false;

    if (!userId) {
      throw new AppError("Unauthorized: User ID not found", 401);
    }

    const result = await accountService.getAccountDetails(userId, isAdmin);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

accountRouter.delete("/", verifyAuthToken, async (req, res, next) => {
  try {
    const userId = req.userId;
    const isAdmin = req.isAdmin;

    if (!userId) {
      throw new AppError("Unauthorized: User ID not found", 401);
    }

    const result = await accountService.deleteAccount({ userId });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

accountRouter.get("/admin/all-accounts", verifyAuthToken, async (req, res, next) => {
  try {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
      throw new AppError("Unauthorized: Admins only", 403);
    }

    const result = await accountService.getAllAccounts();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// Admin only: Delete a user or admin account by ID
accountRouter.delete("/admin/delete", verifyAuthToken, async (req, res, next) => {
  try {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
      throw new AppError("Unauthorized: Admins only", 403);
    }

    const { accountId } = req.body;

    const result = await accountService.deleteUserAccountByAdmin({ accountId });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
