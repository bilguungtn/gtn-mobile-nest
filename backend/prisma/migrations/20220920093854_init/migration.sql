-- CreateTable
CREATE TABLE `addresses` (
    `postal_code` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_id` VARCHAR(191) NULL,
    `profile_id` BIGINT NOT NULL,

    PRIMARY KEY (`profile_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `call_charges` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `phone_number` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `carrier_type_code` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cell_phone_company_login_details` (
    `claim_code` VARCHAR(191) NOT NULL,
    `login_id` VARCHAR(191) NOT NULL,
    `carrier_type_code` INTEGER NOT NULL,

    PRIMARY KEY (`claim_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_charges` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `capacity` DOUBLE NOT NULL,
    `price` INTEGER NOT NULL,
    `available_count` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_charge_histories` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `profile_id` INTEGER NOT NULL,
    `data_charge_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_traffics` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `phone_number` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `amount` FLOAT NOT NULL,
    `carrier_type_code` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_traffic_charges` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `phone_number` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `carrier_type_code` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `international_call_charges` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profiles` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `name_kana` VARCHAR(191) NULL,
    `bithday` DATETIME(3) NOT NULL,
    `contact_phone_number` VARCHAR(191) NOT NULL,
    `cell_phone_number` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
