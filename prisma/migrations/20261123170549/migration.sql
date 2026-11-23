/*
  Warnings:

  - You are about to drop the `facility` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `type_facility` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `facility`;

-- DropTable
DROP TABLE `type_facility`;

-- CreateTable
CREATE TABLE `tbl_facility` (
    `kode_facility` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tbl_facility_kode_facility_key`(`kode_facility`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_type_unit_facility` (
    `id_unit_type` INTEGER NOT NULL AUTO_INCREMENT,
    `kode_facility` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tbl_type_unit_facility_kode_facility_key`(`kode_facility`),
    PRIMARY KEY (`id_unit_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_type_unit` (
    `id_unit_type` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_type_unit` VARCHAR(191) NOT NULL,
    `branch_id` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_unit_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
