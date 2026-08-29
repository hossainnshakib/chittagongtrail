# A8 — HOMEPAGE REBUILD SPECIFICATION

**Document:** `A8-HOMEPAGE-REBUILD.md`
**Phase:** A8 — Homepage Rebuild Specification & Curation
**Status:** COMPLETE
**Date:** 2026-08-29
**Project:** Chittagong Trail

---

## Table of Contents

1. [Current Homepage Audit](#1-current-homepage-audit)
2. [Reference Site Analysis](#2-reference-site-analysis)
3. [New Homepage Narrative](#3-new-homepage-narrative)
4. [New Homepage Architecture](#4-new-homepage-architecture)
5. [Chittagong-First Content Model](#5-chittagong-first-content-model)
6. [Founder Presence](#6-founder-presence)
7. [Hero Rebuild](#7-hero-rebuild)
8. [Visual Storytelling](#8-visual-storytelling)
9. [Trails Experience](#9-trails-experience)
10. [Map Experience](#10-map-experience)
11. [Journal / Stories](#11-journal--stories)
12. [Food](#12-food)
13. [People / Culture / History](#13-people--culture--history)
14. [Seasonal / Mood Story](#14-seasonal--mood-story)
15. [Gallery](#15-gallery)
16. [About / Closing](#16-about--closing)
17. [Footer](#17-footer)
18. [Site Settings Integration](#18-site-settings-integration)
19. [Database Content Mapping](#19-database-content-mapping)
20. [Media Requirements](#20-media-requirements)
21. [Responsive Architecture](#21-responsive-architecture)
22. [Accessibility](#22-accessibility)
23. [Performance](#23-performance)
24. [SEO Preservation](#24-seo-preservation)
25. [Component Architecture](#25-component-architecture)
26. [Animation Architecture](#26-animation-architecture)
27. [Remove / Keep / Rebuild Matrix](#27-remove--keep--rebuild-matrix)
28. [Homepage User Journey](#28-homepage-user-journey)
29. [Content Priority](#29-content-priority)
30. [Owner Decisions Required](#30-owner-decisions-required)

---

## 1. Current Homepage Audit

### 1.1 Current Sections (Sequential Order)

| # | Component | Type | Data Source | CMS-Driven |
|---|-----------|------|-------------|------------|
| 1 | Hero | Client | SiteSettings (heroTitle, heroSubtitle, heroMedia) | Yes |
| 2 | Introduction | Server | SiteSettings (introductionHeading, introductionContent) | Yes |
| 3 | ExploreTrails | Server | TrailLocation (getTrails) | Partial |
| 4 | SeasonalMood | Server | SiteSettings (seasonal fields) | Yes |
| 5 | InteractiveMap | Server | TrailLocation (getTrailsWithCoordinates) | No |
| 6 | Journal | Server | JournalPost (getLatestJournalPosts) | No |
| 7 | Food | Server | JournalPost (getLatestFoodPosts) | No |
| 8 | UneditedGallery | Server | Hardcoded placeholder data | No |
| 9 | AboutSignoff | Server | SiteSettings (aboutHeading, aboutContent) | Yes |

### 1.2 Current Component Structure

```
app/page.tsx (64 lines, async server component)
├── PublicLayout (Header + Footer wrapper)
├── Hero (Client, 106 lines)
│   ├── Full-screen background image (CMS or logo fallback)
│   ├── Logo mark (always displayed)
│   ├── H1 title (CMS or siteName fallback)
│   ├── Subtitle (CMS or hardcoded tagline fallback)
│   └── Scroll indicator arrow (CSS animation)
├── SectionWrapper (Client, wraps all sections below Hero)
│   └── SectionReveal (GSAP scroll-triggered fade-in)
├── Introduction (Server, 50 lines)
│   ├── SectionHeading
│   └── Rich text content (dangerouslySetInnerHTML)
├── ExploreTrails (Server, 79 lines)
│   ├── SectionHeading
│   ├── 3-column grid of TrailCards (up to 6)
│   └── "View All Trails" Button
├── SeasonalMood (Server, 82 lines)
│   ├── 2-column: Image + Content
│   ├── Eyebrow text
│   ├── Title
│   └── Rich text content
├── InteractiveMap (Server, 21 lines)
│   ├── SectionHeading (dark section)
│   └── TrailMap (lazy-loaded Leaflet)
├── Journal (Server, 96 lines)
│   ├── SectionHeading
│   ├── 3-column grid of journal cards (3 posts)
│   └── "View All Journal Posts" Button
├── Food (Server, 83 lines)
│   ├── SectionHeading
│   ├── 3-column grid of food cards (3 posts)
│   └── "Explore Food" Button
├── UneditedGallery (Server, 44 lines)
│   ├── SectionHeading
│   └── 2/3-column grid of placeholder items (no images)
└── AboutSignoff (Server, 41 lines)
    ├── Blockquote heading
    ├── Content paragraph
    └── "Read More" Button
```

### 1.3 Current Data Sources

| Source | Model | Fetcher | Usage |
|--------|-------|---------|-------|
| Hero | SiteSettings | getPublicSiteSettings() | heroTitle, heroSubtitle, heroMedia |
| Introduction | SiteSettings | getPublicSiteSettings() | introductionHeading, introductionContent |
| Trails | TrailLocation | getTrails() | All published trails (up to 6 displayed) |
| Seasonal | SiteSettings | getPublicSiteSettings() | seasonalEyebrow, seasonalTitle, seasonalContent, seasonalMedia |
| Map | TrailLocation | getTrailsWithCoordinates() | Trails with lat/lng |
| Journal | JournalPost | getLatestJournalPosts(3) | Published STORY posts |
| Food | JournalPost | getLatestFoodPosts(3) | Published FOOD posts |
| Gallery | None | Hardcoded | Placeholder data |
| About | SiteSettings | getPublicSiteSettings() | aboutHeading, aboutContent |

### 1.4 Current Site Settings Usage

**Fields actively used on homepage:**
- siteName → Hero fallback title
- heroTitle → Hero H1
- heroSubtitle → Hero tagline
- heroMediaId → Hero background image
- introductionHeading → Introduction section heading
- introductionContent → Introduction body HTML
- seasonalEyebrow → Seasonal section eyebrow
- seasonalTitle → Seasonal section heading
- seasonalContent → Seasonal section body HTML
- seasonalMediaId → Seasonal section image
- aboutHeading → About sign-off blockquote
- aboutContent → About sign-off body HTML

**Fields NOT used on homepage:**
- contactEmail → Only on About page
- socialFacebook, socialInstagram, socialYouTube → Only in Footer
- footerText → Only in Footer

### 1.5 Current Weaknesses

1. **Generic section rhythm:** Every section uses the same pattern — SectionHeading + Container-constrained content. No visual variety.
2. **Card grid repetition:** Trails, Journal, and Food all use identical 3-column card grids. Visually monotonous.
3. **No visual hierarchy between sections:** All sections have equal visual weight. Nothing feels primary or secondary.
4. **Gallery is non-functional:** Hardcoded placeholder data with no real images.
5. **Map feels isolated:** Dark section with a map, disconnected from the trail storytelling.
6. **Seasonal section is underused:** CMS-driven but relies on owner copy that may not exist.
7. **Introduction is text-heavy:** Centered paragraph with no visual relief.
8. **Hero is conventional:** Logo + title + subtitle + scroll arrow. Not distinctive.
9. **No full-bleed imagery:** Everything is container-constrained. No cinematic moments.
10. **No visual pauses:** Sections flow into each other without breathing room.
11. **No editorial pacing:** Content is presented in equal measure, no featured/highlighted hierarchy.
12. **Footer is minimal:** Basic footer without brand personality.
13. **Mobile experience is unoptimized:** Simply stacked columns, no mobile-specific compositions.
14. **Founder voice is generic:** Default copy is template-like, not distinctive.

### 1.6 Reusable Components

| Component | Reusable? | Notes |
|-----------|-----------|-------|
| Container | Yes | Max-width wrapper, keep |
| SectionHeading | Yes | H2 + subtitle, keep but extend |
| Button | Yes | Keep all variants |
| TrailCard | Partially | Keep for trails pages, redesign for homepage |
| JournalCard | Partially | Keep for journal pages, redesign for homepage |
| TrailMap / TrailMapInner | Yes | Keep for map integration |
| SectionReveal | Yes | Keep as animation primitive |
| PublicLayout | Yes | Keep for page wrapper |

### 1.7 Components That Should Be Replaced

| Component | Replacement |
|-----------|-------------|
| Hero.tsx | Complete rebuild with cinematic approach |
| ExploreTrails.tsx | Rebuild with editorial trail presentation |
| SeasonalMood.tsx | Redesign as editorial/mood moment or remove |
| UneditedGallery.tsx | Rebuild with real gallery data from HomepageGallery model |
| AboutSignoff.tsx | Redesign as concise closing experience |

### 1.8 Components That Should Be Removed

| Component | Reason |
|-----------|--------|
| (None fully removed) | All sections are reimagined, not eliminated |

---

## 2. Reference Site Analysis

### 2.1 What bangladeshtrail.com Does Well

**Narrative Progression:**
- Opens with a bold, declarative statement: "Six Seasons. 700 Rivers. One Delta."
- Moves from macro (country overview) to micro (specific experiences)
- Each section builds on the previous, creating a journey

**Section Rhythm:**
- Full-screen hero → editorial statement → destination grid → seasons → river map → experiences → food → journeys → gallery → sign-off
- Alternates between dense content and visual breathing room
- Dark sections break the cream rhythm

**Image Scale:**
- Full-bleed hero images
- Large destination cards with hover-to-color effect
- Full-width atmospheric images between sections
- Gallery uses varied aspect ratios

**Typography Hierarchy:**
- Large editorial serif headings with italic emphasis
- Clean sans-serif body text
- Eyebrow labels for section context
- Stats/numbers as visual anchors

**Full-Screen Moments:**
- Hero is full viewport
- River map section is immersive
- Atmospheric quote/image sections break pacing

**Destination Storytelling:**
- Each destination card has: image, name, one-line description, CTA
- Hover reveals color (from desaturated to full)
- Click leads to detailed guide

**Transition Strategy:**
- Quote/stat sections between major content blocks
- Full-width images as visual separators
- Dark sections contrast cream sections

**Map Usage:**
- Animated river system visualization
- Interactive with hover states
- Stats overlaid on the map
- Not just a locator — tells a geographic story

**Food Presentation:**
- Horizontal scroll/gallery of food items
- Each item: image, name, location, description
- Editorial, not directory-like

**Gallery:**
- Mixed aspect ratios in a grid
- Location labels, no heavy captions
- "Unedited" framing adds authenticity

**CTA Strategy:**
- Every section has a clear next action
- CTAs are contextual, not generic

**Ending/Closure:**
- Invitational closing: "Come while it is still yours to find"
- Links to practical information
- Brand sign-off with contact

### 2.2 What Should NOT Be Copied

- Exact layouts (2-column, grid structures)
- Exact color schemes (Bangladesh Tourism Board branding)
- Exact section order
- Exact card designs
- Exact animation patterns
- Exact text patterns
- Government/institutional tone
- Country-wide scope (Chittagong Trail is Chittagong-specific)
- Visa/practical information sections
- Multi-destination grid approach

### 2.3 Principles to Reinterpret for Chittagong Trail

| Principle | Bangladesh Trail | Chittagong Trail Reinterpretation |
|-----------|------------------|-----------------------------------|
| Bold opening statement | Country-level stats | Chittagong-specific identity statement |
| Destination grid | 12 destinations across Bangladesh | Curated Chittagong places with editorial depth |
| Seasonal storytelling | 6 official seasons | Chittagong-specific seasonal moods |
| Map as story | River system animation | Chittagong geography (hills, coast, river, city) |
| Food section | 10 dishes across Bangladesh | Chittagong food culture (mezbani, kala bhuna, shutki) |
| Editorial voice | Institutional but warm | Personal curator voice |
| Full-bleed imagery | Tourism-grade photography | Authentic, founder-owned photography |
| Closing invitation | Visa-focused | Exploration-focused |

---

## 3. New Homepage Narrative

### 3.1 Narrative Arc

The homepage tells a single story: **Chittagong is a place of extraordinary diversity, and there is always more to discover.**

The narrative follows this emotional arc:

```
ARRIVAL → ORIENTATION → CURIOSITY → DISCOVERY → DEPTH → CULTURE → INVITATION
```

### 3.2 Narrative Questions the Homepage Answers

| Question | Section | Answer |
|----------|---------|--------|
| What is Chittagong Trail? | Hero | A curated exploration of Chittagong |
| Why Chittagong? | Opening Statement | The place itself demands attention |
| What kind of places exist? | Trail Discovery | Hills, coast, river, city, countryside |
| What stories are here? | Journal / Stories | Places have histories and voices |
| What does Chittagong taste like? | Food | Food is culture, geography, identity |
| Where are these places? | Map | Chittagong's geography is discoverable |
| What's the mood? | Editorial Moments | Chittagong changes with seasons and light |
| Why should I explore? | Closing | This place rewards those who look closely |

### 3.3 Chittagong as Subject, Founder as Curator

**Language patterns to use:**
- "Between the hills and the sea..."
- "The trails of Chittagong lead through..."
- "In the old quarters of the city..."
- "Along the Karnaphuli..."

**Language patterns to avoid:**
- "I visited..."
- "My journey..."
- "I discovered..."
- "When I went to..."
- "This is my favorite..."

**The founder's voice appears as:**
- Editorial commentary (not diary entries)
- Curatorial choices (what is featured and why)
- Perspective on why these places matter
- Occasional first-person reflection (sparingly)

---

## 4. New Homepage Architecture

### 4.1 Proposed Section Order

| # | Section Name | Purpose | Essential? |
|---|-------------|---------|------------|
| 1 | **Cinematic Hero** | Immediately communicate Chittagong | Yes |
| 2 | **Chittagong Statement** | Establish the place as subject | Yes |
| 3 | **Trail Discovery** | Show the diversity of places | Yes |
| 4 | **Featured Trail Moment** | Deep editorial focus on one trail | Yes |
| 5 | **Chittagong Geography** | Map as storytelling layer | Yes |
| 6 | **Stories from Chittagong** | Journal as place-based storytelling | Yes |
| 7 | **Taste of Chittagong** | Food as culture and identity | Yes |
| 8 | **Visual Interlude** | Breathing room, atmospheric imagery | Optional |
| 9 | **Closing / Invitation** | Invite continued exploration | Yes |
| 10 | **Footer** | Navigation, social, brand | Yes |

### 4.2 Section Rationale

**Why these sections and not the current 9:**

1. **Cinematic Hero replaces conventional Hero** — More immersive, less template-like
2. **Chittagong Statement replaces Introduction** — Shorter, editorial, not a welcome paragraph
3. **Trail Discovery replaces ExploreTrails** — Editorial presentation, not card grid
4. **Featured Trail Moment is NEW** — Gives one trail depth, creates editorial hierarchy
5. **Chittagong Geography replaces InteractiveMap** — Map tells a geographic story, not just shows pins
6. **Stories replaces Journal** — Reframed as place-based stories, not a blog feed
7. **Taste replaces Food** — Cultural identity, not just food posts
8. **Visual Interlude replaces Gallery** — Curated atmospheric moments, not placeholder grid
9. **Closing replaces AboutSignoff** — Tighter, more invitational
10. **Seasonal/Mood section is REMOVED** — Merged into editorial interludes and mood throughout

**Why Seasonal/Mood is removed as a standalone section:**
- The current CMS-driven seasonal section requires owner copy that may not exist
- Seasonal mood is better communicated through imagery and editorial moments throughout
- A dedicated section feels forced if the content is thin
- The monsoon/weather atmosphere can be woven into the hero and editorial moments

---

## 5. Chittagong-First Content Model

### 5.1 Thematic Organization

Chittagong Trail's content should be organized around these themes, drawn from the actual geography and culture of Chittagong:

| Theme | Description | Content Sources |
|-------|-------------|-----------------|
| **Hills** | Hill tracts, Batali Hill, panoramic viewpoints | TrailLocation (terrainType = HILLS) |
| **Coast** | Patenga, fishing villages, Bay of Bengal | TrailLocation (terrainType = COAST) |
| **River** | Karnaphuli, river life, boat culture | TrailLocation (terrainType = RIVER) |
| **City** | Old Chittagong, markets, urban life | TrailLocation (terrainType = CITY) |
| **Countryside** | Rural trails, villages, landscapes | TrailLocation (terrainType = RURAL) |
| **Food** | Mezbani, kala bhuna, shutki, street food | JournalPost (type = FOOD) |
| **Stories** | Place histories, cultural observations | JournalPost (type = STORY) |

### 5.2 Theme Distribution Across Sections

- **Hero:** Chittagong as a whole (not one theme)
- **Trail Discovery:** Hills, Coast, River, City, Countryside represented
- **Featured Trail:** One specific theme in depth
- **Geography Map:** All terrain types visible
- **Stories:** Any theme, place-based
- **Food:** Dedicated food theme
- **Visual Interlude:** Any theme, atmospheric

### 5.3 Not-forced Categories

The categories above are derived from the actual `TerrainType` enum in the Prisma schema. They are not artificial — they reflect Chittagong's real geographic diversity. The homepage should make this diversity visually apparent without being didactic about it.

---

## 6. Founder Presence

### 6.1 Where the Founder Appears

| Location | How | Intensity |
|----------|-----|-----------|
| Hero | Not visible | None |
| Chittagong Statement | Curatorial voice in text | Low |
| Trail Discovery | Curation choices (what is featured) | Low |
| Featured Trail | Editorial commentary | Medium |
| Stories | Authorship implied through editorial voice | Low |
| Food | Cultural knowledge demonstrated | Low |
| Closing | Personal sign-off, why this exists | Medium |

### 6.2 Founder Voice Guidelines

**The founder is the explorer who opens the door for others.**

The homepage should use language like:
- "Chittagong's hills rise abruptly from the plain..."
- "The old quarters of the city hold their stories close..."
- "Along the coast, fishing communities have lived for generations..."
- "This platform exists to document what makes Chittagong extraordinary..."

Instead of:
- "I climbed Batali Hill and saw the city below..."
- "When I visited the old quarters..."
- "My favorite food in Chittagong is..."
- "I started this project because..."

**Occasional first-person is acceptable in:**
- Featured Trail editorial commentary
- Closing sign-off
- But never more than 2-3 instances on the entire homepage

---

## 7. Hero Rebuild

### 7.1 Hero Strategy

The hero must immediately communicate **Chittagong** — not "this is a travel website."

**Approach:** Full-viewport cinematic hero with either:
- **Option A: Video background** — Ambient footage of Chittagong (hills, river, city)
- **Option B: High-quality still image** — A single powerful Chittagong landscape

**Recommendation:** Start with Option B (image), design for Option A (video) as future enhancement.

### 7.2 Hero Behavior

| Element | Desktop | Mobile |
|---------|---------|--------|
| Background | Full-viewport image, slow Ken Burns drift | Full-viewport image, crop to vertical |
| Logo | Wordmark (dark background version), top-center or integrated | Smaller wordmark |
| Headline | Large editorial text, centered | Smaller but still dominant |
| Subtitle | One line, editorial | One line, shorter |
| Scroll indicator | Subtle animated chevron | Subtle animated chevron |
| Navigation | Transparent header, becomes solid on scroll | Hamburger, transparent initially |
| Overlay | Dark gradient for text readability | Same gradient, stronger |

### 7.3 Hero Content

- **No logo mark in hero** — Use wordmark only, or no logo if headline is strong enough
- **Headline:** Editorial, Chittagong-specific
- **Subtitle:** One line establishing the platform's purpose
- **No CTA button in hero** — The scroll indicator is the only prompt

### 7.4 Conceptual Headline Directions

1. "Chittagong, explored."
2. "Between the hills and the sea."
3. "Every trail leads somewhere in Chittagong."
4. "A city of hills, river, and stories."
5. "Where the land meets the Bay."

These are directions, not final copy.

### 7.5 Hero Loading Behavior

- Use `priority` loading for hero image
- Show a solid dark background (`--dark-bg`) while image loads
- Logo/wordmark appears immediately
- Text animates in after image loads (GSAP timeline)
- No loading spinner or skeleton

### 7.6 Accessibility

- `role="banner"` on hero section
- `alt` text on background image describing the scene
- Headline is `<h1>` (single H1 per page)
- Reduced motion: disable Ken Burns, show static image
- Sufficient contrast: text over gradient overlay must meet WCAG AA

---

## 8. Visual Storytelling

### 8.1 Scrolling Feel

The homepage should feel like moving through a curated editorial — each section is a new chapter, with visual variety and breathing room.

**Not:** Uniform sections stacked like cards.

**Instead:** A rhythm of scale, density, and mood.

### 8.2 Visual Storytelling Principles

| Principle | Application |
|-----------|-------------|
| **Full-bleed imagery** | Hero, featured trail moment, visual interlude |
| **Image reveals** | Trails section: images reveal on scroll |
| **Cinematic transitions** | Dark → light → dark section rhythm |
| **Layered typography** | Headlines over images, editorial text |
| **Visual pauses** | Empty space, minimal text sections between dense content |
| **Dark/light rhythm** | Alternate cream and dark backgrounds for contrast |
| **Editorial compositions** | Not just grids — asymmetric layouts, varying image sizes |

### 8.3 Section Background Rhythm

```
Section 1 (Hero):        DARK (image + overlay)
Section 2 (Statement):   DARK (continuation) or CREAM (contrast)
Section 3 (Trails):      CREAM (light, inviting)
Section 4 (Featured):    FULL-BLEED IMAGE (immersive)
Section 5 (Map):         DARK (map contrast)
Section 6 (Stories):     CREAM (editorial)
Section 7 (Food):        CREAM (warm)
Section 8 (Interlude):   FULL-BLEED IMAGE (breathing room)
Section 9 (Closing):     DARK (sign-off)
Section 10 (Footer):     DARK (brand)
```

### 8.4 Animation Restraint

- Every animation must serve a storytelling purpose
- No decorative animations
- Hero: text reveal only
- Sections: scroll-triggered reveals (fade + translate)
- Featured trail: image parallax
- Map: marker appearance animation
- No bouncing, spinning, or attention-grabbing effects

---

## 9. Trails Experience

### 9.1 Current State

ExploreTrails fetches all published trails and displays up to 6 in a 3-column grid. Each card has: cover image, name, excerpt, journal count. "View All Trails" button.

### 9.2 New Approach: Editorial Trail Discovery

**Not a card grid.** Instead, a visual composition that communicates diversity.

**Layout concept:**
- **Featured trail:** Large, full-width or prominent position with editorial description
- **Supporting trails:** 3-4 smaller trails arranged in an asymmetric mosaic
- **Each trail tile:** Full-bleed image with name overlay, no card border
- **Hover/touch:** Subtle image zoom or overlay shift
- **CTA:** "Explore All Trails" at the bottom

### 9.3 Trail Data

From `TrailLocation` model:
- `name` → Trail display name
- `slug` → URL
- `excerpt` → Short description
- `coverMedia` → Cover image
- `isFeatured` / `featuredOrder` → Determines featured position
- `terrainType` → Could group by terrain
- `district` → Geographic context
- `_count.journalPosts` → Story count

### 9.4 Featured Trail Logic

Use `isFeatured = true` and `featuredOrder` from TrailLocation to determine which trail gets the prominent position. If no featured trails exist, use the most recently published.

### 9.5 Section Concept

```
[ Section Heading: "Trails of Chittagong" ]
[ Subtitle: "From the coast to the hills, every path leads to a discovery." ]

[ ┌──────────────────────────────────────────┐ ]
[ │                                          │ ]
[ │     FEATURED TRAIL (large, full-width)   │ ]
[ │     Image + Name + Excerpt               │ ]
[ │                                          │ ]
[ └──────────────────────────────────────────┘ ]

[ ┌──────────┐ ┌──────────┐ ┌──────────┐    ]
[ │ Trail 2  │ │ Trail 3  │ │ Trail 4  │    ]
[ │ (image)  │ │ (image)  │ │ (image)  │    ]
[ └──────────┘ └──────────┘ └──────────┘    ]

[         "Explore All Trails →"             ]
```

### 9.6 Mobile Behavior

- Featured trail: full-width, stacked
- Supporting trails: 2-column then 1-column
- Images scale proportionally
- Name overlay adjusts for readability

---

## 10. Map Experience

### 10.1 Current State

InteractiveMap shows a Leaflet map in a dark section with all trail markers. Basic click-to-navigate.

### 10.2 New Approach: Geographic Storytelling

The map should tell Chittagong's geographic story, not just show pin locations.

**Concept:**
- Map appears as a discovery layer, not a utility
- Centered on Chittagong region
- Markers styled to reflect terrain type (color-coded or icon-coded)
- Clicking a marker shows a brief trail preview (name + thumbnail)
- Clicking preview navigates to trail page
- The map section has editorial context (not just "Discover Chittagong")

### 10.3 Map Visual Treatment

- Full-width map (within section, not full-viewport)
- Dark section background for contrast
- Map style: warm-toned or standard OSM
- Custom marker styling (if possible with Leaflet)
- Trail name labels on hover

### 10.4 Map Interaction

| Action | Desktop | Mobile |
|--------|---------|--------|
| Pan | Click + drag | Touch + drag |
| Zoom | Scroll wheel | Pinch |
| Marker click | Popup with trail name + thumbnail | Bottom sheet with trail info |
| Marker hover | Tooltip with trail name | N/A |
| Navigate | Click "View Trail" in popup | Tap "View Trail" |

### 10.5 Accessibility Fallback

- Below the map, list trails as text links
- Keyboard-navigable markers (if Leaflet supports)
- `aria-label` on map container

### 10.6 Map Data

From `getTrailsWithCoordinates()`:
- `id`, `name`, `slug`, `latitude`, `longitude`
- Could be extended to include `terrainType` for marker styling

---

## 11. Journal / Stories

### 11.1 Current State

Journal section fetches 3 latest STORY posts and displays them in a 3-column card grid with date, trail name, title, excerpt.

### 11.2 New Approach: Stories About Chittagong

**Reframe from "Journal" to "Stories from Chittagong."**

The section should feel like reading a curated editorial selection, not a blog feed.

**Layout concept:**
- **Featured story:** Large, editorial layout (image + title + excerpt + trail)
- **Supporting stories:** 2 smaller stories in a row
- Each story emphasizes the PLACE, not the author
- Date is secondary (not prominently displayed)
- Trail name is primary context

### 11.3 Story Hierarchy

| Position | Source | Display |
|----------|--------|---------|
| Featured | `isFeatured = true` JournalPost with highest featuredOrder | Large editorial layout |
| Supporting | Next 2 published STORY posts | Smaller cards |

### 11.4 Story Card Design

**Featured story:**
```
[ ┌──────────────────────────────────────────┐ ]
[ │  [IMAGE - full width]                    │ ]
[ │                                          │ ]
[ │  Trail Name (eyebrow)                    │ ]
[ │  Story Title (large heading)             │ ]
[ │  Excerpt (2-3 lines)                     │ ]
[ │  "Read Story →"                          │ ]
[ └──────────────────────────────────────────┘ ]
```

**Supporting stories:**
```
[ ┌────────────────┐ ┌────────────────┐     ]
[ │ [IMAGE]        │ │ [IMAGE]        │     ]
[ │ Trail Name     │ │ Trail Name     │     ]
[ │ Title          │ │ Title          │     ]
[ │ Excerpt        │ │ Excerpt        │     ]
[ └────────────────┘ └────────────────┘     ]
```

### 11.5 Editorial Hooks

- Lead with the most visually compelling story
- Use trail name as geographic context (not date)
- Excerpt should make the user want to visit the place

### 11.6 CTA

"More Stories from Chittagong →" linking to `/journal`

---

## 12. Food

### 12.1 Current State

Food section fetches 3 latest FOOD posts and displays them in a 3-column card grid, identical structure to Journal.

### 12.2 New Approach: Taste of Chittagong

Food is a major part of Chittagong's identity. The homepage food section should communicate **culture and place**, not just list food posts.

**Concept:**
- Food section feels warm, editorial, culturally rich
- Featured food item gets prominence
- Each food item connects to a place in Chittagong
- Visual treatment: warm tones, close-up food imagery

### 12.3 Food Section Layout

**Option A: Horizontal scroll (recommended)**
```
[ Section: "Taste of Chittagong" ]
[ Subtitle: "Food is how Chittagong tells its stories." ]

[ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ →scroll ]
[ │ Food 1 │ │ Food 2 │ │ Food 3 │ │ Food 4 │         ]
[ │ IMAGE  │ │ IMAGE  │ │ IMAGE  │ │ IMAGE  │         ]
[ │ Name   │ │ Name   │ │ Name   │ │ Name   │         ]
[ │ Place  │ │ Place  │ │ Place  │ │ Place  │         ]
[ └────────┘ └────────┘ └────────┘ └────────┘         ]

[ "Explore Chittagong's Food →" ]
```

**Option B: Featured + grid**
```
[ ┌──────────────────────────────────────────┐ ]
[ │  [FEATURED FOOD - large image]           │ ]
[ │  Name + Place + Description              │ ]
[ └──────────────────────────────────────────┘ ]
[ ┌──────────┐ ┌──────────┐ ┌──────────┐    ]
[ │ Food 2   │ │ Food 3   │ │ Food 4   │    ]
[ └──────────┘ └──────────┘ └──────────┘    ]
```

### 12.4 Food Content Model

Uses `JournalPost` with `type = FOOD`:
- `title` → Food name (e.g., "Kala Bhuna")
- `excerpt` → Short description
- `coverMedia` → Food image
- `trail` → Place where this food is found

### 12.5 Food Cultural Context

The section should reference Chittagong food culture:
- Mezbani (traditional Chittagong beef feast)
- Kala bhuna (slow-cooked dark beef)
- Shutki (dried fish)
- Street food culture
- Hill tract cuisines

This context appears in the section subtitle or editorial text, not as a separate encyclopedia section.

---

## 13. People / Culture / History

### 13.1 Evaluation

**Recommendation: DO NOT add a dedicated section.**

People, culture, and history should be woven into:
- **Journal stories** — Place histories, cultural observations
- **Trails** — Heritage trails, historical places
- **Food** — Cultural food traditions
- **Editorial moments** — Atmospheric references

**Reason:** Adding a dedicated section would:
- Increase section count unnecessarily
- Create content that overlaps with Journal
- Risk feeling like a generic "culture" section

**Instead:** Ensure Journal stories cover culture and history. The trail descriptions and food cultural context already touch on these themes.

---

## 14. Seasonal / Mood Story

### 14.1 Current State

SeasonalMood is a CMS-driven section with eyebrow, title, content, and media. Returns null when empty. Currently has a hardcoded monsoon-themed fallback.

### 14.2 Decision: Remove as Standalone Section

**Seasonal/Mood is removed as a dedicated homepage section.**

**Rationale:**
- Requires ongoing owner copy updates (seasonal changes)
- Risk of feeling stale if not maintained
- Seasonal mood is better communicated through:
  - Hero imagery (can be updated seasonally)
  - Editorial interlude images (atmospheric moments)
  - Journal stories (seasonal content)

### 14.3 Alternative: Seasonal Atmosphere

Instead of a dedicated section, seasonal mood appears through:
- **Hero image** — Can be swapped to reflect current season
- **Visual interlude** — Atmospheric images that evoke seasonal feeling
- **Journal stories** — Seasonal content within stories
- **Site Settings** — Hero media can be updated to reflect season

This is lighter, more maintainable, and more authentic.

---

## 15. Gallery

### 15.1 Current State

UneditedGallery uses hardcoded placeholder data (6 items with location names but no images). The `HomepageGallery` model exists in the schema but is unused on the homepage.

### 15.2 New Approach: Visual Interlude

**Rename from "Unedited Gallery" to "Visual Interlude" or "Moments from Chittagong."**

**Purpose:** Provide breathing room between dense content sections. Atmospheric, editorial, not a grid of thumbnails.

**Layout concept:**
- Mixed aspect ratios (landscape, portrait, square)
- 3-4 images in an asymmetric composition
- No heavy captions — just location labels
- Images are atmospheric, not documentary
- Uses `HomepageGallery` model for CMS-managed images

### 15.3 Gallery Data

From `HomepageGallery` model:
- `mediaAssetId` → Image reference
- `sortOrder` → Display order
- `mediaAsset` → Image details (secureUrl, altText, width, height)

### 15.4 Gallery Treatment

- Full-width section (within container, not full-bleed)
- Images have generous spacing
- Mixed aspect ratios create visual interest
- Location labels in small, muted text
- No grid borders or card treatment

### 15.5 Mobile Behavior

- Images stack vertically
- Maintain aspect ratios
- Reduce to 2 images per row

---

## 16. About / Closing

### 16.1 Current State

AboutSignoff shows a blockquote heading, content paragraph, and "Read More" link in a dark section.

### 16.2 New Approach: Invitational Closing

The closing should:
- Establish authenticity (who is behind this)
- Explain why Chittagong Trail exists
- Invite continued exploration
- NOT turn into a founder biography

**Layout concept:**
```
[ DARK SECTION ]
[ ┌──────────────────────────────────────────┐ ]
[ │                                          │ ]
[ │  "Chittagong is a city that rewards      │ ]
[ │   those who take the time to look        │ ]
[ │   closely."                              │ ]
[ │                                          │ ]
[ │  Chittagong Trail is an independent      │ ]
  │  project documenting Chittagong's        │ ]
[ │  places, food, stories, and culture.     │ ]
[ │                                          │ ]
[ │  [Founder name or "The Explorer"]        │ ]
[ │                                          │ ]
[ │  [Explore All Trails]  [Read About]      │ ]
[ │                                          │ ]
[ └──────────────────────────────────────────┘ ]
```

### 16.3 Content

- **Heading:** Editorial statement about Chittagong (CMS-driven)
- **Body:** Brief explanation of the platform (CMS-driven)
- **Attribution:** Founder name or curator title (STATIC or SITE SETTINGS)
- **CTAs:** Two buttons — "Explore All Trails" + "Read About"

### 16.4 Founder Attribution

**Decision needed:** Should the closing show:
- Founder's real name
- "The Explorer" or similar title
- No attribution (platform-only)

**Recommendation:** Use a curatorial title (e.g., "The Explorer" or "Curated by...") rather than personal name, to maintain Chittagong as the subject.

---

## 17. Footer

### 17.1 Current State

Footer is a separate component (`components/layout/Footer.tsx`) using Site Settings for footerText. Displays social links and basic navigation.

### 17.2 New Approach

The footer should:
- Use the wordmark (dark background version)
- Include primary navigation links
- Include social links
- Include a brief brand sign-off
- Feel like a natural conclusion to the homepage

### 17.3 Footer Structure

```
[ DARK SECTION — wordmark ]
[ ┌──────────────────────────────────────────┐ ]
[ │  [WORDMARK IMAGE]                        │ ]
[ │                                          │ ]
[ │  Trails    Journal    Food    About      │ ]
[ │                                          │ ]
[ │  Facebook   Instagram   YouTube          │ ]
[ │                                          │ ]
[ │  © 2026 Chittagong Trail                 │ ]
[ └──────────────────────────────────────────┘ ]
```

### 17.4 Footer Data

- Navigation links → STATIC (same as primary nav)
- Social links → SiteSettings (socialFacebook, socialInstagram, socialYouTube)
- Copyright → STATIC (year dynamic)
- Wordmark → STATIC (`/images/chittagongtrail-wordmark.png`)
- Footer text → SiteSettings (footerText)

---

## 18. Site Settings Integration

### 18.1 Mapping: New Sections → Site Settings

| Section | Data Source | Editable via Admin? |
|---------|-------------|---------------------|
| Cinematic Hero | SiteSettings (heroTitle, heroSubtitle, heroMediaId) | Yes |
| Chittagong Statement | SiteSettings (introductionHeading, introductionContent) | Yes |
| Trail Discovery | TrailLocation (database) | No (content managed via Trails admin) |
| Featured Trail | TrailLocation (isFeatured, featuredOrder) | Yes (via Trails admin) |
| Chittagong Geography | TrailLocation (getTrailsWithCoordinates) | No |
| Stories | JournalPost (getLatestJournalPosts) | No (content managed via Journal admin) |
| Taste of Chittagong | JournalPost (getLatestFoodPosts) | No (content managed via Journal admin) |
| Visual Interlude | HomepageGallery (database) | REQUIRES OWNER DECISION |
| Closing | SiteSettings (aboutHeading, aboutContent) | Yes |
| Footer | SiteSettings (socialFacebook, socialInstagram, socialYouTube, footerText) | Yes |

### 18.2 Settings Categories

**Current Site Settings fields mapped to new sections:**

| Admin Tab | Fields | Homepage Section |
|-----------|--------|-----------------|
| General | siteName | Header, fallback |
| Hero | heroTitle, heroSubtitle, heroMediaId | Cinematic Hero |
| Introduction | introductionHeading, introductionContent | Chittagong Statement |
| Seasonal | seasonalEyebrow, seasonalTitle, seasonalContent, seasonalMediaId | **UNUSED** (section removed) |
| About | aboutHeading, aboutContent | Closing |
| Contact & Social | contactEmail, socialFacebook, socialInstagram, socialYouTube | Footer |
| Footer | footerText | Footer |

### 18.3 Recommendation: Seasonal Fields

The Seasonal fields in Site Settings should be:
- **Option A:** Repurposed for a different section (e.g., Visual Interlude editorial text)
- **Option B:** Left in place but unused on homepage (future use)
- **Option C:** Removed from admin UI (requires schema change — flag as OWNER DECISION)

**Recommendation:** Option B — Leave fields in place, mark as "reserved for future use" in admin UI.

### 18.4 New Settings Needed?

**REQUIRES OWNER DECISION:** Should the homepage have additional Site Settings for:
- Featured trail selection (currently uses TrailLocation.isFeatured)
- Gallery management (currently HomepageGallery model exists)
- Closing attribution text

**Recommendation:** No new settings needed. Use existing models.

---

## 19. Database Content Mapping

### 19.1 Data Flow

```
SiteSettings ──────→ Hero, Chittagong Statement, Closing, Footer
                     (via getPublicSiteSettings())

TrailLocation ─────→ Trail Discovery, Featured Trail, Map
                     (via getTrails(), getTrailsWithCoordinates())

JournalPost ────────→ Stories (type=STORY), Food (type=FOOD)
                     (via getLatestJournalPosts(), getLatestFoodPosts())

HomepageGallery ───→ Visual Interlude
                     (via new data fetcher — REQUIRES IMPLEMENTATION)

MediaAsset ─────────→ All images (cover, hero, seasonal, gallery)
                     (via relations on above models)
```

### 19.2 NO DATABASE SCHEMA CHANGES

**Confirmed:** No new models, no new fields, no migrations.

The existing schema supports the new homepage architecture:
- `TrailLocation` → isFeatured, featuredOrder, terrainType, coverMedia
- `JournalPost` → isFeatured, featuredOrder, type, trail, coverMedia
- `HomepageGallery` → mediaAsset, sortOrder
- `SiteSettings` → hero, introduction, about, social fields

### 19.3 Data Insufficiency Flags

| Proposed Feature | Current Schema | Status |
|-----------------|----------------|--------|
| Featured trail selection | TrailLocation.isFeatured, featuredOrder | Sufficient |
| Trail terrain grouping | TrailLocation.terrainType | Sufficient |
| Food cultural context | JournalPost.type=FOOD, trail relation | Sufficient |
| Gallery management | HomepageGallery model | Sufficient (unused currently) |
| Seasonal content rotation | SiteSettings.seasonal fields | Sufficient (repurposable) |
| Founder attribution | Not in SiteSettings | **REQUIRES OWNER DECISION** |

---

## 20. Media Requirements

### 20.1 Hero Assets

| Asset | Quantity | Aspect Ratio | Quality | Notes |
|-------|----------|--------------|---------|-------|
| Hero background image | 1 (minimum) | 16:9 or 21:9 | High-res (1920px+ width) | Chittagong landscape — hills, coast, or city panorama |
| Hero background image (mobile) | 1 | 9:16 | High-res | Could be same image with mobile crop |
| Wordmark | 1 | 3.75:1 | Existing | chittagongtrail-wordmark.png (already exists) |

**Founder-owned footage required:** Yes. Stock photography should NOT be used as final hero imagery.

**Temporary placeholder:** CMS hero media field can be empty; fallback shows logo.

### 20.2 Trail Discovery Assets

| Asset | Quantity | Aspect Ratio | Quality | Notes |
|-------|----------|--------------|---------|-------|
| Featured trail cover | 1 | 16:9 | High-res | From TrailLocation.coverMedia |
| Supporting trail covers | 3-4 | 16:9 | Medium-res | From TrailLocation.coverMedia |

**Source:** Already exists in TrailLocation.coverMediaId relation.

### 20.3 Stories Assets

| Asset | Quantity | Aspect Ratio | Quality | Notes |
|-------|----------|--------------|---------|-------|
| Featured story cover | 1 | 16:9 | High-res | From JournalPost.coverMedia |
| Supporting story covers | 2 | 16:9 | Medium-res | From JournalPost.coverMedia |

**Source:** Already exists in JournalPost.coverMediaId relation.

### 20.4 Food Assets

| Asset | Quantity | Aspect Ratio | Quality | Notes |
|-------|----------|--------------|---------|-------|
| Food item images | 3-4 | 4:5 or 1:1 | Medium-res | From JournalPost.coverMedia (type=FOOD) |

**Source:** Already exists in JournalPost.coverMediaId relation.

### 20.5 Visual Interlude Assets

| Asset | Quantity | Aspect Ratio | Quality | Notes |
|-------|----------|--------------|---------|-------|
| Atmospheric images | 3-4 | Mixed (landscape, portrait, square) | High-res | From HomepageGallery.mediaAsset |

**Source:** HomepageGallery model exists but currently unused. **REQUIRES OWNER DECISION** on whether to populate.

### 20.6 Closing Section Assets

| Asset | Quantity | Aspect Ratio | Quality | Notes |
|-------|----------|--------------|---------|-------|
| None required | — | — | — | Text-only section |

### 20.7 Total Minimum Media Requirements

| Category | Minimum Assets | Status |
|----------|---------------|--------|
| Hero | 1 high-res image | **NEEDED** |
| Trails | 4+ cover images | Exists in DB |
| Stories | 3 cover images | Exists in DB |
| Food | 3 cover images | Exists in DB |
| Gallery | 3-4 atmospheric images | **NEEDED** (HomepageGallery) |
| Wordmark | 1 | Exists |
| Logo | 1 | Exists |
| Favicon | 1 | Exists |

---

## 21. Responsive Architecture

### 21.1 Breakpoints

| Breakpoint | Range | Device |
|------------|-------|--------|
| Mobile | 0–767px | Phones |
| Tablet | 768–1023px | Small tablets, large phones landscape |
| Desktop | 1024px+ | Desktops, laptops, large tablets |

### 21.2 Section-by-Section Responsive Behavior

#### Hero
| Breakpoint | Layout |
|------------|--------|
| Mobile | Full-viewport, smaller headline (text-4xl), subtitle below, scroll indicator |
| Tablet | Full-viewport, medium headline (text-5xl) |
| Desktop | Full-viewport, large headline (text-6xl/7xl) |

#### Chittagong Statement
| Breakpoint | Layout |
|------------|--------|
| Mobile | Centered text, full-width, smaller type |
| Tablet | Centered, max-w-2xl |
| Desktop | Centered, max-w-3xl |

#### Trail Discovery
| Breakpoint | Layout |
|------------|--------|
| Mobile | Featured trail full-width, supporting 2-column |
| Tablet | Featured trail full-width, supporting 3-column |
| Desktop | Featured trail full-width, supporting 3-4 column mosaic |

#### Featured Trail Moment
| Breakpoint | Layout |
|------------|--------|
| Mobile | Full-width image, stacked text |
| Tablet | Full-width image, overlay text |
| Desktop | Full-width or split layout |

#### Map
| Breakpoint | Layout |
|------------|--------|
| Mobile | Full-width map, shorter height, marker list below |
| Tablet | Full-width map, medium height |
| Desktop | Full-width map, generous height |

#### Stories
| Breakpoint | Layout |
|------------|--------|
| Mobile | Featured story stacked, supporting stories stacked |
| Tablet | Featured story full-width, supporting 2-column |
| Desktop | Featured story + 2 supporting in row |

#### Food
| Breakpoint | Layout |
|------------|--------|
| Mobile | Horizontal scroll (2 items visible) or stacked |
| Tablet | Horizontal scroll (3 items visible) |
| Desktop | Horizontal scroll or grid |

#### Visual Interlude
| Breakpoint | Layout |
|------------|--------|
| Mobile | 2-column grid, smaller images |
| Tablet | 3-column grid |
| Desktop | Asymmetric mixed grid |

#### Closing
| Breakpoint | Layout |
|------------|--------|
| Mobile | Centered text, stacked CTAs |
| Tablet | Centered, side-by-side CTAs |
| Desktop | Centered, side-by-side CTAs |

---

## 22. Accessibility

### 22.1 Requirements

| Requirement | Implementation |
|-------------|----------------|
| Semantic HTML | `<section>`, `<nav>`, `<main>`, `<header>`, `<footer>`, `<h1>`-`<h6>` |
| Heading hierarchy | Single `<h1>` in Hero, `<h2>` for each section, `<h3>` within sections |
| Keyboard navigation | All interactive elements focusable, logical tab order |
| Visible focus states | `:focus-visible` ring on all interactive elements |
| Alt text | Every image has descriptive alt text |
| Reduced motion | `prefers-reduced-motion: reduce` disables animations |
| Map fallback | Text list of trails below interactive map |
| Contrast | All text meets WCAG AA (4.5:1 for body, 3:1 for large text) |
| Touch targets | Minimum 44x44px for all interactive elements |
| ARIA labels | Map, gallery, and interactive elements have aria-labels |

### 22.2 Reduced Motion Behavior

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable GSAP animations */
  /* Disable Ken Burns */
  /* Disable scroll indicator animation */
  /* Show all content immediately */
}
```

**Implementation:** GSAP ScrollTrigger respects `prefers-reduced-motion` when configured. The `useScrollReveal` hook should check for reduced motion and skip animations.

### 22.3 Do NOT Sacrifice Accessibility

- Cinematic effects must degrade gracefully
- All content must be accessible without JavaScript
- Map must have text fallback
- Images must have alt text even when decorative

---

## 23. Performance

### 23.1 Image Strategy

| Technique | Application |
|-----------|-------------|
| Next/Image | All images use Next.js Image component |
| Responsive sizes | `sizes` attribute for responsive loading |
| Lazy loading | Below-fold images use `loading="lazy"` |
| Priority loading | Hero image only: `priority={true}` |
| Format | WebP/AVIF via Next.js image optimization |
| Placeholder | Blur placeholder for perceived performance |

### 23.2 Video Strategy (Future)

If hero video is implemented:
- Use `<video>` with `poster` fallback
- Lazy-load video (don't autoplay on mobile)
- Compress aggressively (720p for mobile, 1080p for desktop)
- Provide image fallback for reduced-motion users

### 23.3 Animation Performance

- Use `transform` and `opacity` only (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Clean up GSAP triggers on unmount
- Limit concurrent animations

### 23.4 Layout Shift Prevention

- All images have explicit `width` and `height`
- Hero section has `min-h-screen` with no content shift
- Sections have minimum heights to prevent collapse
- Font loading uses `font-display: swap`

### 23.5 Mobile Bandwidth

- Serve smaller images to mobile (via Next/Image `sizes`)
- Defer non-critical animations on mobile
- Reduce image quality slightly on mobile (if using Cloudinary transforms)

---

## 24. SEO Preservation

### 24.1 H1/H2 Hierarchy

```
<h1> [Hero headline — Chittagong Trail or CMS title]
  <h2> [Chittagong Statement heading]
  <h2> [Trail Discovery heading]
  <h2> [Featured Trail name]
  <h2> [Geography/Map heading]
  <h2> [Stories heading]
  <h2> [Food heading]
  <h2> [Closing heading — optional]
```

### 24.2 Metadata

**Preserved from Phase 7:**
- `<title>` — from SiteSettings or dynamic
- `<meta name="description">` — from SiteSettings
- `<link rel="canonical">` — homepage canonical URL
- Open Graph tags — og:title, og:description, og:image
- Twitter Card tags

### 24.3 JSON-LD

**Preserved:**
- Organization schema (site-wide)
- WebSite schema (homepage)
- BreadcrumbList (if applicable)

### 24.4 Internal Linking

The homepage provides internal links to:
- `/trails` (from Trail Discovery)
- `/trails/[slug]` (from featured trail, trail cards)
- `/journal` (from Stories)
- `/journal/[slug]` (from story cards)
- `/food` (from Food section)
- `/food/[slug]` (from food items)
- `/about` (from Closing)

### 24.5 Sitemap

`app/sitemap.ts` dynamically generates sitemap from database. Homepage redesign does not affect sitemap generation.

### 24.6 Robots

`app/robots.ts` unchanged.

---

## 25. Component Architecture

### 25.1 Proposed Components

```
components/home/
├── index.ts                          # Barrel exports
├── Hero.tsx                          # Cinematic hero (Client)
├── ChittagongStatement.tsx           # Editorial opening statement (Server)
├── TrailDiscovery.tsx                # Trail showcase section (Server)
├── FeaturedTrail.tsx                 # Featured trail moment (Server)
├── ChittagongMap.tsx                 # Geographic map section (Server)
├── StoriesFromChittagong.tsx         # Journal stories section (Server)
├── TasteOfChittagong.tsx             # Food section (Server)
├── VisualInterlude.tsx               # Gallery/atmospheric images (Server)
├── ClosingInvitation.tsx             # About/sign-off section (Server)
└── SectionMood.tsx                   # Optional: editorial mood wrapper (Client)
```

### 25.2 Component Specifications

| Component | Responsibility | Data Source | Client/Server | Animation | Reusable? |
|-----------|---------------|-------------|---------------|-----------|-----------|
| Hero.tsx | Full-viewport hero with image, headline, subtitle | SiteSettings | Client | GSAP timeline reveal | No (homepage-specific) |
| ChittagongStatement.tsx | Editorial opening statement | SiteSettings | Server | SectionReveal | No (homepage-specific) |
| TrailDiscovery.tsx | Trail showcase with featured + mosaic | TrailLocation | Server | Image reveal on scroll | No (homepage-specific) |
| FeaturedTrail.tsx | Deep editorial focus on one trail | TrailLocation (featured) | Server | Parallax on image | No (homepage-specific) |
| ChittagongMap.tsx | Interactive Leaflet map | TrailLocation (coordinates) | Server (map is Client) | Marker animation | Yes (could be reused) |
| StoriesFromChittagong.tsx | Featured + supporting stories | JournalPost | Server | SectionReveal | No (homepage-specific) |
| TasteOfChittagong.tsx | Food culture showcase | JournalPost (FOOD) | Server | Horizontal scroll animation | No (homepage-specific) |
| VisualInterlude.tsx | Atmospheric image composition | HomepageGallery | Server | Image reveal | No (homepage-specific) |
| ClosingInvitation.tsx | Sign-off and CTAs | SiteSettings | Server | SectionReveal | No (homepage-specific) |
| SectionMood.tsx | Editorial mood wrapper for dark sections | — | Client | Background transition | Yes |

### 25.3 Keep Existing Components

| Component | Status | Notes |
|-----------|--------|-------|
| Container.tsx | KEEP | Max-width wrapper |
| SectionHeading.tsx | KEEP | H2 + subtitle, may extend with eyebrow variant |
| Button.tsx | KEEP | All variants |
| TrailCard.tsx | KEEP | Used on /trails page |
| JournalCard.tsx | KEEP | Used on /journal page |
| TrailMap.tsx | KEEP | Lazy-loaded map wrapper |
| TrailMapInner.tsx | KEEP | Leaflet map implementation |
| SectionReveal.tsx | KEEP | GSAP scroll animation |
| Header.tsx | KEEP | Navigation |
| MobileMenu.tsx | KEEP | Mobile navigation |
| PublicLayout.tsx | KEEP | Page wrapper |

### 25.4 Client vs Server Split

**Client Components (3):**
- Hero.tsx — GSAP animation, scroll indicator
- SectionMood.tsx — Background transition (if used)
- TrailMap / TrailMapInner — Already client

**Server Components (7):**
- ChittagongStatement.tsx
- TrailDiscovery.tsx
- FeaturedTrail.tsx
- ChittagongMap.tsx (wrapper)
- StoriesFromChittagong.tsx
- TasteOfChittagong.tsx
- VisualInterlude.tsx
- ClosingInvitation.tsx

---

## 26. Animation Architecture

### 26.1 Animation System

| Animation | Trigger | Type | Pinned? | Mobile | Reduced Motion |
|-----------|---------|------|---------|--------|----------------|
| Hero text reveal | Page load | GSAP timeline (staggered fade + translate) | No | Same, smaller | Disabled |
| Hero Ken Burns | Page load | CSS animation (slow scale) | No | Disabled | Disabled |
| Section reveals | Scroll (80% viewport) | GSAP ScrollTrigger fade + translateY | No | Same | Disabled |
| Trail image reveals | Scroll (element enters view) | GSAP ScrollTrigger fade + scale | No | Same | Disabled |
| Featured trail parallax | Scroll (scrub) | GSAP ScrollTrigger y-transform | No | Reduced speed | Disabled |
| Map marker appearance | Scroll (map enters view) | GSAP staggered fade-in | No | Same | Disabled |
| Food horizontal scroll | Scroll (scrub) | GSAP ScrollTrigger x-translate | No | Touch scroll | Disabled |
| Gallery image reveals | Scroll (staggered) | GSAP ScrollTrigger fade + translateY | No | Same | Disabled |

### 26.2 GSAP Hooks

**Existing hooks to use:**
- `useScrollReveal` → Section reveals
- `useParallax` → Featured trail parallax
- `useHeroReveal` → Hero text animation

**New hooks needed:**
- `useKenBurns` → Hero background slow zoom (or CSS animation)
- `useHorizontalScroll` → Food section horizontal scroll
- `useStaggerReveal` → Gallery staggered reveals

### 26.3 Animation Intent Summary

- **Hero:** Create immediate immersion
- **Sections:** Signal content transitions
- **Trails:** Draw attention to imagery
- **Featured trail:** Create depth and editorial feel
- **Map:** Make discovery feel dynamic
- **Food:** Create browseable, tactile feel
- **Gallery:** Create visual rhythm
- **Closing:** Calm, resolved ending

---

## 27. Remove / Keep / Rebuild Matrix

| Existing Element | Action | Why |
|-----------------|--------|-----|
| Hero.tsx | **REBUILD** | Current hero is conventional; needs cinematic approach |
| Introduction.tsx | **REBUILD** → ChittagongStatement.tsx | Reframe from welcome to editorial statement |
| ExploreTrails.tsx | **REBUILD** → TrailDiscovery.tsx | Card grid → editorial mosaic |
| SeasonalMood.tsx | **REMOVE** | Section removed; mood woven into other sections |
| InteractiveMap.tsx | **REBUILD** → ChittagongMap.tsx | Utility map → geographic storytelling |
| Journal.tsx | **REBUILD** → StoriesFromChittagong.tsx | Card grid → featured + supporting editorial |
| Food.tsx | **REBUILD** → TasteOfChittagong.tsx | Card grid → horizontal scroll/editorial |
| UneditedGallery.tsx | **REBUILD** → VisualInterlude.tsx | Placeholder → real gallery data |
| AboutSignoff.tsx | **REBUILD** → ClosingInvitation.tsx | Generic sign-off → invitational closing |
| SectionWrapper.tsx | **KEEP** | Animation wrapper, reusable |
| SectionReveal.tsx | **KEEP** | GSAP animation primitive |
| Container.tsx | **KEEP** | Layout wrapper |
| SectionHeading.tsx | **KEEP** | May extend with eyebrow variant |
| Button.tsx | **KEEP** | All variants |
| TrailCard.tsx | **KEEP** | Used on /trails page |
| JournalCard.tsx | **KEEP** | Used on /journal page |
| TrailMap.tsx | **KEEP** | Map wrapper |
| TrailMapInner.tsx | **KEEP** | Leaflet implementation |
| Header.tsx | **KEEP** | Navigation |
| Footer.tsx | **KEEP** | May update styling |
| MobileMenu.tsx | **KEEP** | Mobile navigation |
| useGsap.ts | **KEEP** | Animation hooks |
| globals.css | **KEEP** | Design tokens |

---

## 28. Homepage User Journey

### 28.1 Complete Experience Flow

```
0s — ARRIVAL
│   Hero fills viewport. Dark, atmospheric image.
│   Wordmark appears. Headline fades in: "Between the hills and the sea."
│   User immediately knows: THIS IS CHITTAGONG.
│
3s — ORIENTATION
│   Subtitle appears: "A curated exploration of Chittagong's places, 
│   stories, food, and landscapes."
│   Scroll indicator pulses gently.
│   User understands: THIS IS A PLATFORM ABOUT CHITTAGONG.
│
5s — FIRST SCROLL
│   Hero scrolls away. Chittagong Statement section appears.
│   Editorial text establishes: "Chittagong is a city that rewards 
│   those who take the time to look closely."
│   User feels: THIS IS THOUGHTFUL, NOT GENERIC.
│
10s — CURIOSITY
│   Trail Discovery section appears.
│   Featured trail: large image of a Chittagong place.
│   Supporting trails: mosaic of 3-4 places.
│   User thinks: "I didn't know Chittagong had all these places."
│
20s — DEPTH
│   Featured Trail Moment section appears.
│   Full-bleed image of one trail. Editorial description.
│   User feels: "This place looks extraordinary."
│
30s — GEOGRAPHY
│   Map section appears. Dark background.
│   Interactive map shows all trail locations.
│   User explores: "Where exactly are these places?"
│
40s — STORIES
│   Stories section appears.
│   Featured story with large image. Supporting stories.
│   User reads: "These are real stories about real places."
│
50s — CULTURE
│   Food section appears. Horizontal scroll of food items.
│   User discovers: "Chittagong has its own food culture."
│
60s — BREATHING ROOM
│   Visual Interlude. Atmospheric images.
│   User absorbs: the beauty of the place.
│
70s — CONNECTION
│   Closing section appears.
│   "Chittagong Trail documents this city with care."
│   User understands: someone is genuinely invested in this.
│
75s — INVITATION
│   CTAs: "Explore All Trails" + "Read About"
│   User decides: "I want to explore more."
│
80s — DEPARTURE
    Footer. Navigation. Social links.
    User leaves to: /trails, /journal, /food, /about
```

### 28.2 Emotional Arc Summary

```
ARRIVAL → ORIENTATION → CURIOSITY → DISCOVERY → DEPTH → CULTURE → BREATHING → CONNECTION → INVITATION
```

---

## 29. Content Priority

### 29.1 Priority Levels

| Priority | Content | Why |
|----------|---------|-----|
| **P0 — Essential** | Chittagong identity (hero, statement) | Without this, the site has no purpose |
| **P0 — Essential** | Trail discovery (places exist) | Core content — trails are the foundation |
| **P0 — Essential** | Navigation (header, footer) | Users must be able to navigate |
| **P1 — Important** | Stories (journal) | Stories add depth and context |
| **P1 — Important** | Food (culture) | Food is a major Chittagong identity marker |
| **P1 — Important** | Map (geography) | Geographic context aids discovery |
| **P1 — Important** | Closing (authenticity) | Establishes trust and purpose |
| **P2 — Optional** | Featured trail moment | Adds editorial depth if content exists |
| **P2 — Optional** | Visual interlude | Adds breathing room and beauty |
| **P2 — Optional** | Footer social links | Nice to have, not critical |

### 29.2 Content Minimums

| Section | Minimum Content Required |
|---------|------------------------|
| Hero | 1 background image + headline |
| Statement | 1 heading + 1 paragraph |
| Trails | At least 1 published trail |
| Featured Trail | At least 1 featured trail with cover image |
| Map | At least 1 trail with coordinates |
| Stories | At least 1 published story with cover image |
| Food | At least 1 published food post with cover image |
| Visual Interlude | At least 2 gallery images |
| Closing | 1 heading + 1 paragraph |

---

## 30. Owner Decisions Required

### Decision 1: Hero Media Type

**Decision:** Video or image for hero background?

| Option | Pros | Cons |
|--------|------|------|
| **Image (Recommended)** | Simpler, faster loading, easier to maintain | Less cinematic |
| Video | More immersive, cinematic | Heavier, needs footage, mobile concerns |
| Image now, video later | Best of both | Requires future work |

**Recommendation:** Image now, design for video later.
**Alternative:** Video if founder has suitable Chittagong footage.
**Impact:** Affects Hero component complexity, performance budget.

### Decision 2: Number of Featured Trails

**Decision:** How many trails get the prominent "featured" position?

| Option | Pros | Cons |
|--------|------|------|
| **1 featured (Recommended)** | Clear editorial hierarchy | Less variety |
| 2 featured | More variety | Less focused |
| 3 featured | Maximum variety | Feels like a grid again |

**Recommendation:** 1 featured trail, 3-4 supporting trails.
**Alternative:** 2 featured trails if content warrants.
**Impact:** Affects Trail Discovery layout.

### Decision 3: Founder Attribution in Closing

**Decision:** How does the founder appear in the closing section?

| Option | Pros | Cons |
|--------|------|------|
| **Curatorial title (Recommended)** | Maintains Chittagong as subject | Less personal |
| Real name | More authentic | Shifts focus to founder |
| No attribution | Platform-only feel | Loses authenticity |

**Recommendation:** Curatorial title (e.g., "Curated from Chittagong" or "The Explorer").
**Alternative:** Real name if owner prefers.
**Impact:** Affects brand personality.

### Decision 4: Visual Interlude Content

**Decision:** Should the homepage include a gallery/visual interlude section?

| Option | Pros | Cons |
|--------|------|------|
| **Include with real images (Recommended)** | Adds breathing room, visual beauty | Requires media assets |
| Include with placeholders | Shows intent | Looks unfinished |
| Remove section | Simpler | Less visual variety |

**Recommendation:** Include if owner has 3-4 atmospheric Chittagong images. Use HomepageGallery model.
**Alternative:** Remove if no images available yet.
**Impact:** Affects homepage visual rhythm.

### Decision 5: Seasonal Fields Disposition

**Decision:** What happens to the Seasonal Mood Site Settings fields?

| Option | Pros | Cons |
|--------|------|------|
| **Leave unused (Recommended)** | No schema change, future flexibility | Fields exist but unused |
| Repurpose for another section | Fields stay useful | Requires admin UI changes |
| Remove from schema | Cleaner schema | Requires migration |

**Recommendation:** Leave fields in database and admin UI, mark as "Reserved for future use."
**Alternative:** Repurpose for Visual Interlude editorial text.
**Impact:** Minimal — no functional change.

---

*End of A8 — Homepage Rebuild Specification*
