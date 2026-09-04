-- AlterTable: Add Hero video MediaAsset relation (nullable, backward compatible)
ALTER TABLE `site_settings` ADD COLUMN `hero_video_media_id` INTEGER NULL;

-- AddForeignKey: Hero video MediaAsset FK with SetNull on delete
ALTER TABLE `site_settings` ADD CONSTRAINT `site_settings_hero_video_media_id_fkey` FOREIGN KEY (`hero_video_media_id`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill: If an existing DIRECT heroVideoUrl matches a registered video MediaAsset, populate hero_video_media_id
-- This preserves pre-migration DIRECT references without fabricating IDs or affecting external YouTube/Vimeo records.
UPDATE `site_settings` s
  LEFT JOIN `media_assets` m ON m.`secureUrl` = s.`heroVideoUrl` AND m.`resourceType` = 'video'
SET s.`hero_video_media_id` = m.`id`
WHERE s.`heroVideoProvider` = 'DIRECT'
  AND s.`heroVideoEnabled` = true
  AND s.`heroVideoUrl` IS NOT NULL
  AND m.`id` IS NOT NULL;
