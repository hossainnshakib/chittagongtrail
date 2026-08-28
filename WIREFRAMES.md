# Chittagong Trail — Content Architecture & Wireframes

**Document:** `WIREFRAMES.md`
**Version:** 1.0 — Content Architecture Proposal
**Status:** Awaiting approval
**Project:** Chittagong Trail
**Domain:** `chittagongtrail.com`

---

## 1. Purpose

This document defines the content architecture and low-fidelity wireframe structure for the Chittagong Trail website.

It defines:

* Page-level information hierarchy
* Homepage section hierarchy
* Trail page content hierarchy
* Journal page content hierarchy
* Food content architecture
* Card content structure
* CTA hierarchy
* Above/below fold structure
* Mobile/desktop layout structure
* Internal linking strategy

This document is **not a visual design specification**.

It does not define:

* Final colors
* Fonts
* Typography
* Visual styling
* Animation details
* Final imagery
* Exact copy

---

# 2. Current Status

### Current phase

**Phase 3 — Content Architecture + Wireframes**

### Status

**Proposal — awaiting human approval**

### Next phase after approval

**Phase 4 — Visual Identity / Design System**

Do not begin visual design until this content architecture has been approved.

---

# 3. Content Architecture Decisions (Approved)

```text
Food:
  - V1: Journal category/type (not separate model)
  - Flexible for future dedicated model

Seasonal/Mood:
  - Keep on homepage
  - Editorial/storytelling section
  - No separate database entity

Gallery:
  - TBD
  - Resolve during wireframe phase
  - No database model yet

Core models:
  - TrailLocation
  - JournalPost (includes Food as category)

Relationships:
  - Trail → Journal (one-to-many)
  - Journal → Trail (many-to-one)
```

---

# 4. Homepage — Section Hierarchy

## 4.1 Section Order

```text
01. Hero
        ↓
02. Introduction
        ↓
03. Explore the Trails
        ↓
04. Chittagong / Mood / Seasonal Story
        ↓
05. Interactive Map
        ↓
06. Journal / Stories
        ↓
07. Food
        ↓
08. Unedited Gallery
        ↓
09. About / Personal Sign-off
        ↓
10. Footer
```

---

## 4.2 Hero Section

### Purpose
Immediate emotional connection. Establish place, identity, exploration.

### Content hierarchy
```text
[Full-screen background: video or photo]

[Centered content block]
  Logo / Brand mark
  Tagline statement
  Scroll indicator

[Optional: loading percentage]
```

### Above fold
- Full visual impact
- Brand identity
- Sense of place

### Desktop structure
```text
┌─────────────────────────────────────────────────┐
│                                                 │
│                                                 │
│              [Full-screen media]                │
│                                                 │
│                                                 │
│         ┌───────────────────────┐               │
│         │   Logo / Brand mark   │               │
│         │      Tagline          │               │
│         │   [Scroll indicator]  │               │
│         └───────────────────────┘               │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Mobile structure
```text
┌─────────────────────┐
│                     │
│                     │
│  [Full-screen media]│
│                     │
│                     │
│  ┌───────────────┐  │
│  │ Logo / Brand  │  │
│  │   Tagline     │  │
│  │ [Scroll ind.] │  │
│  └───────────────┘  │
│                     │
└─────────────────────┘
```

---

## 4.3 Introduction Section

### Purpose
Briefly explain what Chittagong Trail is.

### Content hierarchy
```text
[Section heading]

[Introductory paragraph — 2-3 sentences]

[Optional: secondary statement]
```

### Above/below fold
- Below hero
- Establishes context before trails

### Desktop structure
```text
┌─────────────────────────────────────────────────┐
│                                                 │
│         ┌───────────────────────┐               │
│         │    Section heading    │               │
│         │                       │               │
│         │   Introductory text   │               │
│         │                       │               │
│         │   Secondary statement │               │
│         └───────────────────────┘               │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Mobile structure
```text
┌─────────────────────┐
│                     │
│  ┌───────────────┐  │
│  │ Section       │  │
│  │ heading       │  │
│  │               │  │
│  │ Intro text    │  │
│  │               │  │
│  │ Secondary     │  │
│  │ statement     │  │
│  └───────────────┘  │
│                     │
└─────────────────────┘
```

---

## 4.4 Explore the Trails Section

### Purpose
Introduce featured locations. Drive to `/trails`.

### Content hierarchy
```text
[Section heading]

[Featured trail cards — 3 to 6]

[CTA: View All Trails → /trails]
```

### Card content structure
```text
┌─────────────────────────────────┐
│                                 │
│        [Cover image]            │
│                                 │
├─────────────────────────────────┤
│  Trail name                     │
│  Short description (1 line)     │
│  [Arrow/link indicator]         │
└─────────────────────────────────┘
```

