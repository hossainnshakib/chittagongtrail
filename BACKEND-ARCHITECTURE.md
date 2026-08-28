# Chittagong Trail — Backend & CMS Architecture (Major Phase A Revision)

**Document:** `BACKEND-ARCHITECTURE.md`
**Version:** 1.1 — Revised Architecture Proposal
**Status:** Awaiting Owner Approval
**Project:** Chittagong Trail
**Domain:** `chittagongtrail.com`

---

## 1. Project & Backend Purpose

Chittagong Trail is personally operated and independently curated. The founder is the operator, explorer, narrator, and curator, while **Chittagong** is the central subject.

The platform documents Chittagong broadly across:
* Places and geographic destinations
* City and urban life
* Towns and rural areas
* Rivers and coast
* Hills and natural landscapes
* Trails and destinations
* Food and culinary traditions
* History and heritage
* Culture and language
* Communities and people
* Local stories and observations
* Familiar and lesser-known places
* Seasonal and changing experiences

The backend and CMS must provide robust, clean, and reliable content management for the owner without being over-engineered into a generic multi-tenant blog or a corporate tourism directory.

---

## 2. Verified Technical Facts

Verified from the codebase, `package.json`, and current schema:
* **Framework:** Next.js App Router v16.3.3 (TypeScript)
* **ORM:** Prisma v5.22.0 (`@prisma/client` v5.22.0, generator `prisma-client-js`)
* **Database:** Local MariaDB / MySQL protocol (`trail_locations` = 0 records, `journal_posts` = 0 records)
* **Authentication:** Lightweight single-owner cookie session using `jose` (`SignJWT`, `jwtVerify`, HS256, 24-hour expiration, HttpOnly, secure in production, SameSite Lax)
* **Password Hashing:** `bcryptjs` (v3.0.3, cost factor 12)
* **Media Storage:** Cloudinary (`cloudinary` v2.11.0, folders `chittagongtrail/trails`, `chittagongtrail/journal`, `chittagongtrail/general`)
* **Current Category Behavior:** Free-form string field on `JournalPost` (default `"story"`, food queried via `category: "food"`), currently unconstrained by enum or strict validation.
* **Current Media Storage Format:** Comma-separated strings (`photos` String? @db.Text) on `TrailLocation` and singular cover image fields (`coverImage`, `ogImage`) on both models, lacking public IDs, structured dimensions, or per-image alt text.
* **Current JSON-LD Types:** `WebSite`, `Organization`, `Article`, `BlogPosting`, `TouristAttraction`, and `Place` via `lib/seo.ts`.

---

## 3. Chittagong Location Hierarchy

The previous region/upazila proposal is insufficient. Chittagong Trail covers the entire greater Chittagong region across multiple administrative districts and terrains.

### Geographic Coverage
* Chittagong District
* Cox’s Bazar District
* Rangamati Hill District
* Bandarban Hill District
* Khagrachari Hill District

### V1 Location Schema & Fields
To support precise geographic filtering, mapping, and breadcrumbs without false assumptions:
* `district`: Controlled enum (`CHITTAGONG`, `COX_BAZAR`, `RANGAMATI`, `BANDARBAN`, `KHAGRACHARI`)
* `administrativeArea`: Neutral string field representing Upazila, Thana, or Municipality (e.g., "Raozan", "Teknaf", "Sadar", "Lama")
* `localArea`: Optional string field representing specific neighborhoods, valleys, beaches, or trailheads (e.g., "Patenga Beach", "Bogakine Lake", "Boga Lake Trailhead")
* `terrainType`: Optional editorial/geographic classification enum (`COAST`, `HILLS`, `RIVER`, `CITY`, `RURAL`) kept separate from administrative geography.
* `latitude`: Float? (WGS84 decimal degrees)
* `longitude`: Float? (WGS84 decimal degrees)

### District Design Evaluation
* **Controlled Enum vs Normalized Model vs Validated String:**
  * *Normalized District Model:* Over-engineered for V1 since Chittagong division districts are fixed and static.
  * *Validated String:* Risk of typo variations (`Chittagong`, `Ctg`, `chittagong`).
  * *Controlled Enum:* **Recommended.** Provides strict type safety, zero database lookup overhead, clean Prisma queries, and perfect alignment with the 5 target districts.
