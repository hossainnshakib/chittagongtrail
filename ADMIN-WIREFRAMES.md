# ADMIN-WIREFRAMES.md

## Chittagong Trail — Admin Low-Fidelity Wireframes

**Phase:** A7R.1 — Planning and Structural Documentation
**Date:** 2026-08-30
**Scope:** Documentation only. No code changes.

---

## Conventions

- `┌──┐└──┘` = Card/container borders
- `[ ]` = Interactive element (button, input, link)
- `[文字]` = Text label or content
- `■` = Icon placeholder
- `●` = Active/selected indicator
- `○` = Inactive indicator
- `═══` = Divider
- Indentation = nesting hierarchy
- `[→]` = Collapsed section
- `[▼]` = Expanded section

---

## 1. Desktop Admin Shell (≥1024px)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ■ CT Trail    [Breadcrumbs: Dashboard]              [View Site] [⋯] │
├──────────┬──────────────────────────────────────────────────────────┤
│          │                                                          │
│ ● Dashboard│   [Page Title]                          [+ Primary]    │
│          │                                                          │
│ ▼ Content │   [Page content area — scrollable]                     │
│   ● Trails│                                                         │
│   ○ Journal                                                          │
│   ○ Food  │                                                         │
│          │                                                          │
│ ▼ Media   │                                                         │
│   ○ Library│                                                        │
│          │                                                          │
│ ▼ Homepage│                                                         │
│   ○ Overview│                                                       │
│   ○ Hero  │                                                         │
│   ○ Featured                                                         │
│     Trails│                                                         │
│     Stories                                                          │
│     Food  │                                                         │
│   ○ Seasonal                                                         │
│   ○ Gallery│                                                        │
│          │                                                          │
│ ▼ Settings                                                          │
│   ○ General                                                          │
│   ○ About                                                           │
│   ○ Contact                                                          │
│   ○ Footer                                                          │
│          │                                                          │
│══════════│                                                          │
│ ■ Logout │                                                          │
│          │                                                          │
├──────────┤                                                          │
│ 260px    │                                                          │
│ expanded │                                                          │
└──────────┴──────────────────────────────────────────────────────────┘
```

### 1.1 Collapsed Sidebar (1024-1439px)

```
┌─────┬───────────────────────────────────────────────────────────────┐
│     │                                                               │
│ ■   │   [Breadcrumbs]                              [View Site] [⋯] │
│     │                                                               │
│ ●   │   [Page Title]                                [+ Primary]    │
│     │                                                               │
│ ▼   │   [Page content area]                                       │
│ ●   │                                                               │
│ ○   │                                                               │
│ ○   │                                                               │
│     │                                                               │
│ ▼   │                                                               │
│ ○   │                                                               │
│     │                                                               │
│ ▼   │                                                               │
│ ○   │                                                               │
│ ○   │                                                               │
│ ○   │                                                               │
│ ○   │                                                               │
│ ○   │                                                               │
│ ○   │                                                               │
│     │                                                               │
│ ▼   │                                                               │
│ ○   │                                                               │
│ ○   │                                                               │
│ ○   │                                                               │
│ ○   │                                                               │
│     │                                                               │
│═════│                                                               │
│ ■   │                                                               │
│     │                                                               │
├─────┤                                                               │
│64px │                                                               │
│icons│                                                               │
│only │                                                               │
└─────┴───────────────────────────────────────────────────────────────┘
```

**Tooltip on hover:** Shows full label text in a small popup next to the icon.

### 1.2 Mobile Admin Navigation (768px and below)

```
┌─────────────────────────────────────┐
│ ☰  CT Trail              [View Site]│
├─────────────────────────────────────┤
│                                     │
│   [Page content area]              │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
└─────────────────────────────────────┘

