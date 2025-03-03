/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Contests` table. All the data in the column will be lost.
  - Added the required column `created_by` to the `Contests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Contests` DROP FOREIGN KEY `Contests_createdBy_fkey`;

-- DropIndex
DROP INDEX `Contests_createdBy_fkey` ON `Contests`;

-- AlterTable
ALTER TABLE `Contests` DROP COLUMN `createdBy`,
    ADD COLUMN `created_by` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Contests` ADD CONSTRAINT `Contests_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TestCases` ADD CONSTRAINT `TestCases_problem_id_fkey` FOREIGN KEY (`problem_id`) REFERENCES `Problem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
