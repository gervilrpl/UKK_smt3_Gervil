/*
  Warnings:

  - Added the required column `nama_facility` to the `Facility` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `facility` ADD COLUMN `nama_facility` VARCHAR(191) NOT NULL;