* **`localArea` Optionality:** `localArea` is optional (`String?`). Many trails span broader administrative areas or remote hill tracts where a granular local neighborhood name does not apply.
* **Required Indexes:**
  * `@@index([district])` for district archive filters.
  * `@@index([district, administrativeArea])` for combined geographic drill-downs.

---

## 4. Exact TrailLocation Target

The `TrailLocation` V1 schema includes the following exact fields:

| Field Name | Prisma Type | Nullable / Required | Default | Index / Unique | Reason | Existing Data Impact & Migration |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | Int | Required | autoincrement() | @id | Primary key | None (0 existing records) |
| `name` | String | Required | — | — | Display title | None |
| `slug` | String | Required | — | @unique | URL routing & SEO | None |
| `excerpt` | String? | Nullable | — | — | Card summaries & meta | None |
| `description` | String | Required | — | @db.LongText | Full narrative content | None |
| `district` | District | Required | `CHITTAGONG` | @@index | Primary geographic filter | Backfill default |
| `administrativeArea` | String? | Nullable | — | @@index | Upazila/Thana classification | None |
| `localArea` | String? | Nullable | — | — | Specific neighborhood/trailhead | None |
| `terrainType` | TerrainType? | Nullable | — | — | Optional geographic/editorial tag | None |
| `latitude` | Float? | Nullable | — | — | Map pin coordinate | None |
| `longitude` | Float? | Nullable | — | — | Map pin coordinate | None |
| `status` | ContentStatus | Required | `DRAFT` | @@index | Publication workflow state | Default to DRAFT for safety |
| `publishedAt` | DateTime? | Nullable | — | — | Publication timestamp | None |
| `isFeatured` | Boolean | Required | `false` | @@index | Homepage curation flag | Default false |
| `featuredOrder` | Int? | Nullable | — | — | Manual sorting position | None |
| `coverMediaId` | Int? | Nullable | — | — | Primary cover image relation | None |
| `seoTitle` | String? | Nullable | — | — | Custom meta title | None |
| `seoDescription` | String? | Nullable | — | — | Custom meta description | None |
| `ogImage` | String? | Nullable | — | — | Social share image override | None |
| `placeType` | PlaceType | Required | `PLACE` | — | Structured data classification | Default PLACE |
| `createdAt` | DateTime | Required | `now()` | — | Audit trail | None |
| `updatedAt` | DateTime | Required | @updatedAt | — | Audit trail | None |

---

## 5. Publication Workflow Exactly

