-- CreateTable
CREATE TABLE `media_assets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `secureUrl` VARCHAR(191) NOT NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `format` VARCHAR(191) NULL,
    `resourceType` VARCHAR(191) NOT NULL DEFAULT 'image',
    `altText` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `media_assets_publicId_key`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trail_galleries` (
    `trailId` INTEGER NOT NULL,
    `mediaAssetId` INTEGER NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`trailId`, `mediaAssetId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `homepage_galleries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mediaAssetId` INTEGER NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Drop columns from trail_locations and add new architectural fields
ALTER TABLE `trail_locations` ADD COLUMN `administrativeArea` VARCHAR(191) NULL,
    ADD COLUMN `coverMediaId` INTEGER NULL,
    ADD COLUMN `district` ENUM('CHITTAGONG', 'COX_BAZAR', 'RANGAMATI', 'BANDARBAN', 'KHAGRACHARI') NOT NULL,
    ADD COLUMN `excerpt` TEXT NULL,
    ADD COLUMN `featuredOrder` INTEGER NULL,
    ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `localArea` VARCHAR(191) NULL,
    ADD COLUMN `ogMediaId` INTEGER NULL,
    ADD COLUMN `placeType` ENUM('TOURIST_ATTRACTION', 'PLACE', 'NATURAL_FEATURE', 'PARK') NOT NULL DEFAULT 'PLACE',
    ADD COLUMN `publishedAt` DATETIME(3) NULL,
    ADD COLUMN `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    ADD COLUMN `terrainType` ENUM('COAST', 'HILLS', 'RIVER', 'CITY', 'RURAL') NULL,
    DROP COLUMN `photoAlt`,
    DROP COLUMN `photos`,
    DROP COLUMN `ogImage`;

-- Drop columns from journal_posts and add new architectural fields
ALTER TABLE `journal_posts` ADD COLUMN `coverMediaId` INTEGER NULL,
    ADD COLUMN `featuredOrder` INTEGER NULL,
    ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ogMediaId` INTEGER NULL,
    ADD COLUMN `publishedAt` DATETIME(3) NULL,
    ADD COLUMN `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    ADD COLUMN `type` ENUM('STORY', 'FOOD') NOT NULL DEFAULT 'STORY',
    DROP COLUMN `category`,
    DROP COLUMN `coverImageAlt`,
    DROP COLUMN `coverImage`,
    DROP COLUMN `ogImage`,
    DROP COLUMN `publishedDate`;

-- CreateTable for site settings
CREATE TABLE `site_settings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `siteName` VARCHAR(191) NOT NULL DEFAULT 'Chittagong Trail',
    `heroTitle` VARCHAR(191) NOT NULL DEFAULT '',
    `heroSubtitle` VARCHAR(191) NOT NULL DEFAULT '',
    `heroMediaId` INTEGER NULL,
    `introductionHeading` VARCHAR(191) NOT NULL DEFAULT '',
    `introductionContent` LONGTEXT NOT NULL DEFAULT '',
    `seasonalEyebrow` VARCHAR(191) NOT NULL DEFAULT '',
    `seasonalTitle` VARCHAR(191) NOT NULL DEFAULT '',
    `seasonalContent` LONGTEXT NOT NULL DEFAULT '',
    `seasonalMediaId` INTEGER NULL,
    `aboutHeading` VARCHAR(191) NOT NULL DEFAULT '',
    `aboutContent` LONGTEXT NOT NULL DEFAULT '',
    `contactEmail` VARCHAR(191) NOT NULL DEFAULT '',
    `socialFacebook` VARCHAR(191) NULL,
    `socialInstagram` VARCHAR(191) NULL,
    `socialYouTube` VARCHAR(191) NULL,
    `footerText` VARCHAR(191) NOT NULL DEFAULT '',
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `trail_locations_district_idx` ON `trail_locations`(`district`);
CREATE INDEX `trail_locations_district_administrativeArea_idx` ON `trail_locations`(`district`, `administrativeArea`);
CREATE INDEX `trail_locations_status_idx` ON `trail_locations`(`status`);
CREATE INDEX `trail_locations_isFeatured_featuredOrder_idx` ON `trail_locations`(`isFeatured`, `featuredOrder`);

-- CreateIndex
CREATE INDEX `journal_posts_type_idx` ON `journal_posts`(`type`);
CREATE INDEX `journal_posts_status_idx` ON `journal_posts`(`status`);
CREATE INDEX `journal_posts_isFeatured_featuredOrder_idx` ON `journal_posts`(`isFeatured`, `featuredOrder`);
CREATE INDEX `journal_posts_trailId_idx` ON `journal_posts`(`trailId`);

-- AddForeignKey
ALTER TABLE `trail_galleries` ADD CONSTRAINT `trail_galleries_trailId_fkey` FOREIGN KEY (`trailId`) REFERENCES `trail_locations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trail_galleries` ADD CONSTRAINT `trail_galleries_mediaAssetId_fkey` FOREIGN KEY (`mediaAssetId`) REFERENCES `media_assets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `homepage_galleries` ADD CONSTRAINT `homepage_galleries_mediaAssetId_fkey` FOREIGN KEY (`mediaAssetId`) REFERENCES `media_assets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trail_locations` ADD CONSTRAINT `trail_locations_coverMediaId_fkey` FOREIGN KEY (`coverMediaId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trail_locations` ADD CONSTRAINT `trail_locations_ogMediaId_fkey` FOREIGN KEY (`ogMediaId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journal_posts` ADD CONSTRAINT `journal_posts_coverMediaId_fkey` FOREIGN KEY (`coverMediaId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journal_posts` ADD CONSTRAINT `journal_posts_ogMediaId_fkey` FOREIGN KEY (`ogMediaId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `site_settings` ADD CONSTRAINT `site_settings_heroMediaId_fkey` FOREIGN KEY (`heroMediaId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `site_settings` ADD CONSTRAINT `site_settings_seasonalMediaId_fkey` FOREIGN KEY (`seasonalMediaId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