When ☰ tapped → Slide-in drawer:
┌─────────────────────────────────────┐
│ ■ Chittagong Trail Admin      [✕]  │
│═════════════════════════════════════│
│ ● Dashboard                         │
│                                     │
│ ▼ Content                         │
│   ● Trails                          │
│   ○ Journal                         │
│   ○ Food                            │
│                                     │
│ ▼ Media                             │
│   ○ Library                         │
│                                     │
│ ▼ Homepage                          │
│   ○ Overview                        │
│   ○ Hero                            │
│   ○ Featured Trails                 │
│   ○ Featured Stories                │
│   ○ Featured Food                   │
│   ○ Seasonal / Mood                 │
│   ○ Gallery                         │
│                                     │
│ ▼ Site Settings                     │
│   ○ General                         │
│   ○ Introduction / About            │
│   ○ Contact & Social                │
│   ○ Footer                          │
│                                     │
│═════════════════════════════════════│
│ ■ View Site                         │
│ ■ Logout                            │
└─────────────────────────────────────┘
```

---

## 2. Login Page

```
┌─────────────────────────────────────────────────┐
│                                                 │
│                                                 │
│            Chittagong Trail                     │
│            Admin Dashboard                      │
│                                                 │
│   ┌───────────────────────────────────────┐     │
│   │                                       │     │
│   │   Sign In                             │     │
│   │                                       │     │
│   │   [Error message if failed]           │     │
│   │                                       │     │
│   │   Email                               │     │
│   │   ┌─────────────────────────────┐     │     │
│   │   │ admin@chittagongtrail.com   │     │     │
│   │   └─────────────────────────────┘     │     │
│   │                                       │     │
│   │   Password                            │     │
│   │   ┌─────────────────────────────┐     │     │
│   │   │ ••••••••                    │     │     │
│   │   └─────────────────────────────┘     │     │
│   │                                       │     │
│   │   ┌─────────────────────────────┐     │     │
│   │   │        Sign In              │     │     │
│   │   └─────────────────────────────┘     │     │
│   │                                       │     │
│   └───────────────────────────────────────┘     │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 3. Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   Dashboard                                                         │
│   Welcome back. Here's your content overview.                       │
│                                                                     │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │
│   │ ■ 12         │ │ ■ 8          │ │ ■ 4          │               │
│   │ Total Trails │ │ Pub. Trails  │ │ Draft Trails │               │
│   └──────────────┘ └──────────────┘ └──────────────┘               │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │
│   │ ■ 15         │ │ ■ 6          │ │ ■ 42         │               │
│   │ Stories      │ │ Food Posts   │ │ Media Assets │               │
│   └──────────────┘ └──────────────┘ └──────────────┘               │
│                                                                     │
│   [+ New Trail]  [+ New Story]  [+ New Food]  [Media Library →]    │
│                                                                     │
│   ┌─────────────────────────────┐ ┌─────────────────────────────┐   │
│   │ Recent Content              │ │ Homepage Status              │   │
│   │═════════════════════════════│ │═════════════════════════════│   │
│   │                             │ │                              │   │
│   │ ■ Trail: Patenga Beach     │ │ ■ Hero          [Complete]  │   │
│   │   /patenga-beach  2d ago   │ │   Title + poster set         │   │
│   │   [Edit] [Preview]         │ │   [Edit Hero →]              │   │
│   │                             │ │                              │   │
│   │ ■ Trail: Rangamati Lake   │ │ ■ Featured Trails  3/4      │   │
│   │   /rangamati-lake  5d ago  │ │   [Manage →]                 │   │
│   │   [Edit] [Preview]         │ │                              │   │
│   │                             │ │ ■ Featured Stories  2/3     │   │
│   │ ■ Story: Monsoon Journal  │ │   [Manage →]                 │   │
│   │   /monsoon-journal  1w ago │ │                              │   │
│   │   [Edit] [Preview]         │ │ ■ Featured Food  1/3        │   │
│   │                             │ │   [Manage →]                 │   │
│   │ ■ Food: Hill Tribe Cuisine│ │                              │   │
│   │   /hill-tribe-cuisine 2w   │ │ ■ Gallery  5/8 items        │   │
│   │   [Edit] [Preview]         │ │   [Manage →]                 │   │
│   │                             │ │                              │   │
│   │ ■ Story: Cox's Bazar Dawn │ │ ⚠ Seasonal: No image set    │   │
│   │   /cox-bazar-dawn  3w ago  │ │   [Edit →]                   │   │
│   │   [Edit] [Preview]         │ │                              │   │
│   │                             │ │                              │   │
│   │ [View All Trails →]        │ │                              │   │
│   │ [View All Journal →]       │ │                              │   │
│   └─────────────────────────────┘ └─────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Trails List

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   Trails Management                    [+ New Trail]                │
│   12 total trails found                                                   │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │ Search: [Search trails...        ]                          │   │
│   │ District: [All Districts ▼]  Status: [All Statuses ▼]      │   │
│   │ Featured: [All Featured ▼]     [Filter & Sort] [Reset]      │   │
│   │ Sort: [Updated Date ▼] [Descending ▼]                       │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │ NAME/SLUG      DISTRICT    STATUS    FEATURED  UPDATED     │   │
│   │═════════════════════════════════════════════════════════════│   │
│   │ Patenga Beach  Chittagong  ● Pub     ★ #1      Aug 28      │   │
│   │ /patenga-beach                                               │   │
│   │                                  3 posts  [Edit][Preview]   │   │
│   │─────────────────────────────────────────────────────────────│   │
│   │ Rangamati Lake Rangamati   ○ Draft   —          Aug 25      │   │
│   │ /rangamati-lake                                              │   │
│   │                                  1 post   [Edit][Preview]   │   │
│   │─────────────────────────────────────────────────────────────│   │
│   │ Cox's Bazar    Cox's Bazar  ● Pub     ★ #2      Aug 20      │   │
│   │ /coxs-bazar                                                  │   │
│   │                                  5 posts  [Edit][Preview]   │   │
│   │                                  [View Public →]             │   │
│   │─────────────────────────────────────────────────────────────│   │
│   │ Bandarban Peak Bandarban   ◐ Arch    —          Aug 15      │   │
│   │ /bandarban-peak                                              │   │
│   │                                  0 posts  [Edit][Preview]   │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│   Page 1 of 1                    [Previous] [Next]                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.1 Trails List — Mobile View

