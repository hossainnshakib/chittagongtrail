# Chittagong Trail — Migration and Rollback Plan

**Document:** `MIGRATION-PLAN.md`  
**Phase:** Major Phase A2.1 — Migration SQL Safety Correction  
**Project:** Chittagong Trail (`chittagongtrail.com`)  

---

## 1. Current Database State & Diagnostics
- **Database Server/Version:** MariaDB / MySQL protocol via Prisma connector
- **Current Tables:** `trail_locations`, `journal_posts`
- **Current Record Counts:** 
  - `trail_locations`: 0 records
  - `journal_posts`: 0 records
- **Migration History Table:** `_prisma_migrations` does not exist (created previously via `prisma db push`).
- **Backup Strategy & Authoritative Backup:**
  - JSON diagnostics (`backups/db_backup_*.json`) record structural table info and record counts but are classified strictly as diagnostics.
  - Authoritative rollback backup is the verified SQL dump (`backups/db_backup_*.sql`), created via `mysqldump` containing full `CREATE TABLE` statements, indexes, foreign keys, collation information, and data.
  - Backup files are stored in the git-ignored `backups/` directory and are uncommitted.

---

## 2. Migration History Strategy
A two-stage migration history strategy is implemented:
1. **Migration 1 (`20260301000000_baseline_current_schema`)**:
   - Represents the pre-A2 database schema from empty.
   - Purpose: Enables clean initialization on fresh production databases and establishes the baseline required by Prisma migration tooling.
2. **Migration 2 (`20260301000001_backend_cms_architecture`)**:
   - Represents the architectural evolution to Version 1.2 target schema.
   - Purpose: Adds enums (`District`, `TerrainType`, `PlaceType`, `JournalType`, `ContentStatus`), creates media and site settings tables (`media_assets`, `trail_galleries`, `homepage_galleries`, `site_settings`), updates column mappings, and establishes foreign key relationships with strict `onDelete` behaviors.

---

## 3. Preflight Checks & Preconditions
Before applying migrations to any non-empty or production environment:
1. **Record Count & District Verification:** Verify `trail_locations` and `journal_posts` record counts. If `trail_locations` has records, every record must have an explicitly assigned `District` (no automatic assignment to `CHITTAGONG` is permitted).
2. **Legacy Media Precondition:** Verify that legacy media fields (`trail_locations.photos`, `trail_locations.ogImage`, `journal_posts.coverImage`, `journal_posts.ogImage`) are null or empty. If legacy media values exist, a separate Cloudinary reconciliation/import plan must be executed prior to running migration 2.

---

## 4. SQL Safety Review & Destructive Operations Disclosure
- **Destructive Operations Disclosure:** Migration 2 intentionally drops superseded legacy columns (`photos`, `photoAlt`, `ogImage` on `trail_locations`; `category`, `coverImage`, `coverImageAlt`, `ogImage`, `publishedDate` on `journal_posts`).
- **Data-Loss Risk:** Current content tables contain 0 records, so current data-loss risk is minimal. Data-copy logic is explicitly included for category-to-type and publishedDate-to-publishedAt transitions.
- **Foreign Keys & onDelete Actions:**
  - `JournalPost.trail` uses `onDelete: SetNull`.
  - `TrailGallery` uses `onDelete: Cascade` for trails and `onDelete: Restrict` for media assets.
  - `MediaAsset` references use `onDelete: SetNull` for singleton settings and restrict direct media deletion if referenced.
- **Required Fields:** `district` is required with no default value (explicit selection required by design).

---

## 5. SiteSettings Initialization Policy
- The `site_settings` table is created without inserting invented public values.
- In a later application phase, the `SiteSettings` service performs an `id = 1` upsert supplying safe blank or owner-approved initial values.
- No generic create/delete endpoints exist for `SiteSettings`.

---

## 6. Application Deployment & Execution Steps

### Existing Local Database
1. Verify authoritative SQL backup existence and integrity.
2. Baseline migration history using `prisma migrate resolve --applied 20260301000000_baseline_current_schema` (when authorized).
3. Apply backend CMS migration via `prisma migrate deploy` (when authorized).
4. Generate Prisma Client and run verification checks.

### Fresh Production Database
1. Configure production `DATABASE_URL`.
2. Run `prisma migrate deploy` to execute both baseline and backend CMS migrations in order.
3. Initialize default `SiteSettings` record (id = 1) safely.
4. Verify deployment and start Next.js application.

---

## 7. Rollback Plan & SQL Restore Procedure
- **Rollback Triggers:** Schema compilation failure, unexpected data migration anomalies during production rollout, or breaking runtime errors in application services.
- **SQL Restore Procedure:** 
  - To restore the database from the authoritative SQL backup:
    ```bash
    mysql -u [user] -p [database_name] < backups/db_backup_[timestamp].sql
    ```
  - For non-empty environments with active content, perform targeted corrective migrations rather than destructive drops.
- **Cloudinary Reconciliation Warning:** Database migration rollbacks do not affect remote Cloudinary assets. Cloudinary media assets must be reconciled independently.
- **Owner Approval Gate:** No automatic destructive rollback or migration execution is permitted without explicit owner approval.
