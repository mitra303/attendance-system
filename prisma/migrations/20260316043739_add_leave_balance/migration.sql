-- CreateTable
CREATE TABLE `leaveBalance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `casual` DOUBLE NOT NULL DEFAULT 1,
    `earned` DOUBLE NOT NULL DEFAULT 0,
    `short` DOUBLE NOT NULL DEFAULT 2,

    UNIQUE INDEX `leaveBalance_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `leaveBalance` ADD CONSTRAINT `leaveBalance_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
