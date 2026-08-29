# Chittagong Trail — Project Decisions Log

**Document:** `DECISIONS.md`
**Version:** 2.0
**Last Updated:** Phase A8 Homepage Rebuild Specification
**Project:** Chittagong Trail

---

## Purpose

This document records all approved project decisions to prevent reinterpretation by future coding agents or AI assistants.

---

## Phase 3 — Technical Decisions (Approved)

### 1. Rich Text Editor

**Decision:** Use **Tiptap** for JournalPost content.

```text
Requirements:
  - Lightweight implementation
  - Support: headings, paragraphs, links, lists, blockquotes, basic formatting
  - Semantic content structure for public rendering
  - No over-engineering
```

---

### 2. Image Upload

**Decision:** Use **server/local storage** for V1.

```text
Requirements:
  - Abstracted storage layer for future migration (S3/Cloudinary)
  - No cloud storage dependency yet
  - Store image metadata and alt text
  - Follow Next.js image optimization strategy
```

---

### 3. Map Provider

**Decision:** Use **Leaflet + OpenStreetMap**.

```text
Requirements:
  - No Google Maps dependency
  - No Mapbox dependency
  - TrailLocation latitude/longitude drives markers
  - Marker click → Trail page navigation
  - Modular implementation for provider replacement
```

---

### 4. Pagination

**Decision:** Use **numbered pagination** for archive/list pages.

```text
Requirements:
  - No infinite scroll in V1
  - Architecture compatible with future "Load more" behavior
```

---

### 5. Search

**Decision:** **No search in V1**.

```text
Requirements:
  - No search UI
  - No search API
  - No search database infrastructure
  - Can be added later if content volume justifies it
```

---

### 6. Trails Count

**Decision:** **Database-driven, not hard-coded**.

```text
Requirements:
  - Trail pages and cards must be database-driven
  - Homepage may display limited featured/selected subset
  - /trails works with whatever number of published TrailLocation records exist
  - No fixed count assumption
```

---

### 7. Journal Posts Count

**Decision:** **Database-driven, not hard-coded**.

```text
Requirements:
  - Journal listings must be database-driven
  - Homepage can display limited latest/featured subset
  - No fixed count assumption
```

---

### 8. Food Architecture

**Decision:** **Food = JournalPost with category/type = "food"**.

```text
Requirements:
  - No separate Food model for V1
  - No Food subcategories yet
  - /food filters JournalPost records by food category
  - Architecture flexible for future dedicated model
```

---

### 9. Gallery

**Decision:** **No standalone /gallery page in V1**.

```text
Requirements:
  - Keep Unedited Gallery as homepage/content section
  - No Gallery database infrastructure yet
  - Architecture extendable for future standalone gallery
```

---

### 10. Standalone Map

**Decision:** **No standalone /map page in V1**.

```text
Requirements:
  - Map remains discovery/navigation layer
  - Used in Homepage and Trails section only
  - Can be introduced later if content volume/UX requires it
```

---

## Phase 3 — Structural Decisions (Approved)

### Public URLs

```text
/
/trails
/trails/[slug]
/journal
/journal/[slug]
/food
/food/[slug]
/about
/404
```

### Core Content Models

```text
TrailLocation
JournalPost
```

### Content Relationship

```text
Trail = Place
Journal = Story
Food = Journal category/type
```

### Homepage Sections

```text
01. Hero
02. Introduction
03. Explore Trails
04. Seasonal/Mood
05. Interactive Map
06. Journal
07. Food
08. Unedited Gallery
09. About / Sign-off
10. Footer
```

### Primary Navigation

```text
Trails
Journal
Food
About
```

### Map

```text
Provider: Leaflet + OpenStreetMap
Role: Discovery/navigation layer
Not standalone page in V1
```

### Admin

```text
Lightweight /admin area
Journal CRUD
Trails CRUD
```

---

## Brand Assets Status

### Current Status

