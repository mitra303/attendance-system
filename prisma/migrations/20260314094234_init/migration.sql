-- CreateTable
CREATE TABLE `attendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `internId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `inTime` VARCHAR(191) NOT NULL,
    `outTime` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Inside',

    INDEX `Attendance_internId_fkey`(`internId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `doj` DATETIME(3) NULL,
    `role` INTEGER NULL,
    `dept` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `repMgr` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `resetToken` VARCHAR(191) NULL,
    `resetTokenExpiry` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `Attendance_internId_fkey` FOREIGN KEY (`internId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
