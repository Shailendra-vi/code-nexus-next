/*
  Warnings:

  - Added the required column `created_by` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Problem` ADD COLUMN `created_by` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Problem` ADD CONSTRAINT `Problem_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
