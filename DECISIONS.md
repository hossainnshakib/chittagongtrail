# Chittagong Trail — Project Decisions Log

**Document:** `DECISIONS.md`
**Version:** 1.0
**Last Updated:** Phase 4 Design System
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
NO brand assets found in repository.

Missing:
  - Chittagong Trail logo
  - Circular watercolor logo (figure walking toward hills/sunrise)
  - Hand-lettered wordmark
  - Any brand imagery
```

### Required Assets

```text
Before Phase 4 (Visual Design) can be completed:

1. Logo file (PNG/SVG with transparency)
2. Logo usage guidelines (if any)
3. Any existing brand color references
4. Any existing typography references
5. Any brand photography/style references
```

### Placeholder Policy

```text
Until brand assets are provided:
  - Use placeholder colors (clearly marked as TEMPORARY)
  - Use system/default fonts (clearly marked as TEMPORARY)
  - Document all placeholders for later replacement
  - Do not invent final design values
```

---

## Phase 4 — Design System (Completed)

### Visual Identity (Awaiting Brand Assets)

```text
1. Color palette — WAITING for logo/brand assets
2. Typography — WAITING for logo/brand assets
3. Logo treatment — WAITING for logo file
4. Brand photography style — WAITING for reference
```

### Design System Principles (Defined in DESIGN-SYSTEM.md)

```text
LOCKED DESIGN PRINCIPLES:

1. Visual personality: Cinematic, warm, earthy, editorial, personal
2. Color direction: Cream + earthy accents + dark sections
3. Typography direction: Editorial serif headings + clean sans body
4. Spacing system: 4px base, consistent scale
5. Layout: Container-based, responsive grid
6. Image-first approach
7. Mobile-first responsive
8. Accessibility-first
9. Performance-conscious
10. Animation: Subtle, purposeful, GSAP
```

### Provisional Values (Awaiting Brand Assets)

```text
1. Exact color hex values — PROVISIONAL
2. Exact font families — PROVISIONAL
3. Border radius values — PROVISIONAL
4. Shadow depths — PROVISIONAL
5. Logo treatment — PENDING
```

### Design System Coverage

```text
DEFINED IN DESIGN-SYSTEM.md:

1. Color system (provisional values)
2. Typography system (provisional fonts)
3. Spacing system (final scale)
4. Layout principles (locked)
5. Component principles (locked)
6. Image system (locked)
7. Responsive behavior (locked)
8. Cinematic/storytelling principles (locked)
9. Animation direction (locked)
10. Accessibility principles (locked)
11. Performance principles (locked)
```

---

## Decisions NOT Yet Made

### Content

```text
- Exact hero copy
- Introduction paragraph copy
- Seasonal/mood section copy
- Footer copy
- 404 page copy
- About page content
```

### Technical (Future Phases)

```text
- Rich text editor configuration details
- Image upload API implementation
- Map interaction specifics
- Animation implementation details
- Admin authentication method
```

---

## Approval Record

| Phase | Status | Date | Notes |
|-------|--------|------|-------|
| Phase 1 | Technical Foundation | Complete | Next.js, Prisma, MySQL |
| Phase 2 | Site Architecture | Approved | STRUCTURE.md |
| Phase 3 | Content Architecture | Approved | WIREFRAMES.md + Technical Decisions |
| Phase 4 | Visual Identity | Design System Complete | Awaiting brand assets + approval |

---

## Important Notes for Future Agents

1. **Do not reinterpret approved decisions** — This document is the source of truth
2. **Do not invent brand assets** — Wait for actual logo/colors from project owner
3. **Placeholders must be marked** — Any temporary values must be clearly labeled
4. **Database safety rules remain in effect** — See STRUCTURE.md
5. **Phase gates are mandatory** — Do not skip approval steps

---

**This document should be updated at the end of each phase.**