```text
BRAND ASSETS NOW AVAILABLE:

Location: /public/images/

Assets:
  1. chittagongtrail_logo.png
     - Circular watercolor logo
     - Man walking toward hills/sunrise
     - Dotted trail path
     - River at bottom
     - Dimensions: 792 x 800px
     - Aspect ratio: ~1:1

  2. chittagongtrail-wordmark.png
     - Circular logo + "Chittagong Trail" text
     - Hand-lettered style
     - Dimensions: 1800 x 480px
     - Aspect ratio: 3.75:1
     - Background: Black (for dark backgrounds)

  3. chittagongtrail-favicon.png
     - Small circular logo
     - Dimensions: 48 x 48px
     - Aspect ratio: 1:1
```

### Asset Usage Rules

```text
LOGO (chittagongtrail_logo.png):
  - Primary brand mark
  - Use on LIGHT backgrounds (cream, white)
  - Use for: navigation (scrolled state), about page, hero on light

WORDMARK (chittagongtrail-wordmark.png):
  - Logo + text combination
  - Use on DARK backgrounds (near-black, dark brown)
  - Use for: footer, dark sections, hero on dark imagery

FAVICON (chittagongtrail-favicon.png):
  - Browser tab icon
  - Direct use as favicon
```

### Colors Derived from Logo

```text
FINAL COLORS (derived from actual logo):

Backgrounds:
  --bg-primary: #FDF5E6 (warm cream)
  --bg-secondary: #F5E6D3 (darker cream)
  --bg-surface: #FFFFFF (white)

Text:
  --text-primary: #5D4037 (dark brown/sepia)
  --text-secondary: #8D6E63 (lighter brown)
  --text-muted: #A1887F (muted brown)

Accents:
  --accent-primary: #C9A882 (terracotta)
  --accent-secondary: #D4956A (orange/warm)
  --accent-teal: #7FB5C4 (teal — use sparingly)

Dark sections:
  --dark-bg: #3E2723 (very dark brown)
  --dark-text: #FDF5E6 (cream)
```

---

## Phase 4 — Design System (Finalized with Brand Assets)

### Visual Identity (Finalized)

```text
1. Color palette — FINAL (derived from actual logo)
2. Typography — RECOMMENDED (Playfair Display + DM Sans, pending approval)
3. Logo treatment — FINAL (usage rules defined)
4. Favicon — FINAL (chittagongtrail-favicon.png)
```

### Design System Principles (Defined in DESIGN-SYSTEM.md)

```text
LOCKED DESIGN PRINCIPLES:

1. Visual personality: Cinematic, warm, earthy, editorial, personal
2. Color palette: Derived from actual logo (cream, terracotta, teal, dark brown)
3. Typography direction: Editorial serif headings + clean sans body
4. Spacing system: 4px base, consistent scale
5. Layout: Container-based, responsive grid
6. Image-first approach
7. Mobile-first responsive
8. Accessibility-first
9. Performance-conscious
10. Animation: Subtle, purposeful, GSAP
```

### Final Values (Based on Brand Assets)

```text
COLORS — FINAL:
  --bg-primary: #FDF5E6
  --bg-secondary: #F5E6D3
  --bg-surface: #FFFFFF
  --text-primary: #5D4037
  --text-secondary: #8D6E63
  --text-muted: #A1887F
  --accent-primary: #C9A882
  --accent-secondary: #D4956A
  --accent-teal: #7FB5C4
  --dark-bg: #3E2723
  --dark-text: #FDF5E6

LOGO USAGE — FINAL:
  chittagongtrail_logo.png → Light backgrounds
  chittagongtrail-wordmark.png → Dark backgrounds
  chittagongtrail-favicon.png → Browser favicon
```

### Provisional Values (Awaiting Approval)

```text
TYPOGRAPHY — PROVISIONAL:
  Display: 'Playfair Display', Georgia, serif (recommended)
  Body: 'DM Sans', system sans-serif stack (recommended)

BORDER RADIUS — PROVISIONAL:
  --radius-sm: 4px
  --radius-md: 8px
  --radius-lg: 16px

SHADOWS — PROVISIONAL:
  Standard shadow scale
```

---

## Phase A8 — Homepage Rebuild Specification (Approved)

### 11. Homepage Architecture

**Decision:** Complete homepage rebuild with 10-section editorial structure.

