# Chittagong Trail — Backend & CMS Architecture (Major Phase A Revision)

**Document:** `BACKEND-ARCHITECTURE.md`
**Version:** 1.2 — Final Architecture Proposal
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
* `district`: Controlled enum (`CHITTAGONG`, `COX_BAZAR`, `RANGAMATI`, `BANDARBAN`, `KHAGRACHARI`) — **Required, no default**. Must be explicitly selected by the admin to prevent silent misclassification.
* `administrativeArea`: Neutral string field representing Upazila, Thana, or Municipality (e.g., "Raozan", "Teknaf", "Sadar", "Lama")
* `localArea`: Optional string field representing specific neighborhoods, valleys, beaches, or trailheads (e.g., "Patenga Beach", "Bogakine Lake", "Boga Lake Trailhead")
* `terrainType`: Optional editorial/geographic classification enum (`COAST`, `HILLS`, `RIVER`, `CITY`, `RURAL`) kept separate from administrative geography.
* `latitude`: Float? (WGS84 decimal degrees)
* `longitude`: Float? (WGS84 decimal degrees)

### District Design Evaluation
* **Controlled Enum vs Normalized Model vs Validated String:**
  * *Normalized District Model:* Over-engineered for V1 since Chittagong division districts are fixed and static.
  * *Validated String:* Risk of typo variations (`Chittagong`, `Ctg`, `chittagong`).
  * *Controlled Enum:* **Selected.** Provides strict type safety, zero database lookup overhead, clean Prisma queries, and perfect alignment with the 5 target districts.
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
| `district` | District | Required | — | @@index | Primary geographic filter | Explicit selection required |
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
| `ogMediaId` | Int? | Nullable | — | — | Social share image relation | None |
| `metaTitle` | String? | Nullable | — | — | Custom meta title (SEO) | Preserved from existing |
| `metaDescription` | String? | Nullable | — | — | Custom meta description (SEO) | Preserved from existing |
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
| `ogMediaId` | Int? | Nullable | — | — | Social share image relation | None |
| `metaTitle` | String? | Nullable | — | — | Custom meta title (SEO) | Preserved from existing |
| `metaDescription` | String? | Nullable | — | — | Custom meta description (SEO) | Preserved from existing |
| `trailId` | Int? | Nullable | — | @@index | Optional relation to TrailLocation | Preserved with strict onDelete behavior |
| `createdAt` | DateTime | Required | `now()` | — | Audit trail | None |
| `updatedAt` | DateTime | Required | @updatedAt | — | Audit trail | None |

---

## 8. Final Content-Storage Decision

* **Chosen V1 Format:** **Sanitized HTML.**
* **Audit & Justification:** The existing application renders rich text content. Sanitized HTML provides immediate flexibility for rich editorial formatting (headings, blockquotes, lists, inline images) without enforcing rigid Markdown syntax on the single owner.
* **Server-Side Sanitization (Must Have):** All HTML input must be sanitized on the server before database persistence using an established sanitizer (`sanitize-html`) to prevent XSS.
* **Sanitization Allowlist & Rules:**
  * **Allowed Tags:** Standard structural and typographic tags (`p`, `h1`-`h4`, `blockquote`, `ul`, `ol`, `li`, `strong`, `em`, `a`, `img`, `br`, `hr`, `code`, `pre`).
  * **Disallowed Elements & Attributes:** Scripts (`<script>`), event handlers (`onclick`, `onload`, etc.), unsafe protocols (`javascript:`), iframes, embedded forms, and arbitrary style injection are strictly prohibited.
  * **Images:** Cloudinary HTTPS image URLs are permitted with controlled safe attributes (`src`, `alt`, `width`, `height`, `loading`).
  * **Links:** External links (`target="_blank"`) automatically receive `rel="noopener noreferrer"`.
* **Public Rendering Safety:** Rendered using React `dangerouslySetInnerHTML` exclusively with server-sanitized markup. Existing stored HTML is also sanitized at render time as defense in depth.
* **Editor UI:** Basic textarea with formatting toolbar or clean HTML editing for V1 (Should Have).

---

