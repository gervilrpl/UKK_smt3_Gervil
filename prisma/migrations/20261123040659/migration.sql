/*
  Warnings:

  - The primary key for the `facility` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `nama_facility` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the `tipe_unit` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[kode_user]` on the table `Facility` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `Facility` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `facility` DROP PRIMARY KEY,
    DROP COLUMN `nama_facility`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `kode_user` VARCHAR(20) NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `tipe_unit`;

-- CreateIndex
CREATE UNIQUE INDEX `Facility_kode_user_key` ON `Facility`(`kode_user`);
