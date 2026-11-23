-- CreateTable
CREATE TABLE `facility` (
    `kode_user` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_facility` VARCHAR(150) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`kode_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
