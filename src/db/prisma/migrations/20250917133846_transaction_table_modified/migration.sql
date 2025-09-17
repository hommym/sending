/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `Account` table. All the data in the column will be lost.
  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `recipientId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - Added the required column `ownerId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ref` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Account` DROP COLUMN `expiresAt`;

-- AlterTable
ALTER TABLE `Transaction` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `recipientId`,
    DROP COLUMN `senderId`,
    ADD COLUMN `ownerId` INTEGER NOT NULL,
    ADD COLUMN `ref` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `type` ENUM('sender', 'recipient') NOT NULL DEFAULT 'sender',
    MODIFY `amount` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`ref`);

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