```
┌─────────────────────────────────────┐
│ ☰  Trails              [+ New]      │
│ 12 trails                           │
│                                     │
│ [Search trails...        ] [Filter] │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Patenga Beach         ● Published│ │
│ │ /patenga-beach                  │ │
│ │─────────────────────────────────│ │
│ │ Chittagong  ·  3 journal posts │ │
│ │─────────────────────────────────│ │
│ │           [Edit] [Preview]      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Rangamati Lake        ○ Draft   │ │
│ │ /rangamati-lake                 │ │
│ │─────────────────────────────────│ │
│ │ Rangamati  ·  1 journal post   │ │
│ │─────────────────────────────────│ │
│ │           [Edit] [Preview]      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Page 1 of 1                         │
└─────────────────────────────────────┘
```

---

## 5. Journal/Food List

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   Journal & Food Management             [+ New Post]                │
│   Total: 21 (15 Stories, 6 Food) · Published: 14 · Drafts: 5       │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │ [● All (21)] [○ Stories (15)] [○ Food (6)]                 │   │
│   │═════════════════════════════════════════════════════════════│   │
│   │ Search: [Search title, slug...    ]                         │   │
│   │ Status: [All Statuses ▼]  Trail: [All Trails ▼]            │   │
│   │                              [Filter] [Reset]              │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │ TITLE          TYPE   STATUS  FEATURED  TRAIL    ACTIONS    │   │
│   │═════════════════════════════════════════════════════════════│   │
│   │ Monsoon Journal Story  ● Pub   ★ #1     Patenga  [Edit]    │   │
│   │ /monsoon-journal                              [Preview]    │   │
│   │                                        Aug 28   [View Live] │   │
│   │─────────────────────────────────────────────────────────────│   │
│   │ Hill Tribe Food   ● Pub   ★ #2     —        [Edit]         │   │
│   │ Cuisine /hill-tri...                              [Preview] │   │
│   │                                        Aug 25   [View Live] │   │
│   │─────────────────────────────────────────────────────────────│   │
│   │ Cox's Bazar Story  ○ Draft  —        Cox's    [Edit]        │   │
│   │ Dawn /coxs-bazar-...                           [Preview]   │   │
│   │                                        Aug 20               │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│   Showing page 1 of 2 (21 total)      [Previous] [Next]            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Content Editor (Trail / Journal / Food)