### ContentStatus Enum
```prisma
enum ContentStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

### Publication Rules & Default State
* **Safe Default:** `DRAFT` is the mandatory default for all newly created trails and journal posts. This guarantees that unreviewed or work-in-progress content never leaks to public visitors.
* **Published State:** When status transitions to `PUBLISHED`, `publishedAt` is set (or defaults to current timestamp if null). Public queries strictly require `status: ContentStatus.PUBLISHED`.
* **Archived State:** Removes content from public listings and sitemaps while preserving database records and relational integrity.
* **Scheduled Publishing:** **Should Have (Deferred for V1).** V1 relies on immediate publishing upon status toggle. Public queries do not check future dates; content is published instantly when set to `PUBLISHED`.
* **Public Query Conditions:** `where: { status: ContentStatus.PUBLISHED }` is applied across all public routes, search indices, and feeds.
* **Sitemap Conditions:** Sitemaps only include records where `status: ContentStatus.PUBLISHED`.
* **Draft Metadata / Not-Found Behavior:** Direct URL access to a `DRAFT` or `ARCHIVED` post by non-admin users returns a 404 Not Found.
* **Admin Preview Behavior:** Must Have. Authenticated admin users can view draft previews via secure preview routes (`/admin/preview/...` or query token bypass).
* **Resolution of `publishedDate`:** Replaced across all models with `publishedAt` (DateTime?).

---

## 6. Journal Content Type

To eliminate free-form typo risks while maintaining editorial flexibility, content types are strictly controlled via `JournalType` enum:

```prisma
enum JournalType {
  STORY
  FOOD
}
```

### Justification & Routing Behavior
* **STORY:** General narratives, historical accounts, cultural observations, poetry, people, and nature essays. Included in `/journal`.
* **FOOD:** Culinary guides, local recipes, street food reviews, and food culture. Included in `/food` and automatically cross-listed in `/journal` unless filtered.
* **Admin Filters:** Admin journal list screen provides instant tab/dropdown filtering between All, Stories, and Food, alongside status and search filters.
* **Sitemap & Structured-Data:** Both types are included in the sitemap and structured with `Article` / `BlogPosting` JSON-LD schemas.
* **Tags / Topics:** Deferred for V1 to maintain simplicity. Content type enum is sufficient for primary navigation.

---

## 7. Exact JournalPost Target

The `JournalPost` V1 schema includes the following exact fields:

| Field Name | Prisma Type | Nullable / Required | Default | Index / Unique | Reason | Migration Impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | Int | Required | autoincrement() | @id | Primary key | None |
| `title` | String | Required | — | — | Post title | None |
| `slug` | String | Required | — | @unique | URL slug | None |
| `excerpt` | String? | Nullable | — | @db.Text | Summary for cards | None |
| `content` | String | Required | — | @db.LongText | Rich text / HTML content | None |
| `type` | JournalType | Required | `STORY` | @@index | Controlled content classification | Replaces free-form `category` |
| `status` | ContentStatus | Required | `DRAFT` | @@index | Publication workflow state | Default to DRAFT |
| `publishedAt` | DateTime? | Nullable | — | — | Publication timestamp | Replaces `publishedDate` |
| `isFeatured` | Boolean | Required | `false` | @@index | Homepage curation flag | Default false |
| `featuredOrder` | Int? | Nullable | — | — | Manual sorting position | None |
| `coverMediaId` | Int? | Nullable | — | — | Cover image relation | None |
| `seoTitle` | String? | Nullable | — | — | Custom meta title | None |
| `seoDescription` | String? | Nullable | — | — | Custom meta description | None |
| `ogImage` | String? | Nullable | — | — | Social share image override | None |
| `trailId` | Int? | Nullable | — | @@index | Optional relation to TrailLocation | Preserved |
| `createdAt` | DateTime | Required | `now()` | — | Audit trail | None |
| `updatedAt` | DateTime | Required | @updatedAt | — | Audit trail | None |

---

## 8. Final Content-Storage Decision

* **Chosen V1 Format:** **Sanitized HTML.**
* **Audit & Justification:** The existing application renders rich text content. Sanitized HTML provides immediate flexibility for rich editorial formatting (headings, blockquotes, lists, inline images) without enforcing rigid Markdown syntax on the single owner.
* **Server-Side Sanitization:** All HTML input must be sanitized on the server before database persistence (using an established sanitizer such as `sanitize-html`) to prevent XSS.
* **Public Rendering Safety:** Rendered using React `dangerouslySetInnerHTML` exclusively with server-sanitized markup.
* **Inline-Image Handling:** Inline images within content bodies are uploaded via Cloudinary and stored as standard `<img>` tags within the sanitized HTML string.
* **Editor Enhancement:** **Should Have.** Basic textarea with formatting toolbar or clean HTML editing for V1; heavy WYSIWYG editor plugins deferred.

---

## 9. Media Architecture Exactly

Since the database currently contains 0 content records, adopting a clean relational `MediaAsset` model is fully viable and eliminates comma-separated string parsing fragility.

### Chosen Strategy: Relational `MediaAsset` Model
A lightweight `MediaAsset` model tracks every uploaded Cloudinary asset with complete metadata.

```prisma
model MediaAsset {
  id           Int      @id @default(autoincrement())
  publicId     String   @unique
  secureUrl    String
  width        Int?
  height       Int?
  format       String?
  resourceType String   @default("image")
  altText      String?
  createdAt    DateTime @default(now())

  // Relations
  trailCovers       TrailLocation[] @relation("TrailCoverMedia")
  trailGalleries    TrailGallery[]
  journalCovers     JournalPost[]   @relation("JournalCoverMedia")
  homepageGalleries HomepageGallery[]

  @@map("media_assets")
}

model TrailGallery {
  trailId       Int
  mediaAssetId  Int
  sortOrder     Int           @default(0)
  trail         TrailLocation @relation(fields: [trailId], references: [id], onDelete: Cascade)
  mediaAsset    MediaAsset    @relation(fields: [mediaAssetId], references: [id], onDelete: Cascade)

  @@id([trailId, mediaAssetId])
  @@map("trail_galleries")
}