### Card fields
```text
Required:
  - Cover image (from TrailLocation.coverImage)
  - Trail name (from TrailLocation.name)
  - Slug (for linking)

Optional:
  - Short description excerpt
  - Photo count indicator
  - Map pin indicator
```

### Above/below fold
- Below introduction
- First major content section
- High visibility

### Desktop structure
```text
┌─────────────────────────────────────────────────┐
│                                                 │
│         Explore the Trails                      │
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │  Card 1 │  │  Card 2 │  │  Card 3 │         │
│  │         │  │         │  │         │         │
│  │ [Image] │  │ [Image] │  │ [Image] │         │
│  │  Name   │  │  Name   │  │  Name   │         │
│  │  Desc   │  │  Desc   │  │  Desc   │         │
│  └─────────┘  └─────────┘  └─────────┘         │
│                                                 │
│         [View All Trails →]                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Mobile structure
```text
┌─────────────────────┐
│                     │
│ Explore the Trails  │
│                     │
│  ┌───────────────┐  │
│  │    Card 1     │  │
│  │   [Image]     │  │
│  │    Name       │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │    Card 2     │  │
│  │   [Image]     │  │
│  │    Name       │  │
│  └───────────────┘  │
│                     │
│  [View All Trails]  │
│                     │
└─────────────────────┘
```

---

## 4.5 Seasonal / Mood Section

### Purpose
Editorial storytelling layer about Chittagong's atmosphere.

### Content hierarchy
```text
[Section heading — editorial tone]

[Featured seasonal/mood story or observation]

[Supporting imagery]

[Optional: CTA to related content]
```

### Content approach
- Not database-driven
- Editorial content managed in code or CMS
- Can be updated seasonally
- Personal observation tone

### Desktop structure
```text
┌─────────────────────────────────────────────────┐
│                                                 │
│  ┌───────────────────┐  ┌───────────────────┐   │
│  │                   │  │                   │   │
│  │  [Featured image] │  │   Editorial text  │   │
│  │                   │  │                   │   │
│  │                   │  │   Observation     │   │
│  │                   │  │   Story           │   │
│  └───────────────────┘  └───────────────────┘   │
│                                                 │
│         [Optional CTA]                          │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Mobile structure
```text
┌─────────────────────┐
│                     │
│  [Featured image]   │
│                     │
│  Editorial text     │
│  Observation story  │
│                     │
│  [Optional CTA]     │
│                     │
└─────────────────────┘
```

---

## 4.6 Interactive Map Section

### Purpose
Visual discovery of locations.

### Content hierarchy
```text
[Section heading]

[Interactive map — centered on Chittagong]

[Location pins from TrailLocation]

[Click pin → /trails/[slug]]
```

### Map behavior
```text
Initial view:
  - Centered on Chittagong area
  - Shows Karnaphuli River, hills, coast
  - Pins for all TrailLocations

Interaction:
  - Hover pin → tooltip with name
  - Click pin → navigate to trail page

Mobile:
  - Simplified map interaction
  - Tap to expand
  - Tap pin → navigate
```

### Desktop structure
```text
┌─────────────────────────────────────────────────┐
│                                                 │
│         Discover Chittagong                     │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │                                           │  │
│  │              [Interactive Map]            │  │
│  │                                           │  │
│  │         • Patenga    • Foy's Lake         │  │
│  │         • Batali Hill                     │  │
│  │                                           │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Mobile structure
```text
┌─────────────────────┐
│                     │
│ Discover Chittagong │
│                     │
│  ┌───────────────┐  │
│  │               │  │
│  │ [Interactive  │  │
│  │     Map]      │  │
│  │               │  │
│  │  • Pin 1      │  │
│  │  • Pin 2      │  │
│  │               │  │
│  └───────────────┘  │
│                     │
└─────────────────────┘
```

---

## 4.7 Journal / Stories Section

### Purpose
Introduce latest journal entries. Drive to `/journal`.

### Content hierarchy
```text
[Section heading]

[Featured story — large card]

[Latest stories — 2 to 4 cards]

[CTA: View Journal → /journal]
```

### Card content structure
```text
Featured card:
┌─────────────────────────────────────────────────┐
│                                                 │
│              [Cover image]                      │
│                                                 │
├─────────────────────────────────────────────────┤
│  Story title                                    │
│  Date                                           │
│  Excerpt (1-2 sentences)                        │
│  Related trail name                             │
│  [Read more →]                                  │
└─────────────────────────────────────────────────┘

