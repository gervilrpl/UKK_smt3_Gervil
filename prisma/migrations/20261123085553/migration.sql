/*
  Warnings:

  - The primary key for the `facility` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `facility` table. All the data in the column will be lost.
  - Made the column `kode_facility` on table `facility` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `facility` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    MODIFY `kode_facility` VARCHAR(20) NOT NULL;
