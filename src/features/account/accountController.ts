import { Router } from "express";
import { accountService } from "./accountService";
import { verifyAuthToken } from "../../utils/jwt";
import { AppError } from "../../middlewares/errorHandler";

export const accountRouter = Router();

accountRouter.put("/update-info", verifyAuthToken, async (req, res, next) => {
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

accountRouter.patch("/change-password", verifyAuthToken, async (req, res, next) => {
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
    const { password } = req.body;
    const userId = req.userId;
    const isAdmin = req.isAdmin;

    if (!userId) {
      throw new AppError("Unauthorized: User ID not found", 401);
    }

    const result = await accountService.deleteAccount({ userId, password, isAdmin });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