### 6.1 Desktop Editor — Trail

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   Edit Trail: Patenga Beach                                         │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │ ■ Basic Information                                         │   │
│   │                                                             │   │
│   │ Name *                    Slug *                            │   │
│   │ ┌───────────────────────┐ ┌───────────────────────┐ [Gen]  │   │
│   │ │ Patenga Beach         │ │ patenga-beach          │        │   │
│   │ └───────────────────────┘ └───────────────────────┘         │   │
│   │                                                             │   │
│   │ District *              Status *                            │   │
│   │ ┌─────────────────────┐ ┌─────────────────────┐            │   │
│   │ │ Chittagong      [▼]│ │ ● Published      [▼]│            │   │
│   │ └─────────────────────┘ └─────────────────────┘            │   │
│   │                                                             │   │
│   │ Administrative Area            Local Area                   │   │
│   │ ┌───────────────────────┐ ┌───────────────────────┐        │   │
│   │ │ Raozan               │ │ Patenga                │        │   │
│   │ └───────────────────────┘ └───────────────────────┘        │   │
│   │                                                             │   │
│   │ Terrain Type            Place Type *                        │   │
│   │ ┌─────────────────────┐ ┌─────────────────────┐            │   │
│   │ │ Coast           [▼]│ │ Tourist Attraction[▼]│            │   │
│   │ └─────────────────────┘ └─────────────────────┘            │   │
│   │                                                             │   │
│   │ Published Date          Excerpt                             │   │
│   │ ┌─────────────────────┐ ┌───────────────────────────────┐  │   │
│   │ │ 2026-08-28         │ │ A serene beach along the...    │  │   │
│   │ └─────────────────────┘ └───────────────────────────────┘  │   │
│   │                                                             │   │
│   │ Description * (Rich Text)                    [342 chars]   │   │
│   │ ┌───────────────────────────────────────────────────────┐  │   │
│   │ │ [B] [I] [H2] [H3] [Link] [List] [Quote] [Media]      │  │   │
│   │ │───────────────────────────────────────────────────────│  │   │
│   │ │ Patenga Beach is one of the most popular...           │  │   │
│   │ │                                                       │  │   │
│   │ │ The beach stretches along the Bay of Bengal...        │  │   │
│   │ │                                                       │  │   │
│   │ └───────────────────────────────────────────────────────┘  │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │ ■ Location Coordinates                                      │   │
│   │ Latitude                       Longitude                    │   │
│   │ ┌───────────────────────┐ ┌───────────────────────┐        │   │
│   │ │ 22.2333              │ │ 91.7833               │        │   │
│   │ └───────────────────────┘ └───────────────────────┘        │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │ ■ Media & Curation                                          │   │
│   │                                                             │   │
│   │ Cover Image                                                 │   │
│   │ ┌──────────────┐  [Select Media]  [Replace]  [Unlink]      │   │
│   │ │              │                                            │   │
│   │ │   Preview    │  Selected: patenga-cover.jpg               │   │
│   │ │   320×200    │  Alt: "Patenga Beach at sunset"           │   │
│   │ │              │                                            │   │
│   │ └──────────────┘                                            │   │
│   │                                                             │   │
│   │ OG Image (Social Share)                                     │   │
│   │ ┌──────────────┐  [Select Media]  [Replace]  [Unlink]      │   │
│   │ │   Preview    │  Not selected                             │   │
│   │ └──────────────┘                                            │   │
│   │                                                             │   │
│   │ ☑ Feature on Homepage     Featured Order: [1 ▼]             │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │ ■ SEO                                                      │   │
│   │ Meta Title                                                   │   │
│   │ ┌───────────────────────────────────────────────────────┐   │   │
│   │ │ Patenga Beach - Chittagong Trail                      │   │   │
│   │ └───────────────────────────────────────────────────────┘   │   │
│   │ Meta Description                                            │   │
│   │ ┌───────────────────────────────────────────────────────┐   │   │
│   │ │ Discover Patenga Beach, a serene coastal trail...     │   │   │
│   │ └───────────────────────────────────────────────────────┘   │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │ [Preview in new tab]                                        │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │                        Unsaved changes   [Discard]  [Save]      │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Content Editor — Mobile View

```
┌─────────────────────────────────────┐
│ ☰  Edit Trail: Patenga Beach  [⋯]  │
│                                     │
│ ■ Basic Information                 │
│                                     │
│ Name *                              │
│ ┌─────────────────────────────────┐ │
│ │ Patenga Beach                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Slug *                   [Generate] │
│ ┌─────────────────────────────────┐ │
│ │ patenga-beach                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ District *                          │
│ ┌─────────────────────────────────┐ │
│ │ Chittagong                   [▼]│ │
│ └─────────────────────────────────┘ │
│                                     │
│ Status *                            │
│ ┌─────────────────────────────────┐ │
│ │ ● Published                  [▼]│ │
│ └─────────────────────────────────┘ │
│                                     │
│ ... (remaining fields) ...          │
│                                     │
│ Cover Image                         │
│ ┌─────────────────────────────────┐ │
│ │ [Preview thumbnail]             │ │
│ │ patenga-cover.jpg               │ │
│ └─────────────────────────────────┘ │
│ [Select Media]                      │
│                                     │
│ ☑ Feature on Homepage              │
│ Featured Order: [1 ▼]              │
│                                     │
│ [Preview]                           │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ● Unsaved    [Discard]  [Save] │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 7. Media Library

### 7.1 Desktop Media Library

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   Media Library                                                     │
│   Manage Cloudinary assets, alt texts, references. Total: 42        │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │ Upload New Media Asset                                      │   │
│   │                                                             │   │
│   │ File: [Choose File]  Folder: [chittagong-trail/trails  [▼]]│   │
│   │ Alt Text: [Describe image for accessibility     ]           │   │
│   │ [Upload Asset]                                              │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │ [Search by public ID...       ] [Search]                    │   │
│   │ Format: [All Formats ▼]  Folder: [All Folders ▼]            │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│   │ ┌──────┐ │ │ ┌──────┐ │ │ ┌──────┐ │ │ ┌──────┐ │             │
│   │ │ img  │ │ │ │ img  │ │ │ │ img  │ │ │ │ img  │ │             │
│   │ │      │ │ │ │      │ │ │ │      │ │ │ │      │ │             │
│   │ └──────┘ │ │ └──────┘ │ │ └──────┘ │ │ └──────┘ │             │
│   │ trail/pa │ │ trail/co │ │ journal  │ │ general  │             │
│   │ "Beach   │ │ "Cox's   │ │ "Food    │ │ "Site    │             │
│   │  sunset" │ │  view"   │ │  spread" │ │  hero"   │             │
│   │ 1200×800 │ │ 1920×1080│ │ 800×600  │ │ 2560×1440│             │
│   │ JPG · 3  │ │ JPG · 1  │ │ PNG · 0  │ │ WEBP · 2 │             │
│   └──────────┘ └──────────┘ └──────────┘ └──────────┘             │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│   │ ┌──────┐ │ │ ┌──────┐ │ │ ┌──────┐ │ │ ┌──────┐ │             │
│   │ │ img  │ │ │ │ img  │ │ │ │ img  │ │ │ │ img  │ │             │
│   │ │      │ │ │ │      │ │ │ │      │ │ │ │      │ │             │
│   │ └──────┘ │ │ └──────┘ │ │ └──────┘ │ │ └──────┘ │             │
│   │ trail/ra │ │ trail/ba │ │ journal  │ │ general  │             │
│   │ "Lake    │ │ "Hill    │ │ "Tea     │ │ "About   │             │
│   │  view"   │ │  trail"  │ │  garden" │ │  photo"  │             │
│   └──────────┘ └──────────┘ └──────────┘ └──────────┘             │
│                                                                     │
│   Page 1 of 2               [Previous] [Next]                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 Media Detail Modal

```
┌─────────────────────────────────────────────────────────────┐
│ Media Details                                    [✕ Close]  │
│═════════════════════════════════════════════════════════════│
│                                                             │
│  ┌──────────────────────┐   Public ID:                     │
│  │                      │   chittagong-trail/trails/patenga │
│  │     [Full Image      │                                  │
│  │      Preview]        │   Secure URL:                    │
│  │                      │   ┌──────────────────────┐ [Copy]│
│  │                      │   │ https://res.cloud... │        │
│  └──────────────────────┘   └──────────────────────┘        │
│                                                             │
│  Dimensions: 1200 × 800    Format: JPG                     │
│                                                             │
│═════════════════════════════════════════════════════════════│
│ Alt Text (Accessibility)                                   │
│ ┌──────────────────────────────────────────────┐ [Save Alt]│
│ │ Patenga Beach at sunset with golden light    │           │
│ └──────────────────────────────────────────────┘           │
│ Meaningful images need descriptive alt text.              │
│                                                             │
│═════════════════════════════════════════════════════════════│
│ Reference Summary                                          │
│ ┌──────────────────────────────────────────────┐           │
│ │ Trail Covers: Patenga Beach, Cox's Bazar     │           │
│ │ Journal Covers: Monsoon Journal               │           │
│ │ Homepage Galleries: 1 item(s)                 │           │
│ │ Site Hero Media: Yes                          │           │
│ │ ✓ No inline HTML references                   │           │
│ └──────────────────────────────────────────────┘           │
│                                                             │
│═════════════════════════════════════════════════════════════│
│ [View on Cloudinary ↗]     [Delete Asset]     [Done]       │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Media Picker (Reusable Modal)

