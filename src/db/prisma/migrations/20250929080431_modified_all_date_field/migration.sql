-- DropForeignKey
ALTER TABLE `Inter_Transc_Info` DROP FOREIGN KEY `Inter_Transc_Info_refId_fkey`;

-- AlterTable
ALTER TABLE `Inter_Transc_Info` MODIFY `createdAt` DATE NOT NULL,
    MODIFY `updatedAt` DATE NOT NULL;

-- AlterTable
ALTER TABLE `Transaction` MODIFY `createdAt` DATE NOT NULL,
    MODIFY `updatedAt` DATE NOT NULL;

-- AddForeignKey
ALTER TABLE `Inter_Transc_Info` ADD CONSTRAINT `Inter_Transc_Info_refId_fkey` FOREIGN KEY (`refId`) REFERENCES `Transaction`(`ref`) ON DELETE CASCADE ON UPDATE CASCADE;
