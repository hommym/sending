-- CreateTable
CREATE TABLE `Inter_Transc_Info` (
    `refId` INTEGER NOT NULL AUTO_INCREMENT,
    `recipientBankName` VARCHAR(191) NOT NULL,
    `swiftCode` VARCHAR(191) NOT NULL,
    `senderName` VARCHAR(191) NOT NULL,
    `senderPhone` VARCHAR(191) NOT NULL,
    `senderAddress` VARCHAR(191) NOT NULL,
    `senderCity` VARCHAR(191) NOT NULL,
    `senderState` VARCHAR(191) NOT NULL,
    `senderZip` VARCHAR(191) NOT NULL,
    `recipientName` VARCHAR(191) NOT NULL,
    `recipientAccount` BIGINT NOT NULL,
    `recipientAddress` VARCHAR(191) NOT NULL,
    `recipientCity` VARCHAR(191) NOT NULL,
    `recipientState` VARCHAR(191) NOT NULL,
    `recipientZip` VARCHAR(191) NOT NULL,
    `additionalInfo` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`refId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Inter_Transc_Info` ADD CONSTRAINT `Inter_Transc_Info_refId_fkey` FOREIGN KEY (`refId`) REFERENCES `Transaction`(`ref`) ON DELETE CASCADE ON UPDATE CASCADE;