```text
New Section Order:
  01. Cinematic Hero
  02. Chittagong Statement
  03. Trail Discovery
  04. Featured Trail Moment
  05. Chittagong Geography (Map)
  06. Stories from Chittagong
  07. Taste of Chittagong (Food)
  08. Visual Interlude (Gallery)
  09. Closing / Invitation
  10. Footer

Removed:
  - Seasonal/Mood (standalone section removed)
  - Introduction (reframed as Chittagong Statement)
```

---

### 12. Seasonal/Mood Section

**Decision:** Remove as standalone homepage section.

```text
Rationale:
  - Requires ongoing owner copy updates
  - Risk of stale content
  - Seasonal mood woven into hero imagery and editorial moments
  - SiteSettings seasonal fields remain in DB (unused on homepage)
```

---

### 13. Founder Voice

**Decision:** Founder as curator, not subject.

```text
Rules:
  - Chittagong is the main subject
  - Founder provides perspective and curation
  - Language uses place-based framing, not "I visited"
  - First-person appears max 2-3 times on homepage
  - Closing section may use personal sign-off
```

---

### 14. Trails Presentation

**Decision:** Editorial mosaic, not card grid.

```text
Layout:
  - 1 featured trail (large, full-width)
  - 3-4 supporting trails (asymmetric mosaic)
  - Featured selection via TrailLocation.isFeatured + featuredOrder
  - Each trail: full-bleed image + name overlay
```

---

### 15. Food Presentation

**Decision:** Horizontal scroll or editorial layout, not card grid.

```text
Layout:
  - Horizontal scroll of 3-4 food items
  - Each item: image + name + place context
  - Emphasizes Chittagong food culture
  - Source: JournalPost.type = FOOD
```

---

### 16. People / Culture / History

**Decision:** No dedicated section.

```text
Rationale:
  - Woven into Journal stories, Trails, Food
  - Avoids unnecessary section count
  - Culture appears through editorial voice and content
```

---

### 17. Gallery / Visual Interlude

**Decision:** Use HomepageGallery model, atmospheric composition.

```text
Layout:
  - 3-4 images in mixed aspect ratio composition
  - Location labels, no heavy captions
  - Uses existing HomepageGallery model
  - Editorial, not decorative
  - REQUIRES OWNER DECISION: media availability
```

---

### 18. Site Settings — Seasonal Fields

**Decision:** Leave in database, mark as reserved.

```text
Fields: seasonalEyebrow, seasonalTitle, seasonalContent, seasonalMediaId
Status: Present in DB and admin UI, unused on homepage
Action: Mark as "Reserved for future use" in admin UI
```

---

## Decisions NOT Yet Made

### Content

```text
- Exact hero copy
- Chittagong Statement paragraph copy
- Closing section copy
- Footer copy
- 404 page copy
- About page content
```

### Owner Decisions (from A8 Specification)

```text
- Hero media type (image vs video)
- Number of featured trails (1 vs 2)
- Founder attribution in closing
- Visual interlude media availability
- Seasonal fields disposition
```

### Technical (Future Phases)

```text
- Rich text editor configuration details
- Image upload API implementation
- Map interaction specifics
- Animation implementation details
- Admin authentication method
- HomepageGallery admin management
```

---

## Approval Record

| Phase | Status | Date | Notes |
|-------|--------|------|-------|
| Phase 1 | Technical Foundation | Complete | Next.js, Prisma, MySQL |
| Phase 2 | Site Architecture | Approved | STRUCTURE.md |
| Phase 3 | Content Architecture | Approved | WIREFRAMES.md + Technical Decisions |
| Phase 4 | Visual Identity | Complete | Brand assets integrated, awaiting typography approval |
| Phase A8 | Homepage Rebuild Specification | Complete | A8-HOMEPAGE-REBUILD.md |

---

## Important Notes for Future Agents

1. **Do not reinterpret approved decisions** — This document is the source of truth
2. **Do not invent brand assets** — Wait for actual logo/colors from project owner
3. **Placeholders must be marked** — Any temporary values must be clearly labeled
4. **Database safety rules remain in effect** — See STRUCTURE.md
5. **Phase gates are mandatory** — Do not skip approval steps

---

**This document should be updated at the end of each phase.**