```
┌─────────────────────────────────────────────────────────────┐
│ Select Media                                    [✕ Close]  │
│═════════════════════════════════════════════════════════════│
│                                                             │
│ ┌──────────────────────────────────┐  [Upload New]          │
│ │ [Search media...              ]  │                        │
│ └──────────────────────────────────┘                        │
│ Format: [All ▼]  Folder: [All ▼]                           │
│                                                             │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                │
│ │ ┌────┐ │ │ ┌────┐ │ │ ┌────┐ │ │ ┌────┐ │                │
│ │ │    │ │ │ │    │ │ │ │    │ │ │ │    │ │                │
│ │ └────┘ │ │ └────┘ │ │ └────┘ │ │ └────┘ │                │
│ │ beach  │ │ lake   │ │ food   │ │ hero   │                │
│ │ 1200×  │ │ 1920×  │ │ 800×   │ │ 2560×  │                │
│ │ 800    │ │ 1080   │ │ 600    │ │ 1440   │                │
│ └────────┘ └────────┘ └────────┘ └────────┘                │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                │
│ │ ┌────┐ │ │ ┌────┐ │ │ ┌────┐ │ │ ┌────┐ │                │
│ │ │ ●✓ │ │ │ │    │ │ │ │    │ │ │ │    │ │                │
│ │ └────┘ │ │ └────┘ │ │ └────┘ │ │ └────┘ │                │
│ │ select │ │ hill   │ │ tea    │ │ about  │                │
│ │ ────── │ │ 1600×  │ │ 800×   │ │ 1200×  │                │
│ │ 1200×  │ │ 900    │ │ 533    │ │ 800    │                │
│ │ 800    │ │        │ │        │ │        │                │
│ └────────┘ └────────┘ └────────┘ └────────┘                │
│                                                             │
│ Selected: patenga-beach.jpg (1200×800)                     │
│                                                             │
│═════════════════════════════════════════════════════════════│
│                            [Cancel]  [Confirm Selection]    │
└─────────────────────────────────────────────────────────────┘
```

### 8.1 Media Picker — With Current Asset