Standard cards:
┌─────────────────────────┐
│                         │
│    [Cover image]        │
│                         │
├─────────────────────────┤
│  Story title            │
│  Date                   │
│  [Read more →]          │
└─────────────────────────┘
```

### Card fields
```text
Required:
  - Cover image (from JournalPost.coverImage)
  - Title (from JournalPost.title)
  - Slug (for linking)
  - Published date

Optional:
  - Excerpt
  - Related trail name
  - Photo count
```

### Desktop structure
```text
┌─────────────────────────────────────────────────┐
│                                                 │
│         Journal / Stories                       │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │         [Featured story — large]          │  │
│  │         Title / Date / Excerpt            │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ Story 1 │  │ Story 2 │  │ Story 3 │         │
│  └─────────┘  └─────────┘  └─────────┘         │
│                                                 │
│         [View Journal →]                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Mobile structure
```text
┌─────────────────────┐
│                     │
│ Journal / Stories   │
│                     │
│  ┌───────────────┐  │
│  │  [Featured]   │  │
│  │   Title       │  │
│  │   Date        │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │   Story 1     │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │   Story 2     │  │
│  └───────────────┘  │
│                     │
│  [View Journal]     │
│                     │
└─────────────────────┘
```

---

## 4.8 Food Section

### Purpose
Introduce Chittagong's food culture through personal storytelling.

### Content hierarchy
```text
[Section heading]

[Featured food story]

[Food stories grid — 2 to 4]

[CTA: Explore Food → /food]
```

### Food/Journal relationship
```text
Food content is stored as JournalPost with:
  - Category/type = "food"
  - Or tagged appropriately

The /food page filters JournalPosts by food category.

No separate Food model for V1.
```

### Card content structure
```text
Same structure as Journal cards:

┌─────────────────────────┐
│                         │
│    [Cover image]        │
│                         │
├─────────────────────────┤
│  Food story title       │
│  Date                   │
│  [Read more →]          │
└─────────────────────────┘
```

### Desktop structure
```text
┌─────────────────────────────────────────────────┐
│                                                 │
│         Chittagong Food                         │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │         [Featured food story]             │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ Food 1  │  │ Food 2  │  │ Food 3  │         │
│  └─────────┘  └─────────┘  └─────────┘         │
│                                                 │
│         [Explore Food →]                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Mobile structure
```text
┌─────────────────────┐
│                     │
│ Chittagong Food     │
│                     │
│  ┌───────────────┐  │
│  │  [Featured]   │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │   Food 1      │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │   Food 2      │  │
│  └───────────────┘  │
│                     │
│  [Explore Food]     │
│                     │
└─────────────────────┘
```

---

## 4.9 Unedited Gallery Section

### Purpose
Visual journal layer. Minimal text, strong photography.

### Content hierarchy
```text
[Section heading]

[Photo grid — minimal captions]

[Location names only — no long descriptions]
```

### Content approach
```text
TBD during implementation

Possible approaches:
  - Grid of images from Journal posts
  - Dedicated gallery collection
  - Location-based photo grouping

No database model yet.
```

### Desktop structure
```text
┌─────────────────────────────────────────────────┐
│                                                 │
│         Unedited                                │
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ [Photo] │  │ [Photo] │  │ [Photo] │         │
│  │ Location│  │ Location│  │ Location│         │
│  └─────────┘  └─────────┘  └─────────┘         │
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ [Photo] │  │ [Photo] │  │ [Photo] │         │
│  │ Location│  │ Location│  │ Location│         │
│  └─────────┘  └─────────┘  └─────────┘         │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Mobile structure
```text
┌─────────────────────┐
│                     │
│     Unedited        │
│                     │
│  ┌───────────────┐  │
│  │   [Photo]     │  │
│  │   Location    │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │   [Photo]     │  │
│  │   Location    │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │   [Photo]     │  │
│  │   Location    │  │
│  └───────────────┘  │
│                     │
└─────────────────────┘
```

---

## 4.10 About / Personal Sign-off Section

### Purpose
Personal closing statement. Human connection.

### Content hierarchy
```text
[Personal statement — 2-3 sentences]

[Name or identifier]

[CTA: Read More → /about]
```

### Desktop structure
```text
┌─────────────────────────────────────────────────┐
│                                                 │
│         ┌───────────────────────┐               │
│         │                       │               │
│         │   Personal statement  │               │
│         │                       │               │
│         │   — Name              │               │
│         │                       │               │
│         │   [Read More →]       │               │
│         └───────────────────────┘               │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Mobile structure
```text
┌─────────────────────┐
│                     │
│  ┌───────────────┐  │
│  │               │  │
│  │  Personal     │  │
│  │  statement    │  │
│  │               │  │
│  │  — Name       │  │
│  │               │  │
│  │  [Read More]  │  │
│  └───────────────┘  │
│                     │
└─────────────────────┘
```

---

## 4.11 Footer Section

### Purpose
Navigation, social links, contact, copyright.

### Content hierarchy
```text
Chittagong Trail

