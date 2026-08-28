# Chittagong Trail — Backend & CMS Architecture (Major Phase A)

**Document:** `BACKEND-ARCHITECTURE.md`
**Version:** 1.0 — Architecture Audit & V1 Specification
**Status:** Proposal — Awaiting Owner Approval
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

## 2. Verified Current Implementation

* **Framework:** Next.js App Router (TypeScript)
* **ORM:** Prisma v6
* **Database:** Local XAMPP MariaDB (MySQL protocol)
* **Authentication:** Lightweight single-owner cookie session (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `AUTH_SECRET`)
* **Core Models:** `TrailLocation`, `JournalPost`
* **Media Storage:** Cloudinary (`chittagongtrail/trails`, `chittagongtrail/journal`, `chittagongtrail/general`)
* **Map Integration:** Leaflet / OpenStreetMap via dynamic coordinates (`latitude`, `longitude`)
* **SEO & Routing:** Dynamic metadata, JSON-LD (Article, TouristAttraction), sitemap.ts, robots.ts

---

## 3. Current Schema

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model JournalPost {
  id               Int      @id @default(autoincrement())
  title            String
  slug             String   @unique
  content          String   @db.LongText
  excerpt          String?  @db.Text
  category         String   @default("story")
  coverImage       String?
  coverImageAlt    String?
  metaTitle        String?
  metaDescription  String?
  ogImage          String?
  publishedDate    DateTime @default(now())
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  trailId          Int?
  trail            TrailLocation? @relation(fields: [trailId], references: [id])

  @@map("journal_posts")
}