```
┌─────────────────────────────────────────────────────────────┐
│ Select Media                                    [✕ Close]  │
│═════════════════════════════════════════════════════════════│
│ Current: patenga-cover.jpg                                 │
│ ┌──────────┐                                                │
│ │ [thumb]  │  1200×800 · JPG · "Beach sunset"             │
│ └──────────┘  [Unlink]                                     │
│                                                             │
│ ─── Select a different image ───                            │
│                                                             │
│ [Search media...              ]                             │
│ Format: [All ▼]  Folder: [All ▼]                           │
│                                                             │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                │
│ │ ┌────┐ │ │ ┌────┐ │ │ ┌────┐ │ │ ┌────┐ │                │
│ │ │    │ │ │ │    │ │ │ │    │ │ │ │    │ │                │
│ │ └────┘ │ │ └────┘ │ │ └────┘ │ │ └────┘ │                │
│ └────────┘ └────────┘ └────────┘ └────────┘                │
│                                                             │
│═════════════════════════════════════════════════════════════│
│                            [Cancel]  [Confirm Selection]    │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Homepage Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   Homepage Management                                               │
│   Configure all homepage sections from one place.                   │
│                                                                     │
│   ┌─────────────────────────────────┐ ┌─────────────────────────┐   │
│   │ ■ Hero                          │ │ ■ Featured Trails       │   │
│   │   ● Complete                    │ │   ● 3/4 slots used      │   │
│   │   Title + poster configured     │ │                          │   │
│   │   Video: enabled (YouTube)      │ │   1. Patenga Beach      │   │
│   │                                 │ │   2. Cox's Bazar        │   │
│   │   [Edit Hero →]                 │ │   3. Rangamati Lake     │   │
│   └─────────────────────────────────┘ │                          │   │
│                                       │   [Manage Trails →]     │   │
│   ┌─────────────────────────────────┐ └─────────────────────────┘   │
│   │ ■ Featured Stories              │                               │
│   │   ● 2/3 slots used              │ ┌─────────────────────────┐   │
│   │                                 │ │ ■ Featured Food         │   │
│   │   1. Monsoon Journal            │ │   ● 1/3 slots used      │   │
│   │   2. Cox's Bazar Dawn          │ │                          │   │
│   │                                 │ │   1. Hill Tribe Cuisine │   │
│   │   [Manage Stories →]            │ │                          │   │
│   └─────────────────────────────────┘ │   [Manage Food →]       │   │
│                                       └─────────────────────────┘   │
│   ┌─────────────────────────────────┐                               │
│   │ ■ Seasonal / Mood               │ ┌─────────────────────────┐   │
│   │   ○ Incomplete                  │ │ ■ Homepage Gallery      │   │
│   │   Title + content set           │ │   ● 5/8 items           │   │
│   │   ⚠ No image selected           │ │                          │   │
│   │                                 │ │   Slot 1: [img]         │   │
│   │   [Edit Seasonal →]             │ │   Slot 2: [img]         │   │
│   └─────────────────────────────────┘ │   Slot 3: [img]         │   │
│                                       │   Slot 4: [img]         │   │
│                                       │   Slot 5: [img]         │   │
│                                       │   Slot 6: [empty]       │   │
│                                       │   Slot 7: [empty]       │   │
│                                       │   Slot 8: [empty]       │   │
│                                       │                          │   │
│                                       │   [Manage Gallery →]    │   │
│                                       └─────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 10. Hero Editor

### 10.1 Desktop — Two-Column Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   Hero Editor                                                       │
│   Configure the homepage hero section with title, poster, and video.│
│                                                                     │
│   ┌──────────────────────────┐ ┌─────────────────────────────────┐  │
│   │ ■ Content Controls       │ │ ■ Live Preview                  │  │
│   │                          │ │                                 │  │
│   │ Hero Title               │ │ ┌─────────────────────────────┐ │  │
│   │ ┌──────────────────────┐ │ │ │                             │ │  │
│   │ │ Five Districts.      │ │ │ │   [Poster Image / Video]    │ │  │
│   │ │ Hills to the Sea.    │ │ │ │                             │ │  │
│   │ │ *One Chittagong.*    │ │ │ │   Five Districts.           │ │  │
│   │ └──────────────────────┘ │ │ │   Hills to the Sea.         │ │  │
│   │ Use *text* for italic    │ │ │   One Chittagong.           │  │
│   │                          │ │ │                             │  │
│   │ Supporting Paragraph     │ │ │   From the city and the     │  │
│   │ ┌──────────────────────┐ │ │ │   Karnaphuli to the coast...│  │
│   │ │ From the city and    │ │ │ │                             │  │
│   │ │ the Karnaphuli to    │ │ │ └─────────────────────────────┘ │  │
│   │ │ the coast...         │ │ │                                 │  │
│   │ └──────────────────────┘ │ │ [● Desktop] [○ Mobile]          │  │
│   │                          │ │                                 │  │
│   │ Hero Poster / Cover      │ │ Mobile Preview:                 │  │
│   │ ┌────────────┐           │ │ ┌───────────────┐               │  │
│   │ │            │           │ │ │               │               │  │
│   │ │  Preview   │           │ │ │ [Poster /     │               │  │
│   │ │  320×200   │           │ │ │  Video]       │               │  │
│   │ │            │           │ │ │               │               │  │
│   │ └────────────┘           │ │ │ Five          │               │  │
│   │ [Select Media] [Unlink]  │ │ │ Districts.    │               │  │
│   │ Poster shows while       │ │ │               │               │  │
│   │ video loads or when      │ │ └───────────────┘               │  │
│   │ video is disabled.       │ │                                 │  │
│   │                          │ │                                 │  │
│   │ ☑ Enable Video           │ │                                 │  │
│   │                          │ │                                 │  │
│   │ Video Provider           │ │                                 │  │
│   │ ┌─────────────────────┐  │ │                                 │  │
│   │ │ YouTube          [▼]│  │ │                                 │  │
│   │ └─────────────────────┘  │ │                                 │  │
│   │                          │ │                                 │  │
│   │ Video URL                │ │                                 │  │
│   │ ┌──────────────────────┐ │ │                                 │  │
│   │ │ https://youtube.com/ │ │ │                                 │  │
│   │ │ watch?v=XXXXXXXXXXX  │ │ │                                 │  │
│   │ └──────────────────────┘ │ │                                 │  │
│   │ Accepts youtube.com/     │ │                                 │  │
│   │ watch?v=, youtu.be/ URLs │ │                                 │  │
│   │                          │ │                                 │  │
│   │ Overlay Darkness: 45%    │ │                                 │  │
│   │ ┌──────────────────────┐ │ │                                 │  │
│   │ │ ████████░░░░░░░░░░░░ │ │ │                                 │  │
│   │ └──────────────────────┘ │ │                                 │  │
│   │ Higher = darker overlay  │ │                                 │  │
│   │                          │ │                                 │  │
│   │ ⚠ Mobile fallback:       │ │                                 │  │
│   │ Poster shown on reduced- │ │                                 │  │
│   │ motion or unsupported    │ │                                 │  │
│   │ browsers.                │ │                                 │  │
│   └──────────────────────────┘ └─────────────────────────────────┘  │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │                            Unsaved changes   [Discard]  [Save]  │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 11. Featured Content Curation (Trails example)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   Featured Trails                                                   │
│   Manage which trails appear on the homepage. Maximum 4.            │
│                                                                     │
│   3 of 4 slots used                                                 │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │ ORDER  TRAIL                STATUS     ACTIONS              │   │
│   │═════════════════════════════════════════════════════════════│   │
│   │ 1  [▲][▼]  Patenga Beach    ● Published  [Remove]          │   │
│   │      Cover: ✓  Excerpt: ✓                                   │   │
│   │─────────────────────────────────────────────────────────────│   │
│   │ 2  [▲][▼]  Cox's Bazar      ● Published  [Remove]          │   │
│   │      Cover: ✓  Excerpt: ✓                                   │   │
│   │─────────────────────────────────────────────────────────────│   │
│   │ 3  [▲][▼]  Rangamati Lake   ○ Draft      [Remove]          │   │
│   │      Cover: ✓  Excerpt: ⚠ Missing                          │   │
│   │      ⚠ Draft content — will not appear publicly             │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│   [+ Add Trail]  (opens Trail Picker modal)                        │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │ Preview: These trails appear in the DestinationsGrid        │   │
│   │ section of the homepage in the order shown above.           │   │
│   │ [Preview Homepage →]                                        │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │                            Unsaved changes   [Discard]  [Save]  │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 12. Site Settings — General

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   Site Settings: General                                            │
│   Configure your site's brand identity.                             │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                                                             │   │
│   │ Site Name *                                                 │   │
│   │ ┌───────────────────────────────────────────────────────┐   │   │
│   │ │ Chittagong Trail                                       │   │   │
│   │ └───────────────────────────────────────────────────────┘   │   │
│   │ The name displayed in the header, browser tab, and          │   │
│   │ social shares.                                              │   │
│   │                                                             │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │                            Unsaved changes   [Discard]  [Save]  │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 13. Site Settings — Contact & Social

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   Site Settings: Contact & Social                                   │
│   Manage public contact information and social media links.         │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                                                             │   │
│   │ Contact Email                                               │   │
│   │ ┌───────────────────────────────────────────────────────┐   │   │
│   │ │ hello@chittagongtrail.com                              │   │   │
│   │ └───────────────────────────────────────────────────────┘   │   │
│   │ Displayed in the footer contact section.                    │   │
│   │                                                             │   │
│   │═════════════════════════════════════════════════════════════│   │
│   │                                                             │   │
│   │ Social Links                                                │   │
│   │                                                             │   │
│   │ Facebook URL                                                │   │
│   │ ┌───────────────────────────────────────────────────────┐   │   │
│   │ │ https://facebook.com/chittagongtrail                   │   │   │
│   │ └───────────────────────────────────────────────────────┘   │   │
│   │                                                             │   │
│   │ Instagram URL                                               │   │
│   │ ┌───────────────────────────────────────────────────────┐   │   │
│   │ │ https://instagram.com/chittagongtrail                  │   │   │
│   │ └───────────────────────────────────────────────────────┘   │   │
│   │                                                             │   │
│   │ YouTube URL                                                 │   │
│   │ ┌───────────────────────────────────────────────────────┐   │   │
│   │ │ https://youtube.com/@chittagongtrail                   │   │   │
│   │ └───────────────────────────────────────────────────────┘   │   │
│   │                                                             │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │                            Unsaved changes   [Discard]  [Save]  │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 14. Sticky Save Workflow

### 14.1 Clean State (no changes)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   [Page content]                                                    │
│                                                                     │
│                                                                     │
│                                                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 14.2 Dirty State (unsaved changes)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   [Page content]                                                    │
│                                                                     │
│                                                                     │
│                                                                     │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ ● Unsaved changes                              [Discard]  [Save]   │
└─────────────────────────────────────────────────────────────────────┘
```

