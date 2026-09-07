-- Additive A7R.9.2 migration: normalized public SEO/page copy, homepage section copy,
-- global indexing controls, and an optional dedicated footer logo relation.
ALTER TABLE `site_settings`
    ADD COLUMN `defaultOgTitle` VARCHAR(255) NULL,
    ADD COLUMN `defaultOgDescription` TEXT NULL,
    ADD COLUMN `publisherName` VARCHAR(100) NULL,
    ADD COLUMN `googleSiteVerification` VARCHAR(255) NULL,
    ADD COLUMN `bingSiteVerification` VARCHAR(255) NULL,
    ADD COLUMN `allowIndexing` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `footerLogoMediaId` INTEGER NULL,
    ADD COLUMN `footerLogoAltText` VARCHAR(191) NULL,
    ADD COLUMN `footerLogoDecorative` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `footerLogoIncludesWordmark` BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE `page_seo_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pageKey` VARCHAR(50) NOT NULL,
    `routePath` VARCHAR(100) NOT NULL,
    `adminLabel` VARCHAR(100) NOT NULL,
    `visibleTitle` VARCHAR(200) NOT NULL,
    `visibleDescription` TEXT NOT NULL,
    `metaTitle` VARCHAR(255) NULL,
    `metaDescription` TEXT NULL,
    `useVisibleTitleAsMetaTitle` BOOLEAN NOT NULL DEFAULT true,
    `useVisibleDescriptionAsMetaDescription` BOOLEAN NOT NULL DEFAULT true,
    `ogTitle` VARCHAR(255) NULL,
    `ogDescription` TEXT NULL,
    `ogMediaId` INTEGER NULL,
    `robotsIndex` BOOLEAN NOT NULL DEFAULT true,
    `robotsFollow` BOOLEAN NOT NULL DEFAULT true,
    `includeInSitemap` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `page_seo_settings_pageKey_key`(`pageKey`),
    UNIQUE INDEX `page_seo_settings_routePath_key`(`routePath`),
    INDEX `page_seo_settings_robotsIndex_includeInSitemap_idx`(`robotsIndex`, `includeInSitemap`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `homepage_section_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sectionKey` VARCHAR(50) NOT NULL,
    `eyebrow` VARCHAR(100) NOT NULL,
    `heading` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `ctaLabel` VARCHAR(100) NULL,
    `ctaHref` VARCHAR(200) NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `homepage_section_settings_sectionKey_key`(`sectionKey`),
    INDEX `homepage_section_settings_enabled_displayOrder_idx`(`enabled`, `displayOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `site_settings`
    ADD CONSTRAINT `site_settings_footerLogoMediaId_fkey`
    FOREIGN KEY (`footerLogoMediaId`) REFERENCES `media_assets`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `page_seo_settings`
    ADD CONSTRAINT `page_seo_settings_ogMediaId_fkey`
    FOREIGN KEY (`ogMediaId`) REFERENCES `media_assets`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;

-- Idempotent backfill: preserve any rows if this migration is replayed in a restored database.
INSERT IGNORE INTO `page_seo_settings`
    (`pageKey`, `routePath`, `adminLabel`, `visibleTitle`, `visibleDescription`,
     `useVisibleTitleAsMetaTitle`, `useVisibleDescriptionAsMetaDescription`,
     `robotsIndex`, `robotsFollow`, `includeInSitemap`, `updatedAt`)
VALUES
    ('home', '/', 'Homepage', 'Five Districts. Hills to the Sea. One Chittagong.',
     'Explore Chittagong through trails, stories, food, and lived journeys across five districts.', true, true, true, true, true, CURRENT_TIMESTAMP(3)),
    ('trails', '/trails', 'Trails index', 'Trails',
     'Discover coastal shores, misty hills, heritage sites, markets, and hidden places across Chittagong\'s five districts.', true, true, true, true, true, CURRENT_TIMESTAMP(3)),
    ('journal', '/journal', 'Journal index', 'Journal',
     'Stories, observations, and discoveries from across Chittagong\'s five districts, shaped by place, culture, history, food, and people.', true, true, true, true, true, CURRENT_TIMESTAMP(3)),
    ('food', '/food', 'Food index', 'Chittagong Food',
     'Explore Chittagong\'s culinary traditions, street food, regional flavors, and food culture across five districts.', true, true, true, true, true, CURRENT_TIMESTAMP(3)),
    ('about', '/about', 'About page', 'About Chittagong Trail',
     'Learn about Chittagong Trail, an independent platform documenting the places, culture, history, food, and people of Chittagong.', true, true, true, true, true, CURRENT_TIMESTAMP(3));

INSERT IGNORE INTO `homepage_section_settings`
    (`sectionKey`, `eyebrow`, `heading`, `description`, `ctaLabel`, `ctaHref`, `enabled`, `displayOrder`, `updatedAt`)
VALUES
    ('destinations', 'Explore Trails', 'Pick one.', NULL, NULL, NULL, true, 20, CURRENT_TIMESTAMP(3)),
    ('experiences', 'Journal', 'Stories from the trail', NULL, 'Read all stories', '/journal', true, 40, CURRENT_TIMESTAMP(3)),
    ('food', 'Food', 'Taste of Chittagong',
     'Dishes worth building a trip around. Rice, river fish, slow beef, and a sweet course the city takes seriously.',
     'Explore all food', '/food', true, 50, CURRENT_TIMESTAMP(3)),
    ('stories', 'Stories & Journeys', 'Journeys and Dispatches', NULL, 'View all stories', '/journal', true, 60, CURRENT_TIMESTAMP(3)),
    ('gallery', 'Gallery', 'What it actually looks like', NULL, NULL, NULL, true, 70, CURRENT_TIMESTAMP(3));