model HomepageGallery {
  id           Int        @id @default(autoincrement())
  mediaAssetId Int
  sortOrder    Int        @default(0)
  mediaAsset   MediaAsset @relation(fields: [mediaAssetId], references: [id], onDelete: Cascade)

  @@map("homepage_galleries")
}
```

### Media Lifecycle & Deletion Rules
* **Asset Creation:** Uploads go directly to Cloudinary via server actions, returning metadata stored in `MediaAsset`.
* **Asset Deletion Rules:**
  1. Check references across `TrailLocation`, `TrailGallery`, `JournalPost`, and `HomepageGallery`.
  2. If referenced, block deletion or require unlinking first.
  3. If unreferenced, delete asset from Cloudinary via Cloudinary API, then delete database record.
  4. **Partial Failure Handling:** If Cloudinary deletion fails due to network error, log the error and decide whether to retain or retry; database transaction rolls back if DB write fails.

---

## 10. Correct Homepage Curation & Site Settings

To provide absolute editorial control over homepage presentation without a heavy page builder, a singleton `SiteSettings` model is introduced.

```prisma
model SiteSettings {
  id                 Int      @id @default(1)
  siteName           String   @default("Chittagong Trail")
  heroTitle          String   @default("Discover the Soul of Chittagong")
  heroSubtitle       String   @default("Independent exploration and storytelling across hills, coast, city, and rivers.")
  heroBackgroundImage String?
  aboutHeading       String?
  aboutContent       String?  @db.Text
  contactEmail       String?  @default("admin@chittagongtrail.com")
  socialFacebook     String?
  socialInstagram    String?
  socialYouTube      String?
  footerText         String?
  updatedAt          DateTime @updatedAt

  @@map("site_settings")
}
```

### Homepage Curation Rules
* **Hero Content:** Managed via `SiteSettings`.
* **Featured Trails:** Queried where `isFeatured: true`, ordered by `featuredOrder ASC`, limited to top 3-4 items.
* **Featured Stories & Food:** Queried where `isFeatured: true`, ordered by `featuredOrder ASC`, categorized by `JournalType`.
* **Homepage Gallery:** Curated via `HomepageGallery` relation model linked to `MediaAsset`.

---

## 11. Correct Featured Ordering

For any content using `isFeatured`:
* **`featuredOrder` Type:** `Int?` (nullable integer).
* **Ordering Fallback:** Items with `featuredOrder` set are sorted ascending (`0, 1, 2...`). Items with `null` fallback to `publishedAt DESC`.
* **Duplicate-Order Handling:** Handled gracefully by secondary sort (`publishedAt DESC`).
* **Admin Validation:** Admin UI allows setting numeric order values or drag-and-drop sequencing in future iterations; V1 provides a simple number input in the edit form.
* **Index Requirement:** `@@index([isFeatured, featuredOrder])` on both `TrailLocation` and `JournalPost`.

---

## 12. Correct Delete Safety

* **TrailLocation Deletion:** Must verify whether any `JournalPost` is linked via `trailId`. If active journal posts exist, deletion is blocked with a clear error requiring the admin to reassign or unlink the posts first. No silent cascading deletion of editorial content.
* **MediaAsset Deletion:** Blocked if referenced in any cover, gallery, or homepage relation.

---

## 13. Correct Admin V1 Scope

### Functional Areas
* **Dashboard:** Quick stats (published trails, published journal posts, draft counts, total media assets), recent activity.
* **Trails:** List view with search (name/slug), filters (district, status, featured), pagination (20 per page), sorting, row actions (edit, view, delete), status badges.
* **Journal / Food:** List view with tabs/filter by `JournalType` (Story vs Food), search, status filters, pagination.
* **Media Library:** Grid view of `MediaAsset` items, upload widget, alt-text editor, delete action.
* **Homepage Curation:** Form to manage featured items ordering and homepage gallery selection.
* **Site Settings:** Singleton form for hero text, about copy, social links, and footer info.
* **Authentication:** Secure login and logout.

---

## 14. Correct Security Requirements

| Security Control | Implementation Status | Action Required for Production |
| :--- | :--- | :--- |
| **Password Hashing** | Already implemented | None (`bcryptjs` cost 12) |
| **Session Cookie Security** | Already implemented | Verify HTTPS secure flag in production |
| **Mutation Authorization** | Must improve | Ensure `requireAdmin()` guards all Server Actions and API routes |
| **Login Rate Limiting** | Must fix before production | Implement simple sliding-window IP/email rate limiting on login action |
| **CSRF Protection** | Already implemented | Next.js Server Actions built-in origin verification |
| **HTML Sanitization** | Must fix before production | Integrate server-side HTML sanitizer before saving journal/trail content |
| **Input Validation** | Must improve | Use Zod schemas for all mutation payloads |
| **Environment Secrets** | Already implemented | Strict `.env` usage (`AUTH_SECRET`, `ADMIN_PASSWORD_HASH`) |

---

## 15. Correct SEO Modeling

To prevent inaccurate semantic markup, `PlaceType` enum is introduced for `TrailLocation`:

```prisma
enum PlaceType {
  TOURIST_ATTRACTION
  PLACE
  NATURAL_FEATURE
  PARK
  FOOD_ESTABLISHMENT
}
```

* **TouristAttraction:** Used only for recognized monuments, viewpoints, and major visitor destinations.
* **Place / NaturalFeature:** Used for generalized regions, trailheads, rural areas, rivers, and coastal segments.
* **Journal / Food:** Structured as `Article` or `BlogPosting` JSON-LD schemas.

---

## 16. Proposed Target Schema (PROPOSED ONLY — NOT IMPLEMENTED)

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum ContentStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum JournalType {
  STORY
  FOOD
}

enum District {
  CHITTAGONG
  COX_BAZAR
  RANGAMATI
  BANDARBAN
  KHAGRACHARI
}

enum TerrainType {
  COAST
  HILLS
  RIVER
  CITY
  RURAL
}

enum PlaceType {
  TOURIST_ATTRACTION
  PLACE
  NATURAL_FEATURE
  PARK
  FOOD_ESTABLISHMENT
}

model MediaAsset {
  id           Int      @id @default(autoincrement())
  publicId     String   @unique
  secureUrl    String
  width        Int?
  height       Int?
  format       String?
  resourceType String   @default("image")
  altText      String?
  createdAt    DateTime @default(now())

  trailCovers       TrailLocation[]   @relation("TrailCoverMedia")
  trailGalleries    TrailGallery[]
  journalCovers     JournalPost[]     @relation("JournalCoverMedia")
  homepageGalleries HomepageGallery[]

  @@map("media_assets")
}

model TrailGallery {
  trailId      Int
  mediaAssetId Int
  sortOrder    Int           @default(0)
  trail        TrailLocation @relation(fields: [trailId], references: [id], onDelete: Cascade)
  mediaAsset   MediaAsset    @relation(fields: [mediaAssetId], references: [id], onDelete: Cascade)

  @@id([trailId, mediaAssetId])
  @@map("trail_galleries")
}

model HomepageGallery {
  id           Int        @id @default(autoincrement())
  mediaAssetId Int
  sortOrder    Int        @default(0)
  mediaAsset   MediaAsset @relation(fields: [mediaAssetId], references: [id], onDelete: Cascade)

  @@map("homepage_galleries")
}

model TrailLocation {
  id                 Int           @id @default(autoincrement())
  name               String
  slug               String        @unique
  excerpt            String?       @db.Text
  description        String        @db.LongText
  district           District      @default(CHITTAGONG)
  administrativeArea String?
  localArea          String?
  terrainType        TerrainType?
  latitude           Float?
  longitude          Float?
  status             ContentStatus @default(DRAFT)
  publishedAt        DateTime?
  isFeatured         Boolean       @default(false)
  featuredOrder      Int?
  coverMediaId       Int?
  coverMedia         MediaAsset?   @relation("TrailCoverMedia", fields: [coverMediaId], references: [id], onDelete: SetNull)
  seoTitle           String?
  seoDescription     String?
  ogImage            String?
  placeType          PlaceType     @default(PLACE)
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt

  gallery            TrailGallery[]
  journalPosts       JournalPost[]

  @@index([district])
  @@index([district, administrativeArea])
  @@index([status])
  @@index([isFeatured, featuredOrder])
  @@map("trail_locations")
}

model JournalPost {
  id              Int           @id @default(autoincrement())
  title           String
  slug            String        @unique
  excerpt         String?       @db.Text
  content         String        @db.LongText
  type            JournalType   @default(STORY)
  status          ContentStatus @default(DRAFT)
  publishedAt     DateTime?
  isFeatured      Boolean       @default(false)
  featuredOrder   Int?
  coverMediaId    Int?
  coverMedia      MediaAsset?   @relation("JournalCoverMedia", fields: [coverMediaId], references: [id], onDelete: SetNull)
  seoTitle        String?
  seoDescription  String?
  ogImage         String?
  trailId         Int?
  trail           TrailLocation? @relation(fields: [trailId], references: [id], onDelete: SetNull)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([type])
  @@index([status])
  @@index([isFeatured, featuredOrder])
  @@index([trailId])
  @@map("journal_posts")
}

model SiteSettings {
  id                  Int      @id @default(1)
  siteName            String   @default("Chittagong Trail")
  heroTitle           String   @default("Discover the Soul of Chittagong")
  heroSubtitle        String   @default("Independent exploration and storytelling across hills, coast, city, and rivers.")
  heroBackgroundImage String?
  aboutHeading        String?
  aboutContent        String?  @db.Text
  contactEmail        String?  @default("admin@chittagongtrail.com")
  socialFacebook      String?
  socialInstagram     String?
  socialYouTube       String?
  footerText          String?
  updatedAt           DateTime @updatedAt

  @@map("site_settings")
}
```