[Personal statement — 1 line]

Explore
├── Trails → /trails
├── Journal → /journal
├── Food → /food
└── About → /about

Follow
├── Facebook → [url]
├── Instagram → [url]
└── YouTube → [url]

Contact
└── Email → [email]

Copyright
```

### Desktop structure
```text
┌─────────────────────────────────────────────────┐
│                                                 │
│  CHITTAGONG TRAIL                               │
│  Personal journal statement                    │
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ Explore │  │ Follow  │  │ Contact │         │
│  │ Trails  │  │ Facebook│  │ Email   │         │
│  │ Journal │  │ Instagram│ │         │         │
│  │ Food    │  │ YouTube │  │         │         │
│  │ About   │  │         │  │         │         │
│  └─────────┘  └─────────┘  └─────────┘         │
│                                                 │
│  Copyright © 2026 Chittagong Trail              │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Mobile structure
```text
┌─────────────────────┐
│                     │
│ CHITTAGONG TRAIL    │
│ Personal statement  │
│                     │
│ Explore             │
│ Trails              │
│ Journal             │
│ Food                │
│ About               │
│                     │
│ Follow              │
│ Facebook            │
│ Instagram           │
│ YouTube             │
│                     │
│ Contact             │
│ Email               │
│                     │
│ Copyright © 2026    │
│                     │
└─────────────────────┘
```

---

# 5. Trails Page — Content Hierarchy

## 5.1 `/trails` — Index

### Purpose
Index of all trail locations.

### Content hierarchy
```text
[Page heading]

[Introduction paragraph]

[Featured trail — large card]

[All trail locations — grid]

[Map / Explore CTA]
```

### Desktop structure
```text
┌─────────────────────────────────────────────────┐
│                                                 │
│  [Navigation]                                   │
│                                                 │
│  Trails                                         │
│  Introduction paragraph                         │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │         [Featured trail — large]          │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ Trail 1 │  │ Trail 2 │  │ Trail 3 │         │
│  └─────────┘  └─────────┘  └─────────┘         │
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ Trail 4 │  │ Trail 5 │  │ Trail 6 │         │
│  └─────────┘  └─────────┘  └─────────┘         │
│                                                 │
│  [Explore on Map →]                             │
│                                                 │
│  [Footer]                                       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Mobile structure
```text
┌─────────────────────┐
│                     │
│ [Navigation]        │
│                     │
│ Trails              │
│ Introduction        │
│                     │
│  ┌───────────────┐  │
│  │  [Featured]   │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │   Trail 1     │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │   Trail 2     │  │
│  └───────────────┘  │
│                     │
│  [Explore on Map]   │
│                     │
│ [Footer]            │
│                     │
└─────────────────────┘
```

---

## 5.2 `/trails/[slug]` — Detail

### Purpose
Detailed information about a specific location.

### Content hierarchy
```text
[Hero — location image]

[Location name]

[Location introduction]

[Story / description]

[Useful information]
├── Best time to visit
├── How to get there
├── What to bring
└── Tips

[Photo gallery]

[Map — location pinned]

[Related Journal stories]

[Related Trails]

[Explore another trail CTA]
```

### Desktop structure
```text
┌─────────────────────────────────────────────────┐
│                                                 │
│  [Navigation]                                   │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │           [Hero image]                    │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Patenga Beach                                  │
│                                                 │
│  Location introduction paragraph                │
│                                                 │
│  Story / description content                    │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Useful Information                       │  │
│  │  • Best time to visit                     │  │
│  │  • How to get there                       │  │
│  │  • What to bring                          │  │
│  │  • Tips                                   │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Photo Gallery                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ [Photo] │  │ [Photo] │  │ [Photo] │         │
│  └─────────┘  └─────────┘  └─────────┘         │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  [Map — location pinned]                  │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Related Journal Stories                        │
│  ┌─────────┐  ┌─────────┐                      │
│  │ Story 1 │  │ Story 2 │                      │
│  └─────────┘  └─────────┘                      │
│                                                 │
│  Related Trails                                 │
│  ┌─────────┐  ┌─────────┐                      │
│  │ Trail 1 │  │ Trail 2 │                      │
│  └─────────┘  └─────────┘                      │
│                                                 │
│  [Explore Another Trail →]                      │
│                                                 │
│  [Footer]                                       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Mobile structure
```text
┌─────────────────────┐
│                     │
│ [Navigation]        │
│                     │
│  ┌───────────────┐  │
│  │ [Hero image]  │  │
│  └───────────────┘  │
│                     │
│ Patenga Beach       │
│                     │
│ Location intro      │
│                     │
│ Story content       │
│                     │
│ ┌───────────────┐   │
│ │ Useful Info   │   │
│ │ • Best time   │   │
│ │ • How to get  │   │
│ │ • What to bring│  │
│ │ • Tips        │   │
│ └───────────────┘   │
│                     │
│ Photo Gallery       │
│  ┌───────────────┐  │
│  │   [Photo]     │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │   [Photo]     │  │
│  └───────────────┘  │
│                     │
│ ┌───────────────┐   │
│ │ [Map pinned]  │   │
│ └───────────────┘   │
│                     │
│ Related Stories     │
│  ┌───────────────┐  │
│  │   Story 1     │  │
│  └───────────────┘  │
│                     │
│ Related Trails      │
│  ┌───────────────┐  │
│  │   Trail 1     │  │
│  └───────────────┘  │
│                     │
│ [Another Trail]     │
│                     │
│ [Footer]            │
│                     │
└─────────────────────┘
```

