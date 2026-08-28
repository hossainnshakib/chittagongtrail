# Chittagong Trail — Migration and Rollback Plan

**Document:** `MIGRATION-PLAN.md`  
**Phase:** Major Phase A2 — Schema and Migration Preparation  
**Project:** Chittagong Trail (`chittagongtrail.com`)  

---

## 1. Current Database State & Diagnostics
- **Database Server/Version:** MariaDB / MySQL protocol via Prisma connector
- **Current Tables:** `trail_locations`, `journal_posts`
- **Current Record Counts:** 
  - `trail_locations`: 0 records
  - `journal_posts`: 0 records
- **Migration History Table:** `_prisma_migrations` does not exist (created previously via `prisma db push`).
- **Backup Location Policy:** Backups are stored in `backups/` (excluded from git tracking). The local backup file created during Phase A2 is `backups/db_backup_2026-08-28T14-53-16-429Z.json`.

---

## 2. Migration History Strategy
To establish a robust and reproducible migration history for both local development and future production environments without disrupting the existing unmanaged local database state, a two-stage migration history strategy is implemented:

1. **Migration 1 (`20260301000000_baseline_current_schema`)**:
   - Represents the pre-A2 database schema from empty.
   - Purpose: Enables clean initialization on fresh production databases and establishes the baseline required by Prisma migration tooling.
2. **Migration 2 (`20260301000001_backend_cms_architecture`)**:
   - Represents the architectural evolution to Version 1.2 target schema.
   - Purpose: Adds enums (`District`, `TerrainType`, `PlaceType`, `JournalType`, `ContentStatus`), creates media and site settings tables (`media_assets`, `trail_galleries`, `homepage_galleries`, `site_settings`), updates column mappings, and establishes foreign key relationships with strict `onDelete` behaviors.

---

## 3. SQL Safety Review Summary
- **Destructive Operations:** None on active data (record counts are 0). Column replacements (`photos`, `coverImage`, `ogImage` replaced by relational media assets) are executed cleanly.
- **Foreign Keys & onDelete Actions:**
  - `JournalPost.trail` uses `onDelete: SetNull`.
  - `TrailGallery` uses `onDelete: Cascade` for trails and `onDelete: Restrict` for media assets.
  - `MediaAsset` references use `onDelete: SetNull` for singleton settings and restrict direct media deletion if referenced.
- **Required Fields:** `district` is required with no default value (explicit selection required by design).

---

## 4. Application Deployment & Execution Steps

### Existing Local Database
1. Verify backup file existence and integrity.
2. Basline migration history using `prisma migrate resolve --applied 20260301000000_baseline_current_schema` (when authorized).
3. Apply backend CMS migration via `prisma migrate deploy` (when authorized).
4. Generate Prisma Client and run verification checks.

### Fresh Production Database
1. Configure production `DATABASE_URL`.
2. Run `prisma migrate deploy` to execute both baseline and backend CMS migrations in order.
3. Initialize default `SiteSettings` record (id = 1) safely.
4. Verify deployment and start Next.js application.

---

## 5. Rollback Plan & Triggers
- **Rollback Triggers:** Schema compilation failure, unexpected data migration anomalies during production rollout, or breaking runtime errors in application services.
- **Restore Procedure:** 
  - For empty state or pre-production rollbacks, restore from the verified database backup and revert code checkpoint.
  - For non-empty environments with active content, perform targeted corrective migrations rather than destructive drops.
- **Cloudinary Warning:** Database migration rollbacks do not affect remote Cloudinary assets. Cloudinary media assets must be reconciled independently.
- **Owner Approval Gate:** No automatic destructive rollback or migration execution is permitted without explicit owner approval.