### 14.3 Saving State

```
├─────────────────────────────────────────────────────────────────────┤
│ ● Saving...                                    [Discard]  [Saving…]│
└─────────────────────────────────────────────────────────────────────┘
```

### 14.4 Saved State

```
├─────────────────────────────────────────────────────────────────────┤
│ ✓ Saved 2 seconds ago                            [Discard]  [Save] │
└─────────────────────────────────────────────────────────────────────┘
```

### 14.5 Error State

```
├─────────────────────────────────────────────────────────────────────┤
│ ✕ Save failed — please try again                [Retry]  [Save]   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 15. Validation/Error States

### 15.1 Form-Level Error Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │ ✕ Please fix 2 errors before saving:                        │   │
│   │   • Name is required                                        │   │
│   │   • Slug already exists                                      │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│   Name *                                                            │
│   ┌───────────────────────────────────────────────────────┐        │
│   │                                                       │ ← red  │
│   └───────────────────────────────────────────────────────┘ border │
│   ✕ Name is required                                           │
│                                                                     │
│   Slug *                                                            │
│   ┌───────────────────────────────────────────────────────┐        │
│   │ patenga-beach                                         │ ← red  │
│   └───────────────────────────────────────────────────────┘ border │
│   ✕ A trail with this slug already exists                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 15.2 Field-Level Validation (on blur)

```
   Email
   ┌───────────────────────────────────────────┐
   │ not-an-email                             │ ← red border
   └───────────────────────────────────────────┘
   ✕ Please enter a valid email address