---

# 6. Journal Page — Content Hierarchy

## 6.1 `/journal` — Index

### Purpose
Index of all journal stories.

### Content hierarchy
```text
[Page heading]

[Introduction paragraph]

[Featured story — large card]

[Latest stories — grid]

[Archive / Pagination]
```

### Desktop structure
```text
┌─────────────────────────────────────────────────┐
│                                                 │
│  [Navigation]                                   │
│                                                 │
│  Journal                                        │
│  Introduction paragraph                         │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │         [Featured story — large]          │  │
│  │         Title / Date / Excerpt            │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ Story 1 │  │ Story 2 │  │ Story 3 │         │
│  └─────────┘  └─────────┘  └─────────┘         │
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ Story 4 │  │ Story 5 │  │ Story 6 │         │
│  └─────────┘  └─────────┘  └─────────┘         │
│                                                 │
│  [Load More / Pagination]                       │
│                                                 │
│  [Footer]                                       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Mobile structure
```text
┌─────────────────────┐
│                     │
│ [Navigation]        │
│                     │
│ Journal             │
│ Introduction        │
│                     │
│  ┌───────────────┐  │
│  │  [Featured]   │  │
│  │   Title       │  │
│  │   Date        │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │   Story 1     │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │   Story 2     │  │
│  └───────────────┘  │
│                     │
│  [Load More]        │
│                     │
│ [Footer]            │
│                     │
└─────────────────────┘
```

---

## 6.2 `/journal/[slug]` — Detail

### Purpose
Individual journal story.

### Content hierarchy
```text
[Cover image]

[Title]

[Date]

[Story content — rich text]

[Inline images]

[Related trail]

[Related stories]

[Previous / Next story]
```

### Desktop structure
```text
┌─────────────────────────────────────────────────┐
│                                                 │
│  [Navigation]                                   │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │           [Cover image]                   │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Winter Evening at Patenga                      │
│  December 15, 2025                              │
│                                                 │
│  Story content paragraph 1                      │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │           [Inline image]                  │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Story content paragraph 2                      │
│                                                 │
│  Related Trail: Patenga Beach →                 │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Related Stories                                │
│  ┌─────────┐  ┌─────────┐                      │
│  │ Story 1 │  │ Story 2 │                      │
│  └─────────┘  └─────────┘                      │
│                                                 │
│  ← Previous Story    Next Story →               │
│                                                 │
│  [Footer]                                       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Mobile structure
```text
┌─────────────────────┐
│                     │
│ [Navigation]        │
│                     │
│  ┌───────────────┐  │
│  │ [Cover image] │  │
│  └───────────────┘  │
│                     │
│ Winter Evening      │
│ at Patenga          │
│ December 15, 2025   │
│                     │
│ Story content       │
│ paragraph 1         │
│                     │
│  ┌───────────────┐  │
│  │ [Inline image]│  │
│  └───────────────┘  │
│                     │
│ Story content       │
│ paragraph 2         │
│                     │
│ Related Trail:      │
│ Patenga Beach →     │
│                     │
│ ─────────────────   │
│                     │
│ Related Stories     │
│  ┌───────────────┐  │
│  │   Story 1     │  │
│  └───────────────┘  │
│                     │
│ ← Previous  Next → │
│                     │
│ [Footer]            │
│                     │
└─────────────────────┘
```

---

# 7. Food Page — Content Hierarchy

## 7.1 `/food` — Index

### Purpose
Index of food-related stories (filtered from Journal).