## 9. Media Architecture Exactly

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
  trailCovers       TrailLocation[]   @relation("TrailCoverMedia")
  trailOgMedias     TrailLocation[]   @relation("TrailOgMedia")
  trailGalleries    TrailGallery[]
  journalCovers     JournalPost[]     @relation("JournalCoverMedia")
  journalOgMedias   JournalPost[]     @relation("JournalOgMedia")
  homepageGalleries HomepageGallery[]
  siteHeroMedias    SiteSettings[]    @relation("SiteHeroMedia")
  siteSeasonalMedias SiteSettings[]   @relation("SiteSeasonalMedia")

  @@map("media_assets")
}

model TrailGallery {
  trailId      Int
  mediaAssetId Int
  sortOrder    Int           @default(0)
  trail        TrailLocation @relation(fields: [trailId], references: [id], onDelete: Cascade)
  mediaAsset   MediaAsset    @relation(fields: [mediaAssetId], references: [id], onDelete: Restrict)

  @@id([trailId, mediaAssetId])
  @@map("trail_galleries")
}

model HomepageGallery {
  id           Int        @id @default(autoincrement())
  mediaAssetId Int
  sortOrder    Int        @default(0)
  mediaAsset   MediaAsset @relation(fields: [mediaAssetId], references: [id], onDelete: Restrict)

  @@map("homepage_galleries")
}
```

### Media Lifecycle, Deletion & Inline Reference Rules
* **Direct Media Library Deletion:** Blocked while any structured relation (`coverMediaId`, `ogMediaId`, `heroMediaId`, `seasonalMediaId`, `TrailGallery`, `HomepageGallery`) points to it.
* **Inline HTML Image References:**
  * Every uploaded inline image is first registered as a `MediaAsset`.
  * Before `MediaAsset` deletion, the service checks structured relations *and* scans `TrailLocation.description` and `JournalPost.content` for the asset's `secureUrl` or `publicId`.
  * If referenced in inline HTML, deletion is blocked.
* **Content / Trail Deletion Rules:**
  * Content deletion may delete join records (`TrailGallery`) but must not automatically delete the underlying `MediaAsset` records.
  * `TrailLocation` deletion cascades to its `TrailGallery` join rows, while preserving `MediaAsset` records for later reference-aware cleanup.
  * Cloudinary destruction happens only after the asset has zero known structured and inline references.

---

## 10. Correct SiteSettings Singleton & Homepage Architecture

### Singleton Enforcement Strategy
* **Application Services:** Always read and update record `id = 1`.
* **Initialization:** Uses upsert for `id = 1`.
* **Admin Routes:** Do not accept arbitrary settings IDs. No generic create/delete endpoint exists for `SiteSettings`.
* **Database & Admin Guard:** While the database table technically permits multiple primary keys, application authorization, service design, and absence of delete/create endpoints enforce a strict singleton. `SiteSettings` cannot be deleted through the Admin interface.

### SiteSettings Fields & Curation Limits
The singleton model manages site-wide identity and homepage presentation without a heavy page builder:

```prisma
model SiteSettings {
  id                  Int         @id @default(1)
  siteName            String      @default("Chittagong Trail")
  heroTitle           String      @default("")
  heroSubtitle        String      @default("")
  heroMediaId         Int?
  heroMedia           MediaAsset? @relation("SiteHeroMedia", fields: [heroMediaId], references: [id], onDelete: SetNull)
  introductionHeading String      @default("")
  introductionContent String      @default("") @db.Text
  seasonalEyebrow     String      @default("")
  seasonalTitle       String      @default("")
  seasonalContent     String      @default("") @db.Text
  seasonalMediaId     Int?
  seasonalMedia       MediaAsset? @relation("SiteSeasonalMedia", fields: [seasonalMediaId], references: [id], onDelete: SetNull)
  aboutHeading        String      @default("")
  aboutContent        String      @default("") @db.Text
  contactEmail        String      @default("")
  socialFacebook      String?
  socialInstagram     String?
  socialYouTube       String?
  footerText          String      @default("")
  updatedAt           DateTime    @updatedAt

  @@map("site_settings")
}
```

### Homepage Curation Limits & Query Rules
* **Homepage Trails:** Maximum intended count: 4 items (`isFeatured: true`, ordered by `featuredOrder ASC`, fallback `publishedAt DESC`).
* **Homepage Story Posts:** Maximum intended count: 3 items (`type: STORY`, `isFeatured: true`, ordered by `featuredOrder ASC`, fallback `publishedAt DESC`).
* **Homepage Food Posts:** Maximum intended count: 3 items (`type: FOOD`, `isFeatured: true`, ordered by `featuredOrder ASC`, fallback `publishedAt DESC`).
* **Homepage Gallery:** Maximum intended count: 6-8 items (`HomepageGallery` relation ordered by `sortOrder ASC`).
* **Query Execution:** Public queries strictly filter `status: PUBLISHED`, `isFeatured: true`, sort non-null `featuredOrder` ascending, apply `publishedAt DESC` deterministic fallback, and apply section limits.

---

## 11. Correct Delete Safety

* **TrailLocation Deletion:** Must verify whether any `JournalPost` is linked via `trailId` (enforced with `onDelete: Restrict` or application-level check). If active journal posts exist (regardless of `DRAFT`, `PUBLISHED`, or `ARCHIVED` status), deletion is blocked with a clear error requiring the admin to reassign or unlink the posts first. No silent cascading deletion of editorial content is allowed.
* **MediaAsset Deletion:** Blocked if referenced in any cover, OG, hero, seasonal, gallery, or homepage relation, or detected within HTML content strings.

---

## 12. Correct Admin V1 Scope

### Functional Areas
* **Dashboard:** Quick stats (published trails, published journal posts, draft counts, total media assets), recent activity.
* **Trails:** List view with search (name/slug), filters (district, status, featured), pagination (20 per page), sorting, row actions (edit, view, delete), status badges.
* **Journal / Food:** List view with tabs/filter by `JournalType` (Story vs Food), search, status filters, pagination.
* **Media Library:** Grid view of `MediaAsset` items, upload widget, alt-text editor, delete action.
* **Homepage Curation:** Form to manage featured items ordering and homepage gallery selection.
* **Site Settings:** Singleton form for hero text, about copy, social links, and footer info.
* **Authentication:** Secure login and logout.

---

## 13. Correct Security Requirements

| Security Control | Implementation Status | Action Required for Production |
| :--- | :--- | :--- |
| **Password Hashing** | Already implemented | None (`bcryptjs` cost 12) |
| **Session Cookie Security** | Already implemented | Verify HTTPS secure flag in production |
| **Mutation Authorization** | Must improve | Ensure `requireAdmin()` guards all Server Actions and API routes |
| **Login Rate Limiting** | Must fix before production | Implement simple sliding-window IP/email rate limiting on login action |
| **CSRF Protection** | Already implemented | Next.js Server Actions built-in origin verification |
| **HTML Sanitization** | **Must Have (V1)** | Integrate server-side HTML sanitizer before saving journal/trail content |
| **Input Validation** | Must improve | Use Zod schemas for all mutation payloads |
| **Environment Secrets** | Already implemented | Strict `.env` usage (`AUTH_SECRET`, `ADMIN_PASSWORD_HASH`) |

---

## 14. Correct SEO & PlaceType Modeling

```prisma
enum PlaceType {
  TOURIST_ATTRACTION
  PLACE
  NATURAL_FEATURE
  PARK
}
```
* **Note on Food Establishments:** Food establishments and culinary destinations are managed primarily within `JournalPost` (type `FOOD`). `TrailLocation` focuses on geographical places, trailheads, and attractions; `FOOD_ESTABLISHMENT` is omitted from `PlaceType` to maintain clean semantic separation.
* **Generic Fallback:** `PLACE` is used as the default structured-data type.
* **TouristAttraction:** Used only when genuinely appropriate for major visitor monuments or viewpoints.
* **Meta Fields:** `metaTitle` and `metaDescription` are preserved across both content models to maintain seamless compatibility with existing SEO helper utilities (`lib/seo.ts`).

---

## 15. Proposed Target Schema (PROPOSED ONLY — NOT IMPLEMENTED)

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

  trailCovers        TrailLocation[]   @relation("TrailCoverMedia")
  trailOgMedias      TrailLocation[]   @relation("TrailOgMedia")
  trailGalleries     TrailGallery[]
  journalCovers      JournalPost[]     @relation("JournalCoverMedia")
  journalOgMedias    JournalPost[]     @relation("JournalOgMedia")
  homepageGalleries  HomepageGallery[]
  siteHeroMedias     SiteSettings[]    @relation("SiteHeroMedia")
  siteSeasonalMedias SiteSettings[]    @relation("SiteSeasonalMedia")

  @@map("media_assets")
}

model TrailGallery {
  trailId      Int
  mediaAssetId Int
  sortOrder    Int           @default(0)
  trail        TrailLocation @relation(fields: [trailId], references: [id], onDelete: Cascade)
  mediaAsset   MediaAsset    @relation(fields: [mediaAssetId], references: [id], onDelete: Restrict)

  @@id([trailId, mediaAssetId])
  @@map("trail_galleries")
}

model HomepageGallery {
  id           Int        @id @default(autoincrement())
  mediaAssetId Int
  sortOrder    Int        @default(0)
  mediaAsset   MediaAsset @relation(fields: [mediaAssetId], references: [id], onDelete: Restrict)

  @@map("homepage_galleries")
}

model TrailLocation {
  id                 Int           @id @default(autoincrement())
  name               String
  slug               String        @unique
  excerpt            String?       @db.Text
  description        String        @db.LongText
  district           District      // Explicit selection required (no default)
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
  ogMediaId          Int?
  ogMedia            MediaAsset?   @relation("TrailOgMedia", fields: [ogMediaId], references: [id], onDelete: SetNull)
  metaTitle          String?
  metaDescription    String?
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
  ogMediaId       Int?
  ogMedia         MediaAsset?   @relation("JournalOgMedia", fields: [ogMediaId], references: [id], onDelete: SetNull)
  metaTitle       String?
  metaDescription String?
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
  id                  Int         @id @default(1)
  siteName            String      @default("Chittagong Trail")
  heroTitle           String      @default("")
  heroSubtitle        String      @default("")
  heroMediaId         Int?
  heroMedia           MediaAsset? @relation("SiteHeroMedia", fields: [heroMediaId], references: [id], onDelete: SetNull)
  introductionHeading String      @default("")
  introductionContent String      @default("") @db.Text
  seasonalEyebrow     String      @default("")
  seasonalTitle       String      @default("")
  seasonalContent     String      @default("") @db.Text
  seasonalMediaId     Int?
  seasonalMedia       MediaAsset? @relation("SiteSeasonalMedia", fields: [seasonalMediaId], references: [id], onDelete: SetNull)
  aboutHeading        String      @default("")
  aboutContent        String      @default("") @db.Text
  contactEmail        String      @default("")
  socialFacebook      String?
  socialInstagram     String?
  socialYouTube       String?
  footerText          String      @default("")
  updatedAt           DateTime    @updatedAt

  @@map("site_settings")
}
```

