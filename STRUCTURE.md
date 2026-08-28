# Chittagong Trail — Site Structure

**Document:** `STRUCTURE.md`
**Version:** 1.0 — Structure Proposal
**Status:** Awaiting approval
**Project:** Chittagong Trail
**Domain:** `chittagongtrail.com`

---

## 1. Purpose

This document defines the information architecture and content structure of the Chittagong Trail website.

It defines:

* Public pages
* Page hierarchy
* Homepage section order
* Navigation
* URL structure
* Content relationships
* Trail architecture
* Journal architecture
* Food architecture
* Map role
* Admin architecture
* Visitor journeys
* SEO architecture foundation

This document is intentionally **not a visual design specification**.

It does not define:

* Final colors
* Fonts
* Typography
* Visual styling
* Animation details
* Final imagery
* Exact copy

Those belong to later phases.

---

# 2. Current Status

### Current phase

**Structure / Information Architecture**

### Status

**Proposal — awaiting human approval**

### Next phase after approval

**Wireframe / Content Architecture**

Do not begin visual design until this structure has been approved.

---

# 3. Brand Context

## Brand

**Chittagong Trail**

## Domain

`chittagongtrail.com`

## Social handle

`@chittagongtrail`

## Tagline

> A personal journal of touring Chittagong — places I visit, stories I find, and everything in between.

## Brand voice

The site should feel:

* Personal
* Warm
* Exploratory
* Observational
* Storytelling-driven
* Genuine
* Rooted specifically in Chittagong

It should NOT feel like:

* A tourism board
* A government website
* A corporate travel agency
* A generic Bangladesh travel portal

### Naming rule

Use:

**Chittagong**

Do not automatically replace it with:

**Chattogram**

This is an intentional brand decision.

---

# 4. Public Site Map

The initial public website consists of:

```text
/
├── /trails
│   └── /trails/[slug]
│
├── /journal
│   └── /journal/[slug]
│
├── /food
│   └── /food/[slug]
│
├── /about
│
└── 404
```

The homepage `/` is the primary storytelling experience.

---

# 5. Primary Navigation

The primary navigation contains:

```text
Trails
Journal
Food
About
```

The logo links to:

```text
/
```

### Map

Map is NOT a primary navigation item in the initial structure.

The map functions as a discovery/navigation layer within:

* Homepage
* Trails section

This decision can be revisited later if the map becomes a major standalone experience.

---

# 6. Homepage Structure

The homepage is the main entry point and storytelling journey.

Section order:

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

## 6.1 Hero

Purpose:

Immediately establish:

* Chittagong Trail
* Sense of place
* Exploration
* Personal perspective

Potential content:

* Full-screen video or photography
* Brand identity
* Short statement
* Scroll indicator

Optional:

* Loading percentage

The exact visual treatment is NOT defined at this stage.

---

## 6.2 Introduction

Purpose:

Briefly explain what Chittagong Trail is.

The section should establish:

* This is a personal exploration journal
* The subject is Chittagong
* The content comes from actual experiences and discoveries

Exact copy is TBD.

---

## 6.3 Explore the Trails

Purpose:

Introduce selected locations.

Potential examples:

* Patenga Beach
* Foy's Lake
* Batali Hill
* Karnaphuli River
* Chandanaish
* Other genuinely visited locations

These are examples only and are NOT automatically confirmed content entries.

CTA:

```text
View All Trails
```

Links to:

```text
/trails
```

---

## 6.4 Chittagong / Mood / Seasonal Story

Purpose:

Provide a more editorial and emotional layer to the site.

Potential themes:

* Monsoon
* Winter
* Hills
* Coast
* Roads
* River
* City atmosphere
* Changing moods of Chittagong

This section is currently **provisional**.

It may be changed, merged, or removed during wireframing if it does not improve the storytelling flow.

---

## 6.5 Interactive Map

Purpose:

Allow visitors to visually discover locations.

Concept:

```text
Map
 ↓
Location Pin
 ↓
Trail Location
 ↓
/trails/[slug]
```

The map should conceptually represent:

* Chittagong area
* Karnaphuli River
* Hills
* Coast
* Visited locations

The exact map technology and visual style are TBD.

---

## 6.6 Journal / Stories

Purpose:

Introduce the latest or featured journal entries.

Homepage displays selected content only.

CTA:

```text
View Journal
```

Links to:

```text
/journal
```

---

## 6.7 Food

Purpose:

Introduce Chittagong's food culture through personal observation and storytelling.

Potential topics:

* Mezbani
* Kala Bhuna
* Shutki
* Street food
* Local food experiences

These are examples, not final content.

CTA:

```text
Explore Food
```

Links to:

```text
/food
```

---

## 6.8 Unedited Gallery

Purpose:

Create a visual journal layer.

Characteristics:

* Minimal text
* Strong photography
* Location may be shown
* No requirement for long captions

This section should feel less curated/editorial than the Journal.

The exact gallery implementation is TBD.

---

## 6.9 About / Personal Sign-off

Purpose:

End the homepage with a personal human connection.

Possible content:

* Why Chittagong Trail exists
* Who is behind it
* What the project documents
* Personal closing statement

Links to:

```text
/about
```

---

## 6.10 Footer

Footer contains:

```text
Chittagong Trail

Explore
├── Trails
├── Journal
├── Food
└── About

Follow
├── Facebook
├── Instagram
└── YouTube

Contact
└── Email

Copyright
```

Exact copy is TBD.

---

# 7. Trails Architecture

## `/trails`

Purpose:

Provide an index of places explored through Chittagong Trail.

Structure:

```text
Trails
│
├── Introduction
│
├── Featured Trail
│
├── All Trail Locations
│
└── Map / Explore CTA
```

---

## `/trails/[slug]`

Individual Trail page.

Structure:

```text
Trail Detail
│
├── Hero
├── Location introduction
├── Story / description
├── Useful location information
├── Photo gallery
├── Map location
├── Related Journal stories
├── Related Trails
└── Explore another trail
```

### Content definition

A **Trail** represents a physical place/location.

Examples:

```text
Patenga Beach
Batali Hill
Foy's Lake
```

These are location entities, not individual stories.

---

# 8. Journal Architecture

## `/journal`

Purpose:

Index of personal stories and experiences.

Structure:

```text
Journal
│
├── Introduction
├── Featured Story
├── Latest Stories
└── Archive / Pagination
```

---

## `/journal/[slug]`

Individual Journal post.

Structure:

```text
Journal Story
│
├── Cover
├── Title
├── Date
├── Story Content
├── Inline Images
├── Related Trail
├── Related Stories
└── Previous / Next Story
```

### Content definition

A **Journal Post** represents a story, experience, observation, or journey.

One Trail may have many Journal Posts.

Example:

```text
Patenga Beach
│
├── Winter Evening at Patenga
├── Walking Along the Shore
└── When the Beach Gets Quiet
```

---

# 9. Food Architecture

## `/food`

Structure:

```text
Food
│
├── Introduction
├── Featured Food Story
├── Food Stories
└── More
```

---

## `/food/[slug]`

Structure:

```text
Food Story
│
├── Hero
├── Food introduction
├── Personal story
├── Photos
├── Context / place
├── Related Journal
└── More Chittagong Food
```

### Important

The database implementation of Food is NOT finalized.

Possible future approaches:

1. Separate `Food` model
2. Food as a Journal category/type
3. Another content structure

Do not create a new database model until the existing database and content requirements have been reviewed.

---

# 10. About Architecture

## `/about`

Structure:

```text
About
│
├── Chittagong Trail
├── Why this journal exists
├── Person behind the trail
├── What gets documented
├── Philosophy / approach
└── Social links
```

The About page should maintain the personal/journal character of the brand.

---

# 11. Map Architecture

There is no required standalone `/map` page in the initial architecture.

Primary usage:

```text
Homepage
 ↓
Interactive Map
 ↓
Pin
 ↓
Trail Page
```

And:

```text
Trails
 ↓
Map
 ↓
Trail Page
```

The map is primarily a discovery and navigation mechanism.

---

# 12. Content Relationships

The core content relationship is:

```text
TrailLocation
      ↕
 JournalPost
```

A Trail can have multiple Journal Posts.

Example:

```text
Patenga Beach
│
├── Location data
├── Coordinates
├── Photos
│
├── Journal
│   ├── Story A
│   └── Story B
│
└── Related Trails
```

Future relationships may include:

```text
Trail
 ↕
Journal
 ↕
Food
 ↕
Gallery
```

Do not over-engineer these relationships until the actual content requirements are known.

---

# 13. URL Architecture

Public URLs:

```text
/
 /trails
 /trails/[slug]

 /journal
 /journal/[slug]

 /food
 /food/[slug]

 /about
```

Examples:

```text
/trails/patenga-beach

/journal/winter-evening-at-patenga

/food/mezbani
```

URLs should be:

* Short
* Readable
* Stable
* SEO-friendly
* Based on clean slugs

---

# 14. Admin Architecture

Admin is separate from the public information architecture.

Initial structure:

```text
/admin
│
├── Dashboard
│
├── Journal
│   ├── List
│   ├── Create
│   ├── Edit
│   └── Delete
│
└── Trails
    ├── List
    ├── Create
    ├── Edit
    └── Delete
```

Routes:

```text
/admin
/admin/journal
/admin/journal/new
/admin/journal/[id]/edit

/admin/trails
/admin/trails/new
/admin/trails/[id]/edit
```

Authentication:

Lightweight single-user authentication.

No heavy CMS.

Admin design is a later phase.

---

# 15. Visitor Journeys

## 15.1 Location-driven visitor

```text
Search / Google
      ↓
Trail Page
      ↓
Photos / Information
      ↓
Related Journal
      ↓
Another Trail
```

---

## 15.2 Story-driven visitor

```text
Search / Social
      ↓
Journal Post
      ↓
Related Trail
      ↓
Trail Page
      ↓
Other Stories
```

---

## 15.3 Homepage visitor

```text
Home
 ↓
Trails
 ↓
Map
 ↓
Journal
 ↓
Food
 ↓
About
```

---

## 15.4 Social visitor

```text
Facebook / Instagram / YouTube
      ↓
Specific Trail or Journal URL
      ↓
Related content
      ↓
Further exploration
```

---

# 16. SEO Architecture Foundation

The structure must support:

* Dynamic metadata
* Dynamic journal metadata
* Dynamic trail metadata
* Meta title
* Meta description
* OG image
* Twitter/X card metadata
* Canonical URLs
* XML sitemap
* robots.txt
* BreadcrumbList
* Article structured data
* TouristAttraction / appropriate local-place structured data
* Proper H1/H2 hierarchy
* Image alt text
* Internal linking
* Related Trail ↔ Journal links
* Clean slugs
* Mobile-first structure

Implementation will happen later.

The current phase only establishes an architecture capable of supporting these requirements.

---

# 17. Content Types — Initial Direction

Core:

```text
TrailLocation
JournalPost
```

Potential supporting content:

```text
Food
Gallery
Media
```

Food and Gallery database implementation remain TBD.

Do not create unnecessary models before actual requirements are confirmed.

---

# 18. 404

A branded 404 page will exist.

Concept:

```text
404

This trail doesn't seem to exist.

Back to Chittagong Trail
```

Final copy is TBD.

---

# 19. Global Rules

### Rule 1 — Structure before design

Do not make visual design decisions during this phase.

### Rule 2 — Database safety

Do not modify the existing MySQL database structure during this phase.

### Rule 3 — No unnecessary content models

Only create database structures when there is a confirmed requirement.

### Rule 4 — Stable URLs

Do not casually change the URL architecture after implementation begins.

### Rule 5 — Content relationships matter

Trail and Journal should remain clearly distinct:

**Trail = Place**

**Journal = Story / Experience**

### Rule 6 — Homepage is a journey

Homepage sections should lead visitors naturally toward deeper content.

### Rule 7 — Personal, not corporate

All future content and UX decisions should preserve the personal-journal character.

---

# 20. Provisional Decisions

The following decisions are currently proposed but not permanently locked:

* Seasonal/Mood section
* Exact Food architecture
* Exact Gallery architecture
* Standalone map page
* Final content taxonomy
* Final database relationships beyond core Trail ↔ Journal
* Exact admin feature set

These should be reviewed before implementation.

---

# 21. Locked Direction

The following are currently considered strong structural decisions:

```text
Public:
/
 /trails
 /trails/[slug]
 /journal
 /journal/[slug]
 /food
 /food/[slug]
 /about

Core content:
TrailLocation
JournalPost

Primary navigation:
Trails
Journal
Food
About

Core relationship:
Trail = Place
Journal = Story

Map:
Discovery/navigation layer

Admin:
Separate lightweight /admin area

Brand:
Chittagong Trail
```

These remain subject to final human approval before being treated as immutable.

---

# 22. Next Phase

Once this structure is approved, the next phase is:

## PHASE 3 — CONTENT ARCHITECTURE + WIREFRAMES

The next phase should define:

* What information each page needs
* What content appears above/below the fold
* Card information
* Trail page information hierarchy
* Journal page information hierarchy
* Food page information hierarchy
* Image requirements
* CTA hierarchy
* Mobile structure
* Desktop structure

Wireframes should remain low-fidelity.

Do NOT introduce final:

* Colors
* Fonts
* Typography
* Visual effects
* Animation
* GSAP storytelling

until the wireframe/content structure is approved.

---

# 23. Approval Gate

This document is not considered final until the project owner approves it.

After approval:

```text
STRUCTURE
    ↓
APPROVED
    ↓
WIREFRAME
    ↓
APPROVED
    ↓
VISUAL DESIGN
```

Do not skip the approval gates.

---

# 24. Final Principle

Chittagong Trail should not be built as a collection of disconnected pages.

It should work as a connected exploration system:

```text
PLACE
 ↓
STORY
 ↓
PHOTO
 ↓
MAP
 ↓
RELATED PLACE
 ↓
ANOTHER STORY
```

The website should encourage visitors to keep exploring Chittagong through the founder's perspective.

**Structure first.
Design second.
Animation third.
Implementation after approval.**