### Content hierarchy
```text
[Page heading]

[Introduction paragraph]

[Featured food story — large card]

[Food stories — grid]

[More stories CTA → /journal]
```

### Data source
```text
All content comes from JournalPost where:
  - category = "food"
  - OR tagged as food

No separate Food model.
```

### Desktop structure
```text
┌─────────────────────────────────────────────────┐
│                                                 │
│  [Navigation]                                   │
│                                                 │
│  Chittagong Food                                │
│  Introduction paragraph                         │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │         [Featured food story]             │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ Food 1  │  │ Food 2  │  │ Food 3  │         │
│  └─────────┘  └─────────┘  └─────────┘         │
│                                                 │
│  [More Journal Stories →]                       │
│                                                 │
│  [Footer]                                       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Mobile structure
```text
┌─────────────────────┐
│                     │
│ [Navigation]        │
│                     │
│ Chittagong Food     │
│ Introduction        │
│                     │
│  ┌───────────────┐  │
│  │  [Featured]   │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │   Food 1      │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │   Food 2      │  │
│  └───────────────┘  │
│                     │
│ [More Stories]      │
│                     │
│ [Footer]            │
│                     │
└─────────────────────┘
```

---

## 7.2 `/food/[slug]` — Detail

### Purpose
Individual food story (uses Journal detail template).

### Content hierarchy
```text
Same as Journal detail:
  - Cover image
  - Title
  - Date
  - Story content
  - Inline images
  - Related trail
  - Related food stories
  - Previous / Next
```

### Implementation note
```text
/food/[slug] can reuse the Journal detail component
with food-specific styling/CTA adjustments.
```

---

# 8. About Page — Content Hierarchy

## 8.1 `/about`

### Purpose
Personal about page. Why the journal exists.

### Content hierarchy
```text
[Page heading]

[Why this journal exists]

[Person behind the trail]

[What gets documented]

[Philosophy / approach]

[Social links]

[Contact]
```

### Desktop structure
```text
┌─────────────────────────────────────────────────┐
│                                                 │
│  [Navigation]                                   │
│                                                 │
│  About Chittagong Trail                         │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  [Photo of founder — optional]            │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Why this journal exists                        │
│  Paragraph content                              │
│                                                 │
│  Person behind the trail                        │
│  Paragraph content                              │
│                                                 │
│  What gets documented                           │
│  Paragraph content                              │
│                                                 │
│  Philosophy / approach                          │
│  Paragraph content                              │
│                                                 │
│  Follow                                         │
│  Facebook / Instagram / YouTube                 │
│                                                 │
│  Contact                                        │
│  Email                                          │
│                                                 │
│  [Footer]                                       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Mobile structure
```text
┌─────────────────────┐
│                     │
│ [Navigation]        │
│                     │
│ About Chittagong    │
│ Trail               │
│                     │
│  ┌───────────────┐  │
│  │ [Photo — opt] │  │
│  └───────────────┘  │
│                     │
│ Why this journal    │
│ exists              │
│ Paragraph           │
│                     │
│ Person behind       │
│ the trail           │
│ Paragraph           │
│                     │
│ What gets           │
│ documented          │
│ Paragraph           │
│                     │
│ Philosophy          │
│ Paragraph           │
│                     │
│ Follow              │
│ Facebook            │
│ Instagram           │
│ YouTube             │
│                     │
│ Contact             │
│ Email               │
│                     │
│ [Footer]            │
│                     │
└─────────────────────┘
```

---

# 9. 404 Page — Content Hierarchy

## 9.1 `/404`

### Purpose
Branded error page.

### Content hierarchy
```text
404

This trail doesn't seem to exist.

[Back to Chittagong Trail → /]
```

### Desktop structure
```text
┌─────────────────────────────────────────────────┐
│                                                 │
│                                                 │
│                                                 │
│              404                                │
│                                                 │
│      This trail doesn't seem to exist.          │
│                                                 │
│         [Back to Chittagong Trail →]            │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Mobile structure
```text
┌─────────────────────┐
│                     │
│                     │
│                     │
│       404           │
│                     │
│ This trail doesn't  │
│ seem to exist.      │
│                     │
│ [Back to Home →]    │
│                     │
│                     │
│                     │
│                     │
└─────────────────────┘
```

---

# 10. Admin Pages — Content Hierarchy

## 10.1 `/admin` — Dashboard

### Content hierarchy
```text
[Admin heading]

[Quick stats]
├── Total journal posts
├── Total trails
└── Recent activity

[Quick actions]
├── New Journal Post
└── New Trail
```

---

## 10.2 `/admin/journal` — Journal List

### Content hierarchy
```text
[Page heading]

[Create new button]