```

### 15.3 Success Toast

```
┌─────────────────────────────────────────┐
│ ✓ Trail saved successfully              │
└─────────────────────────────────────────┘
```

### 15.4 Confirmation Dialog (Delete)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │   Delete Trail                                      │   │
│   │                                                     │   │
│   │   Are you sure you want to delete "Patenga Beach"?  │   │
│   │   This action cannot be undone.                     │   │
│   │                                                     │   │
│   │   3 journal posts are linked to this trail.         │   │
│   │   Remove all relationships before deleting.         │   │
│   │                                                     │   │
│   │              [Cancel]          [Delete Trail]       │   │
│   │                              (red button)           │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 16. Empty States

### 16.1 No Content

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │              ■ (illustration)                       │   │
│   │                                                     │   │
│   │        No trails yet.                               │   │
│   │        Create your first trail to get started.      │   │
│   │                                                     │   │
│   │              [+ New Trail]                          │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 16.2 No Results (filters active)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │        No trails found matching your criteria.      │   │
│   │                                                     │   │
│   │              [Clear filters]                        │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 16.3 Loading State

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ ┌────────────────────────────────────────────────┐   │   │
│   │ │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │   │   │
│   │ └────────────────────────────────────────────────┘   │   │
│   │ ┌────────────────────────────────────────────────┐   │   │
│   │ │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │   │   │
│   │ └────────────────────────────────────────────────┘   │   │
│   │ ┌────────────────────────────────────────────────┐   │   │
│   │ │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │   │   │
│   │ └────────────────────────────────────────────────┘   │   │
│   │                                                     │   │
│   │        Loading trails...                            │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 16.4 Error State

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │        ✕ Failed to load trails                      │   │
│   │        Please check your connection and try again.  │   │
│   │                                                     │   │
│   │              [Retry]                                │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

*These wireframes represent the structural and interaction hierarchy for the redesigned Admin panel. They are low-fidelity representations showing layout, content placement, and interaction patterns — not final visual design.*
