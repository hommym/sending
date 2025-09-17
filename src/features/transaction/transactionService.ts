import { database } from "../../db/db";
import { AppError } from "../../middlewares/errorHandler";
import { CreditAccountArgs, SendMoneyArgs, GetTransactionsArgs } from "../../types/generalTypes";
import { PrismaClient } from "@prisma/client";

const prisma = database as PrismaClient;

class TransactionService {
  public creditAccount = async (args: CreditAccountArgs) => {
    const { recipientId, amount, recipientIsAdmin } = args;

    let recipientEntity;
    if (recipientIsAdmin) {
      recipientEntity = await prisma.admin.findUnique({ where: { id: Number(recipientId) } });
    } else {
      recipientEntity = await prisma.user.findUnique({ where: { id: Number(recipientId) } });
    }

    if (!recipientEntity) {
      throw new AppError("Recipient not found", 404);
    }

    const account = await prisma.account.findUnique({ where: { userId: recipientEntity.id } });

    if (!account) {
      throw new AppError("Recipient account not found", 404);
    }

    const newBalance = (parseFloat(account.balance) + parseFloat(amount)).toFixed(2);

    await prisma.account.update({
      where: { userId: recipientEntity.id },
      data: { balance: newBalance },
    });

    // Create a transaction record for the credit
    await prisma.transaction.create({
      data: {
        ownerId: recipientEntity.id,
        amount: `${amount}`,
        type: "recipient",
        description: `Account credited by admin`,
      },
    });

    return { message: "Account credited successfully", newBalance };
  };

  public sendMoney = async (args: SendMoneyArgs) => {
    const { senderId, recipientAccountNo, amount, description } = args;

    if (parseFloat(amount) <= 0) {
      throw new AppError("Amount must be greater than zero", 400);
    }

    const senderAccount = await prisma.account.findUnique({ where: { userId: Number(senderId) } });
    if (!senderAccount) {
      throw new AppError("Sender account not found", 404);
    }

    if (parseFloat(senderAccount.balance) < parseFloat(amount)) {
      throw new AppError("Insufficient balance", 400);
    }

    const recipientAccount = await prisma.account.findUnique({ where: { accountNo: recipientAccountNo } });
    if (!recipientAccount) {
      throw new AppError("Recipient account not found", 404);
    }

    if (senderAccount.userId === recipientAccount.userId) {
      throw new AppError("Cannot send money to yourself", 400);
    }

    const newSenderBalance = (parseFloat(senderAccount.balance) - parseFloat(amount)).toFixed(2);
    const newRecipientBalance = (parseFloat(recipientAccount.balance) + parseFloat(amount)).toFixed(2);

    await prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { userId: senderAccount.userId },
        data: { balance: newSenderBalance },
      });

      await tx.account.update({
        where: { userId: recipientAccount.userId },
        data: { balance: newRecipientBalance },
      });

      // Create transaction record for sender
      await tx.transaction.create({
        data: {
          ownerId: senderAccount.userId,
          amount: `${amount}`,
          type: "sender",
          description: description || `Sent money to account ${recipientAccountNo}`,
        },
      });

      // Create transaction record for recipient
      await tx.transaction.create({
        data: {
          ownerId: recipientAccount.userId,
          amount: `${amount}`,
          type: "recipient",
          description: description || `Received money from account ${senderAccount.accountNo}`,
        },
      });
    });

    return { message: "Money sent successfully", newBalance: newSenderBalance };
  };

  public getTransactions = async (args: GetTransactionsArgs) => {
    const { userId, isAdmin } = args;

    let transactions;
    if (isAdmin) {
      transactions = await prisma.transaction.findMany({
        orderBy: { createdAt: "desc" },
      });
    } else {
      transactions = await prisma.transaction.findMany({
        where: { ownerId: Number(userId) },
        orderBy: { createdAt: "desc" },
      });
    }

    return { transactions };
  };
}

export const transactionService = new TransactionService();