[Journal posts table]
├── Title
├── Category
├── Status
├── Date
└── Actions (edit/delete)
```

---

## 10.3 `/admin/journal/new` — Create Journal

### Content hierarchy
```text
[Page heading]

[Form fields]
├── Title
├── Slug (auto-generated)
├── Content (rich text)
├── Cover image upload
├── Cover image alt text
├── Category (food, story, etc.)
├── Related trail (dropdown)
├── Meta title
├── Meta description
├── OG image
├── Published date
└── Publish button
```

---

## 10.4 `/admin/journal/[id]/edit` — Edit Journal

### Content hierarchy
```text
Same as create, pre-filled with existing data.
```

---

## 10.5 `/admin/trails` — Trails List

### Content hierarchy
```text
[Page heading]

[Create new button]

[Trails table]
├── Name
├── Journal count
├── Date
└── Actions (edit/delete)
```

---

## 10.6 `/admin/trails/new` — Create Trail

### Content hierarchy
```text
[Page heading]

[Form fields]
├── Name
├── Slug (auto-generated)
├── Description (rich text)
├── Latitude
├── Longitude
├── Photos (multi-upload)
├── Photo alt text
├── Meta title
├── Meta description
├── OG image
└── Save button
```

---

## 10.7 `/admin/trails/[id]/edit` — Edit Trail

### Content hierarchy
```text
Same as create, pre-filled with existing data.
```

---

# 11. Internal Linking Strategy

## 11.1 Homepage links

```text
Hero → (scroll down)
Introduction → (scroll down)
Explore Trails → /trails, /trails/[slug]
Seasonal → (optional: related content)
Map → /trails/[slug]
Journal → /journal, /journal/[slug]
Food → /food, /food/[slug]
Gallery → (optional: trail or journal)
About → /about
```

---

## 11.2 Trail page links

```text
Trail → /trails/[slug]
Related Journal → /journal/[slug]
Related Trails → /trails/[slug]
Map pin → /trails/[slug]
```

---

## 11.3 Journal page links

```text
Journal → /journal/[slug]
Related Trail → /trails/[slug]
Related Stories → /journal/[slug]
Previous / Next → /journal/[slug]
```

---

## 11.4 Food page links

```text
Food → /food/[slug] (→ /journal/[slug])
Related Trail → /trails/[slug]
More Food → /food
More Journal → /journal
```

---

## 11.5 Cross-linking rules

```text
Every Journal post should link to its related Trail.
Every Trail should link to its related Journal posts.
Food stories link to their related Trail.
Navigation provides access to all sections.
Footer provides secondary navigation.
```

---

# 12. Card Component Specifications

## 12.1 Trail Card

```text
Fields:
  - coverImage (required)
  - name (required)
  - slug (required)
  - excerpt (optional)
  - photoCount (optional)

Layout:
  - Image (16:9 or 4:3 ratio)
  - Content below image
  - Name as heading
  - Excerpt as paragraph
  - Link indicator or arrow

Variants:
  - Large (featured)
  - Standard (grid)
  - Small (sidebar)
```

---

## 12.2 Journal Card

```text
Fields:
  - coverImage (required)
  - title (required)
  - slug (required)
  - publishedDate (required)
  - excerpt (optional)
  - relatedTrailName (optional)

Layout:
  - Image (16:9 or 4:3 ratio)
  - Content below image
  - Title as heading
  - Date as metadata
  - Excerpt as paragraph
  - Trail name as tag/link

Variants:
  - Large (featured)
  - Standard (grid)
  - Small (sidebar)
```

---

## 12.3 Food Card

```text
Same as Journal Card.

Food is a category of JournalPost.
No separate card component needed.
```

---

# 13. CTA Hierarchy

## 12.1 Primary CTAs

```text
Homepage:
  - View All Trails → /trails
  - View Journal → /journal
  - Explore Food → /food
  - Read More → /about

Trails:
  - Explore on Map → (scroll to map)

Trail Detail:
  - Explore Another Trail → /trails/[random]

Journal:
  - Load More / Pagination

Journal Detail:
  - Read related trail → /trails/[slug]
  - Previous / Next story

Food:
  - More Journal Stories → /journal
```

---

## 12.2 CTA styling approach

```text
Primary: Filled button or prominent text link
Secondary: Outlined button or text link
Tertiary: Inline text link

Consistent placement:
  - After section content
  - At section bottom
  - In card components
```

---

# 14. Mobile / Desktop Breakpoints

## 14.1 Breakpoint strategy

```text
Mobile: 0 - 767px
Tablet: 768px - 1023px
Desktop: 1024px+

Mobile-first approach:
  - Design mobile first
  - Enhance for tablet
  - Enhance for desktop
