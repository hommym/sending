/*
  Warnings:

  - A unique constraint covering the columns `[accountNo]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Account` ADD COLUMN `balance` VARCHAR(191) NOT NULL DEFAULT '0.00';

-- CreateIndex
CREATE UNIQUE INDEX `Account_accountNo_key` ON `Account`(`accountNo`);