---

## 16. Complete Field-by-Field Migration Table

| Model | Field / Change | Existing State | Proposed State | Risk | Backfill Strategy | Rollback Consideration |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TrailLocation` | `excerpt` | None | `String?` | Low | Null | Drop column |
| `TrailLocation` | `district` | None | `District` Enum (Required) | Low | Explicit admin selection / technical migration default if required | Drop column |
| `TrailLocation` | `administrativeArea` | None | `String?` | Low | Null | Drop column |
| `TrailLocation` | `localArea` | None | `String?` | Low | Null | Drop column |
| `TrailLocation` | `terrainType` | None | `TerrainType?` | Low | Null | Drop column |
| `TrailLocation` | `status` | Implicit public | `ContentStatus` | Low | Default `DRAFT` | Drop column |
| `TrailLocation` | `publishedAt` | None | `DateTime?` | Low | Null | Drop column |
| `TrailLocation` | `isFeatured` | None | `Boolean` | Low | Default `false` | Drop column |
| `TrailLocation` | `featuredOrder` | None | `Int?` | Low | Null | Drop column |
| `TrailLocation` | `coverMediaId` | `photos` (String) | Relational `MediaAsset?` | Low | Null | Restore `photos` column |
| `TrailLocation` | `ogMediaId` | `ogImage` (String) | Relational `MediaAsset?` | Low | Null | Restore `ogImage` column |
| `TrailLocation` | `metaTitle` | `metaTitle` (String) | Preserved (`metaTitle`) | None | Preserved | None |
| `TrailLocation` | `metaDescription` | `metaDescription` (String) | Preserved (`metaDescription`) | None | Preserved | None |
| `TrailLocation` | `placeType` | None | `PlaceType` | Low | Default `PLACE` | Drop column |
| `JournalPost` | `type` | `category` (String) | `JournalType` Enum | Low | Map `"food"` to `FOOD`, others to `STORY` | Restore `category` string |
| `JournalPost` | `status` | Implicit public | `ContentStatus` | Low | Default `DRAFT` | Drop column |
| `JournalPost` | `publishedAt` | `publishedDate` (DateTime) | `DateTime?` | Low | Copy existing timestamps | Restore `publishedDate` |
| `JournalPost` | `isFeatured` | None | `Boolean` | Low | Default `false` | Drop column |
| `JournalPost` | `featuredOrder` | None | `Int?` | Low | Null | Drop column |
| `JournalPost` | `coverMediaId` | `coverImage` (String) | Relational `MediaAsset?` | Low | Null | Restore `coverImage` |
| `JournalPost` | `ogMediaId` | `ogImage` (String) | Relational `MediaAsset?` | Low | Null | Restore `ogImage` |
| `JournalPost` | `metaTitle` | `metaTitle` (String) | Preserved (`metaTitle`) | None | Preserved | None |
| `JournalPost` | `metaDescription` | `metaDescription` (String) | Preserved (`metaDescription`) | None | Preserved | None |
| `JournalPost` | `trailId` | `trailId` (Int?) | Preserved with strict onDelete | Low | Preserved | None |
| New Models | `media_assets`, `trail_galleries`, `homepage_galleries`, `site_settings` | None | New Tables & Relations | Low (0 records) | N/A | Drop tables and relations |

*Note: Since the database currently contains 0 TrailLocation and 0 JournalPost records, content migration risk is minimal.*

---

## 17. Safe Rollback Strategy

* **Pre-Migration Preparation:** Create a fully verified database backup before applying any migration.
* **Schema Preservation:** Preserve the exact pre-migration Prisma schema version in version control.
* **SQL Review:** Thoroughly review generated migration SQL files prior to execution.
* **Rollback Execution Path:**
  * If rollback occurs before content entry (empty state), restoring the pre-migration database backup is the preferred and safest path.
  * If new `MediaAsset` or content records have been created post-migration, dropping tables would cause unrecoverable data loss and is **not** an acceptable automatic rollback mechanism.
  * **Cloudinary Reconciliation:** Cloudinary assets require separate manual or script-based reconciliation because database backup restoration/rollback does not delete or restore remote Cloudinary assets.
  * **No Automatic Destructive Rollback:** No automatic destructive rollback command is authorized.

---

## 18. Owner Decisions Summary

| Decision | Selected Option | Alternative | Impact |
| :--- | :--- | :--- | :--- |
| **District Field Type** | Controlled Enum (5 districts, required) | Free-form String / Default | Enum enforces strict filtering and prevents typo fragmentation; required selection prevents silent misclassification. |
| **Content Storage Format** | Sanitized HTML | Markdown / JSON Editor | HTML matches existing rendering patterns and gives the solo author maximum formatting freedom. |
| **Media Storage Strategy** | Relational `MediaAsset` model | Comma-separated string URLs | Relational asset tracking enables orphan prevention, dimensions, and Cloudinary public ID maintenance. |
| **Settings Management** | Fixed singleton `SiteSettings` service | Generic Page Builder | Provides structured control over hero, about, and seasonal sections without over-engineering. |

---

## 19. Version and Status

* **Version:** 1.2 — Final Architecture Proposal
* **Status:** Awaiting Owner Approval