```

---

## 14.2 Layout changes by breakpoint

```text
Mobile:
  - Single column layouts
  - Stacked cards
  - Full-width images
  - Hamburger navigation
  - Simplified map

Tablet:
  - 2-column grids
  - Side-by-side content where appropriate
  - Expanded navigation

Desktop:
  - Multi-column grids (3-4 columns)
  - Full navigation
  - Side-by-side layouts
  - Enhanced map interaction
```

---

# 15. Image Requirements

## 15.1 Image types

```text
Hero images:
  - Full-width, high-resolution
  - Landscape orientation
  - 16:9 or wider ratio

Card images:
  - Consistent aspect ratio
  - 16:9 or 4:3 ratio
  - Optimized for web

Gallery images:
  - Various ratios acceptable
  - High resolution
  - Minimal cropping required

OG images:
  - 1200x630px (standard)
  - Branded overlay optional
```

---

## 15.2 Image handling

```text
Storage:
  - /public/images/ for static images
  - Database URLs for uploaded content

Optimization:
  - Next.js Image component
  - Responsive sizing
  - Lazy loading
  - WebP/AVIF format support

Alt text:
  - Required for all images
  - Stored in database
  - Descriptive, not keyword-stuffed
```

---

# 16. Content Workflow

## 16.1 Content creation flow

```text
Admin creates content:
  1. Login to /admin
  2. Select content type (Journal/Trail)
  3. Fill in form fields
  4. Upload images
  5. Set metadata
  6. Preview
  7. Publish

Content appears:
  - Journal → /journal, homepage
  - Trail → /trails, homepage, map
  - Food → /food (filtered from Journal)
```

---

## 16.2 Content relationships

```text
When creating Journal post:
  - Can link to existing Trail
  - Trail automatically shows related Journal

When creating Trail:
  - No initial Journal links
  - Journal posts link to Trail after creation

When editing:
  - Updating Trail updates all related Journal pages
  - Updating Journal only affects that post
```

---

# 17. SEO Content Structure

## 17.1 Per-page SEO

```text
Every page needs:
  - Dynamic meta title
  - Dynamic meta description
  - OG image
  - Canonical URL
  - Proper heading hierarchy (H1, H2, H3)
  - Alt text for images
  - Internal links

Structured data:
  - Homepage: WebSite, Organization
  - Trails: TouristAttraction, BreadcrumbList
  - Journal: Article, BreadcrumbList
  - Food: Article, BreadcrumbList
  - About: Person, WebPage
```

---

## 17.2 URL-based SEO

```text
Clean URLs:
  - /trails/patenga-beach
  - /journal/winter-evening-at-patenga
  - /food/mezbani

No query parameters for content.
No dynamic route parameters visible to users.
```

---

# 18. Open Questions

## 18.1 Content questions

```text
1. How many trails will be in V1?
   - Affects grid layout decisions

2. How many journal posts in V1?
   - Affects pagination approach

3. Will food posts have subcategories?
   - Mezbani, Kala Bhuna, Street food, etc.?

4. Will gallery have its own page later?
   - Affects current gallery section design

5. Will map become a standalone page?
   - Affects current map section design
```

---

## 18.2 Technical questions

```text
1. Rich text editor for admin?
   - Tiptap, Slate, or simple textarea?

2. Image upload approach?
   - Direct to server, cloud storage, or S3?

3. Map provider?
   - Leaflet (free), Mapbox, Google Maps?

4. Pagination style?
   - Load more, infinite scroll, or numbered?

5. Search functionality in V1?
   - Yes, no, or basic?
```

---

# 19. Next Phase

Once this content architecture is approved, the next phase is:

## PHASE 4 — Visual Identity / Design System

The next phase should define:

* Color palette
* Typography system
* Spacing system
* Component styling
* Button styles
* Card styles
* Navigation design
* Footer design
* Image treatment
* Animation principles

Do NOT begin visual design until this content architecture has been approved.

---

# 20. Approval Gate

This document is not considered final until the project owner approves it.

After approval:

```text
CONTENT ARCHITECTURE
        ↓
    APPROVED
        ↓
VISUAL DESIGN SYSTEM
        ↓
    APPROVED
        ↓
    WIREFRAMES
        ↓
    APPROVED
        ↓
    IMPLEMENTATION
```

Do not skip the approval gates.

---

# 21. Final Principle

Content architecture should serve the storytelling, not constrain it.

The structure should feel:

* Natural
* Exploratory
* Connected
* Personal
* Journal-like

Not:

* Corporate
* Rigid
* Template-driven
* Generic

**Content first.
Structure second.
Design third.
Implementation after approval.**
