-- AlterTable: Add Hero video MediaAsset relation (nullable, backward compatible)
ALTER TABLE `site_settings` ADD COLUMN `hero_video_media_id` INTEGER NULL;

-- AddForeignKey: Hero video MediaAsset FK with SetNull on delete
ALTER TABLE `site_settings` ADD CONSTRAINT `site_settings_hero_video_media_id_fkey` FOREIGN KEY (`hero_video_media_id`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
