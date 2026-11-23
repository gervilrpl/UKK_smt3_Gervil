-- CreateTable
CREATE TABLE `tipe_unit` (
    `id_unit_type` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_type_unit` VARCHAR(100) NOT NULL,
    `branch_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tipe_unit_branch_id_key`(`branch_id`),
    PRIMARY KEY (`id_unit_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
