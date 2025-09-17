import { database } from "../../db/db";
import { AppError } from "../../middlewares/errorHandler";
import { encryptData, verifyEncryptedData } from "../../utils/bcrypt";
import { AccountChangePasswordArgs, AccountDeleteArgs, AccountUpdateInfoArgs } from "../../types/generalTypes";
import { PrismaClient } from "@prisma/client";

const prisma = database as PrismaClient;

class AccountService {
  public updateAccountInfo = async (args: AccountUpdateInfoArgs) => {
    const { userId, name, email, isAdmin } = args;

    let entity;
    if (isAdmin) {
      entity = await prisma.admin.findUnique({ where: { id: Number(userId) } });
    } else {
      entity = await prisma.user.findUnique({ where: { id: Number(userId) } });
    }

    if (!entity) {
      throw new AppError(isAdmin ? "Admin not found" : "User not found", 404);
    }

    if (email && email !== entity.email) {
      let existingEntityWithEmail;
      if (isAdmin) {
        existingEntityWithEmail = await prisma.admin.findUnique({ where: { email } });
      } else {
        existingEntityWithEmail = await prisma.user.findUnique({ where: { email } });
      }
      if (existingEntityWithEmail && existingEntityWithEmail.id !== Number(userId)) {
        throw new AppError("Email already in use", 409);
      }
    }

    let updatedEntity;
    if (isAdmin) {
      updatedEntity = await prisma.admin.update({
        where: { id: Number(userId) },
        data: {
          name: name || entity.name,
          email: email || entity.email,
        },
        select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
      });
    } else {
      updatedEntity = await prisma.user.update({
        where: { id: Number(userId) },
        data: {
          name: name || entity.name,
          email: email || entity.email,
        },
        select: { id: true, name: true, email: true, createdAt: true, isVerified: true },
      });
    }

    return { message: "Account updated successfully", account: updatedEntity };
  };

  public changePassword = async (args: AccountChangePasswordArgs) => {
    const { userId, oldPassword, newPassword, isAdmin } = args;

    let entity;
    if (isAdmin) {
      entity = await prisma.admin.findUnique({ where: { id: Number(userId) } });
    } else {
      entity = await prisma.user.findUnique({ where: { id: Number(userId) } });
    }

    if (!entity) {
      throw new AppError(isAdmin ? "Admin not found" : "User not found", 404);
    }

    await verifyEncryptedData(oldPassword, entity.password);

    const hashedPassword = await encryptData(newPassword);

    if (isAdmin) {
      await prisma.admin.update({
        where: { id: Number(userId) },
        data: { password: hashedPassword },
      });
    } else {
      await prisma.user.update({
        where: { id: Number(userId) },
        data: { password: hashedPassword },
      });
    }

    return { message: "Password changed successfully" };
  };

  public getAccountDetails = async (userId: number | string, isAdmin: boolean) => {
    let entity;
    if (isAdmin) {
      entity = await prisma.admin.findUnique({
        where: { id: Number(userId) },
        select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
      });
    } else {
      entity = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: { id: true, name: true, email: true, createdAt: true, isVerified: true, account: { select: { accountNo: true, balance: true } } },
      });
    }

    if (!entity) {
      throw new AppError(isAdmin ? "Admin not found" : "User not found", 404);
    }

    if (entity && "account" in entity && entity.account) {
      return { account: { ...entity, account: { ...entity.account, accountNo: String(entity.account.accountNo) } } };
    }

    return { account: entity };
  };

  public deleteAccount = async (args: AccountDeleteArgs) => {
    const { userId, password, isAdmin } = args;

    let entity;
    if (isAdmin) {
      entity = await prisma.admin.findUnique({ where: { id: Number(userId) } });
    } else {
      entity = await prisma.user.findUnique({ where: { id: Number(userId) } });
    }

    if (!entity) {
      throw new AppError(isAdmin ? "Admin not found" : "User not found", 404);
    }

    await verifyEncryptedData(password, entity.password);

    if (isAdmin) {
      await prisma.admin.delete({ where: { id: Number(userId) } });
    } else {
      await prisma.user.delete({ where: { id: Number(userId) } });
    }

    return { message: "Account deleted successfully" };
  };

  public getAllAccounts = async () => {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true, isVerified: true, account: { select: { accountNo: true, balance: true } } },
    });
    const admins = await prisma.admin.findMany({
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
    });

    const usersWithSerializedAccountNo = users.map((user) => {
      if (user.account) {
        return { ...user, account: { ...user.account, accountNo: String(user.account.accountNo) } };
      }
      return user;
    });

    return { users: usersWithSerializedAccountNo, admins };
  };
}

export const accountService = new AccountService();