model TrailLocation {
  id               Int      @id @default(autoincrement())
  name             String
  slug             String   @unique
  description      String   @db.LongText
  latitude         Float?
  longitude        Float?
  photos           String?  @db.Text
  photoAlt         String?
  metaTitle        String?
  metaDescription  String?
  ogImage          String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  journalPosts     JournalPost[]

  @@map("trail_locations")
}
```

---

## 4. Current Limitations & Audit Findings

1. **Publication Workflow:** Both models lack explicit `published` / `draft` / `archived` states and `isFeatured` boolean flags. All records created are instantly public in queries.
2. **Food Architecture:** Food is handled via `JournalPost.category = "food"`, but category is currently a free-form string rather than a constrained enum or controlled vocabulary, risking typo/case-sensitivity breakages.
3. **Media Lifecycle:** `photos` in `TrailLocation` is a comma-separated string (`String? @db.Text`). Cloudinary public IDs are not stored, preventing clean programmatic image replacement, deletion, or orphan asset cleanup. Alt text is singular (`photoAlt`, `coverImageAlt`) whereas multi-image galleries require per-image alt text or structured media objects.
4. **Homepage Curation:** Homepage sections (Featured Trails, Featured Stories, Seasonal/Mood, Gallery) rely on hardcoded queries (e.g. `orderBy: desc`, `take: 3`) rather than explicit curation flags (`isFeatured`, `sortOrder`, manual hero settings).
5. **Admin Information Architecture:** Admin currently consists of simple flat list tables with basic create/edit forms. It lacks search, pagination, filtering by category/status, bulk actions, and unsaved-change protection.
6. **Security & Validation:** Slug validation and URL patterns are basic. Password hashing uses standard bcrypt/argon2 via custom auth, but session revocation and brute-force rate-limiting can be hardened for production.

---

## 5. Trail Content Architecture

A `TrailLocation` represents a physical place across the Chittagong region (city, hills, coast, river, rural areas).

### Required Fields for V1
* Name
* Slug (unique, URL-friendly)
* Short summary / excerpt (for cards and meta)
* Full description / story (`@db.LongText`)
* District/Region / Upazila (to support full Chittagong coverage beyond city)
* Geographic coordinates (`latitude`, `longitude`) for map pins
* Cover image / primary photo & alt text
* Image gallery (structured URLs or media references)
* Publication state (`draft`, `published`, `archived`)
* Featured state (`isFeatured`)
* SEO fields (`metaTitle`, `metaDescription`, `ogImage`)
* Timestamps (`createdAt`, `updatedAt`)

---

## 6. Journal Content Architecture

A `JournalPost` represents stories, experiences, observations, and culinary features.

### Required Fields for V1
* Title
* Slug (unique)
* Excerpt
* Content (`@db.LongText` supporting rich text / clean HTML)
* Category (`story`, `food`, `observation`, etc.)
* Cover image & alt text
* Related Trail reference (`trailId`)
* Publication state (`draft`, `published`, `archived`)
* Featured state (`isFeatured`)
* Published date (supports scheduling/backdating)
* SEO fields (`metaTitle`, `metaDescription`, `ogImage`)
* Timestamps (`createdAt`, `updatedAt`)

---

## 7. Food Architecture

* **Decision:** Food remains part of the Journal architecture for V1 via `JournalPost.category = "food"`. A separate `Food` model is unnecessary and rejected.
* **Enhancement:** Enforce a controlled category vocabulary (e.g., `story` vs `food`) in the CMS forms and validation to prevent case/typo filtering issues. Food posts appear in both `/food` and the general `/journal` index unless filtered.

---

## 8. Media and Cloudinary Lifecycle

* **Storage Strategy:** Continue using Cloudinary for asset hosting.
* **Metadata Persistence:** Store Cloudinary `public_id`, `secure_url`, `width`, `height`, and `format` where possible. For galleries, transition from simple comma-separated strings to structured JSON or a lightweight media relation if required, while keeping V1 migration risk low.
* **Asset Cleanup:** Provide clear admin asset management guidelines or reference tracking to prevent orphaned Cloudinary assets.

---

## 9. Homepage Curation Architecture

To give the owner editorial control without a heavy page builder:
* **Featured Trails:** Selectable via `TrailLocation.isFeatured = true` and `sortOrder`.
* **Featured Stories / Food:** Selectable via `JournalPost.isFeatured = true`.
* **Hero & Intro:** Configurable via Site Settings or top-level CMS singletons / constants.
* **Gallery Selection:** Curated images marked for homepage display.

---

## 10. Publication Workflow

* **States:** `DRAFT`, `PUBLISHED`, `ARCHIVED`.
* **Safety:** Public queries must strictly filter `where: { status: "PUBLISHED" }` (or equivalent) so drafts are never accidentally leaked to public routes or sitemaps.
* **Preview:** Admin preview mode for drafts before publishing.

---

## 11. Admin Information Architecture

* **Dashboard:** Overview counts (Trails, Journal Posts, Food Posts, Drafts), quick actions.
* **Trails Management:** List with search, filtering by region/status, sorting, pagination, create/edit/delete with confirmation and relation checks.
* **Journal / Food Management:** List with category filter (`story` vs `food`), search, status badges, create/edit/delete.
* **Media Manager:** Cloudinary upload and asset browser.
* **Site Settings:** Homepage curation toggles, global metadata, social links.
* **Authentication:** Secure session management and logout.

---

## 12. Authentication & Security Assessment

* **Current Status:** Sufficient for single-owner V1 (cookie-based session with secure flags, hashed credentials).
* **Hardening:** Add rate limiting on login attempts and verify CSRF protection on Server Actions.

---

## 13. Validation & Data Integrity

* **Slugs:** Enforce strict regex validation (`[a-z0-9]+(?:-[a-z0-9]+)*`) and uniqueness checks.
* **Coordinates:** Validate latitude (-90 to 90) and longitude (-180 to 180).
* **Relations:** Prevent deletion of a `TrailLocation` if active `JournalPost` relations exist, or prompt for reassignment/cascade.
* **Revalidation:** Ensure Next.js `revalidatePath` / `revalidateTag` runs correctly upon content creation, update, and deletion.

---

## 14. SEO Data Support

The backend fully supports:
* Custom meta titles and descriptions
* Open Graph (OG) images
* Canonical URLs
* Structured JSON-LD (Article & TouristAttraction)
* Sitemap filtering (only published content included)

---

## 15. V1 Scope Classification

### Must Have
* Publication states (`draft` / `published`) for Trails and Journal
* Featured flags (`isFeatured`) for homepage curation
* Controlled category validation for Journal/Food
* Enhanced admin list filtering, search, and pagination
* Delete protection for trails with active journal relations
* Cloudinary public ID tracking for media safety

### Should Have
* Scheduled publication dates
* Rich text editor or enhanced markdown/HTML authoring assistance
* Admin dashboard quick stats and recent activity feed

### Defer
* Multi-user roles and permissions
* Separate `Food` database model
* Standalone generic page builder
* Automated social media cross-posting

### Reject
* Heavy enterprise CMS packages (Strapi, Sanity)
* Government tourism directory features
* Multi-vendor booking systems

---

## 16. Proposed Target Schema (Preview for Phase A2)

*Extending existing models without breaking current data:*
* Add `status` (String/Enum default `"PUBLISHED"` or `"DRAFT"`) to `TrailLocation` and `JournalPost`.
* Add `isFeatured` (Boolean default `false`) to both models.
* Add `region` / `upazila` (String?) to `TrailLocation` for expanded Chittagong coverage.
* Add structured JSON or fields for multi-image metadata if required.

---

## 17. Implementation Subphases (Major Phase A)

* **A1 — Backend Architecture Approval** (Current)
* **A2 — Schema & Migration Preparation**
* **A3 — Core Content Services & Validation Hardening**
* **A4 — Trail Management & Curation Logic**
* **A5 — Journal & Food Curation Logic**
* **A6 — Media Lifecycle & Cloudinary Refinement**
* **A7 — Homepage Curation & Settings Integration**
* **A8 — Admin Information Architecture UI Polish**
* **A9 — Security & SEO Verification**
* **A10 — Backend Testing & Checkpoint**

---

## 18. Approval Gate

This document requires owner sign-off before any database schema changes or backend implementation proceeds.