---

## 17. Field-by-Field Migration Table

| Model | Field / Change | Existing State | Proposed State | Risk | Backfill Strategy | Rollback Consideration |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TrailLocation` | `district` | None | `District` Enum | Low | Default to `CHITTAGONG` (0 records) | Drop column |
| `TrailLocation` | `administrativeArea` | None | `String?` | Low | Null | Drop column |
| `TrailLocation` | `status` | Implicit public | `ContentStatus` | Low | Default `DRAFT` | Drop column |
| `TrailLocation` | `isFeatured` | None | `Boolean` | Low | Default `false` | Drop column |
| `TrailLocation` | `coverMediaId` | `photos` (String) | Relational `MediaAsset?` | Low | Null | Restore `photos` column |
| `JournalPost` | `type` | `category` (String) | `JournalType` Enum | Low | Map `"food"` to `FOOD`, others to `STORY` | Restore `category` string |
| `JournalPost` | `status` | Implicit public | `ContentStatus` | Low | Default `DRAFT` | Drop column |
| `JournalPost` | `publishedDate` | `DateTime @default(now())` | `publishedAt DateTime?` | Low | Copy existing timestamps | Restore `publishedDate` |
| New Models | `media_assets`, `trail_galleries`, `homepage_galleries`, `site_settings` | None | New Tables | None | N/A | Drop tables |

*Note: Since the database currently contains 0 TrailLocation and 0 JournalPost records, content migration risk is zero.*

---

## 18. Define Phase A2 Deliverables Safely

Phase A2 will prepare (without executing any database writes):
1. Database backup checkpoint.
2. Prisma schema diff inspection.
3. Migration SQL review (`prisma migrate diff` / generated migration files).
4. Prisma validation (`prisma validate`).
5. Rollback verification plan.
6. Owner approval gate.

No database writes or migrations will be executed automatically.

---

## 19. Updated V1 Scope

* **Must Have:**
  * Full Chittagong 5-district location hierarchy
  * Publication workflow (`DRAFT`, `PUBLISHED`, `ARCHIVED`) with safe `DRAFT` default
  * Controlled `JournalType` (`STORY`, `FOOD`)
  * Relational `MediaAsset` architecture with Cloudinary lifecycle tracking
  * Singleton `SiteSettings` and homepage curation flags (`isFeatured`, `featuredOrder`)
  * Delete protection for trails linked to journal posts
  * Admin search, filtering, pagination, and mutation authorization

* **Should Have:**
  * Rich HTML sanitization
  * Scheduled publishing (deferred state handling)
  * Basic admin activity dashboard stats

* **Defer:**
  * Multi-user permissions
  * Standalone generic page builder
  * Automated social media syndication

* **Reject:**
  * Enterprise heavy CMS packages
  * Multi-vendor booking systems

---

## 20. Open Owner Decisions

| Decision | Recommended Option | Alternative | Impact |
| :--- | :--- | :--- | :--- |
| **District Field Type** | Controlled Enum (5 districts) | Free-form String | Enum enforces strict filtering and prevents typo fragmentation across the 5 target districts. |
| **Content Storage Format** | Sanitized HTML | Markdown / JSON Editor | HTML matches existing rendering patterns and gives the solo author maximum formatting freedom. |
| **Media Storage Strategy** | Relational `MediaAsset` model | Comma-separated string URLs | Relational asset tracking enables orphan prevention, dimensions, and Cloudinary public ID maintenance. |

---

## 21. Version and Status

* **Version:** 1.1 — Revised Architecture Proposal
* **Status:** Awaiting Owner Approval
