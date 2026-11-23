-- CreateTable
CREATE TABLE `type_facility` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_type_unit` VARCHAR(191) NOT NULL,
    `branch_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `type_facility_branch_id_key`(`branch_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
