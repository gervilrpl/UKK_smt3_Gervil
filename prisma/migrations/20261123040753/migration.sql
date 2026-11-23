/*
  Warnings:

  - You are about to drop the column `kode_user` on the `facility` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[kode_facility]` on the table `Facility` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Facility_kode_user_key` ON `facility`;

-- AlterTable
ALTER TABLE `facility` DROP COLUMN `kode_user`,
    ADD COLUMN `kode_facility` VARCHAR(20) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Facility_kode_facility_key` ON `Facility`(`kode_facility`);
