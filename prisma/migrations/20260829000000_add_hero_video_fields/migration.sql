-- AlterTable: Add hero video control fields to site_settings
ALTER TABLE `site_settings`
  ADD COLUMN `heroVideoEnabled` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `heroVideoProvider` ENUM('NONE', 'YOUTUBE', 'VIMEO', 'DIRECT') NOT NULL DEFAULT 'NONE',
  ADD COLUMN `heroVideoOverlay` INTEGER NOT NULL DEFAULT 45;
