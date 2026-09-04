-- AlterTable: Add A7R.7 SiteSettings fields and default OG MediaAsset relation
ALTER TABLE `site_settings` ADD COLUMN `siteTagline` VARCHAR(255) NULL;
ALTER TABLE `site_settings` ADD COLUMN `defaultMetaTitle` VARCHAR(255) NULL;
ALTER TABLE `site_settings` ADD COLUMN `defaultMetaDescription` TEXT NULL;
ALTER TABLE `site_settings` ADD COLUMN `defaultOgMediaId` INTEGER NULL;
ALTER TABLE `site_settings` ADD COLUMN `contactPhone` VARCHAR(50) NULL;
ALTER TABLE `site_settings` ADD COLUMN `whatsappUrl` VARCHAR(500) NULL;
ALTER TABLE `site_settings` ADD COLUMN `contactAddress` TEXT NULL;
ALTER TABLE `site_settings` ADD COLUMN `mapUrl` TEXT NULL;
ALTER TABLE `site_settings` ADD COLUMN `socialX` VARCHAR(500) NULL;
ALTER TABLE `site_settings` ADD COLUMN `socialThreads` VARCHAR(500) NULL;
ALTER TABLE `site_settings` ADD COLUMN `socialLinkedIn` VARCHAR(500) NULL;
ALTER TABLE `site_settings` ADD COLUMN `socialTikTok` VARCHAR(500) NULL;

-- AddForeignKey: default OG MediaAsset FK with SetNull on delete
ALTER TABLE `site_settings` ADD CONSTRAINT `site_settings_defaultOgMediaId_fkey` FOREIGN KEY (`defaultOgMediaId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
