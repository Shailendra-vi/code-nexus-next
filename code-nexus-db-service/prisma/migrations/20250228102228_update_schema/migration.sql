/*
  Warnings:

  - Added the required column `input` to the `TestCases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `output` to the `TestCases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TestCases` ADD COLUMN `input` VARCHAR(191) NOT NULL,
    ADD COLUMN `output` VARCHAR(191) NOT NULL;
