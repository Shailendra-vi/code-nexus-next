/*
  Warnings:

  - Added the required column `created_by` to the `TestCases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TestCases` ADD COLUMN `created_by` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `TestCases` ADD CONSTRAINT `TestCases_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
