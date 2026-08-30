# ADMIN-UX-ARCHITECTURE.md

## Chittagong Trail — Admin Information Architecture & UX Architecture

**Phase:** A7R.1 — Planning and Structural Documentation
**Date:** 2026-08-30
**Scope:** Documentation only. No code changes, no schema changes, no migrations.

---

## 1. Current-State Audit

### 1.1 Verified Existing Routes

| Route | Type | File | Description |
|-------|------|------|-------------|
| `/admin/login` | Auth | `app/admin/(auth)/login/page.tsx` | Email/password login form |
| `/admin` | Protected | `app/admin/(protected)/page.tsx` | Dashboard with basic stats |
| `/admin/trails` | Protected | `app/admin/(protected)/trails/page.tsx` | Trail list with filters |
| `/admin/trails/new` | Protected | `app/admin/(protected)/trails/new/page.tsx` | Create trail form |
| `/admin/trails/[id]/edit` | Protected | `app/admin/(protected)/trails/[id]/edit/page.tsx` | Edit trail form |
| `/admin/trails/[id]/preview` | Protected | `app/admin/(protected)/trails/[id]/preview/page.tsx` | Trail preview (public-style) |
| `/admin/journal` | Protected | `app/admin/(protected)/journal/page.tsx` | Journal/Food list with filters |
| `/admin/journal/new` | Protected | `app/admin/(protected)/journal/new/page.tsx` | Create journal form |
| `/admin/journal/[id]/edit` | Protected | `app/admin/(protected)/journal/[id]/edit/page.tsx` | Edit journal form |
| `/admin/journal/[id]/preview` | Protected | `app/admin/(protected)/journal/[id]/preview/page.tsx` | Journal preview (public-style) |
| `/admin/media` | Protected | `app/admin/(protected)/media/page.tsx` | Media library (upload, list, manage) |
| `/admin/settings` | Protected | `app/admin/(protected)/settings/page.tsx` | Site settings (single massive page) |

### 1.2 Verified Existing Components

| Component | File | Purpose |
|-----------|------|---------|
| `TrailForm` | `components/admin/TrailForm.tsx` | Create/edit trail form (client) |
| `JournalForm` | `components/admin/JournalForm.tsx` | Create/edit journal form (client) |
| `DeleteButton` | `components/admin/DeleteButton.tsx` | Inline delete confirmation |
| `AdminLogoutButton` | `components/admin/AdminLogoutButton.tsx` | Logout button |

### 1.3 Verified Existing Services

| Service | File | Key Functions |
|---------|------|---------------|
| `auth` | `lib/auth.ts` | `createSession`, `verifySession`, `getSession`, `requireAdmin`, `setSessionCookie`, `deleteSessionCookie` |
| `trail-service` | `lib/trail-service.ts` | `listAdminTrails`, `getAdminTrailById`, `getPublicTrails`, `getPublicTrailBySlug`, `getTrailPreviewById`, `countTrailRelations`, `manageTrailGallery` |
| `journal-service` | `lib/journal-service.ts` | `listAdminJournalPosts`, `getAdminJournalPostById`, `getPublicJournalPosts`, `getPublicStoryBySlug`, `getPublicFoodBySlug`, `getJournalPreviewById`, `getRelatedJournalPosts`, `countJournalPostsByTypeAndStatus` |
| `media-service` | `lib/media-service.ts` | `countMediaAssets`, `listAdminMediaAssets`, `getAdminMediaAssetById`, `registerUploadedAsset`, `updateMediaAltText`, `getMediaAssetReferences`, `canDeleteMediaAsset`, `deleteUnreferencedMediaAsset`, `cleanupOrphanCloudinaryAsset` |
| `settings-service` | `lib/settings-service.ts` | `getSiteSettings`, `getAdminSiteSettings`, `updateSiteSettings`, `getPublicSiteSettings`, `initializeSiteSettingsIfMissing`, `validateSiteSettingsMedia` |
| `cloudinary` | `lib/cloudinary.ts` | `getCloudinaryClient`, `ALLOWED_UPLOAD_FOLDERS` |
| `video` | `lib/video.ts` | `resolveVideoUrl` |
| `validation` | `lib/validation.ts` | `sanitizeContent`, `slugSchema`, `trailSchema`, `journalSchema` |

### 1.4 Verified Existing API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/admin/settings` | GET/POST | Load and save site settings |
| `/api/admin/media` | POST | Media actions (delete, updateAltText, getReferences) |
| `/api/admin/media` | GET | Get media asset by ID |
| `/api/admin/media/list` | GET | Paginated media list with filters |
| `/api/admin/delete` | POST | Generic delete (trail/journal) with referential check |
| `/api/upload` | POST | Cloudinary file upload |

### 1.5 Verified Existing Tests

| Test File | Coverage |
|-----------|----------|
| `tests/admin-login-regression.test.ts` | Login flow regression |
| `tests/hero-video-settings.test.ts` | Hero video settings CRUD |
| `tests/homepage-curation.test.ts` | Homepage featured content curation |
| `tests/journal-management.test.ts` | Journal CRUD operations |
| `tests/media-lifecycle.test.ts` | Media upload, reference, delete lifecycle |
| `tests/site-settings.test.ts` | Site settings CRUD |
| `tests/trail-management.test.ts` | Trail CRUD operations |

### 1.6 Prisma Models

| Model | Purpose | Key Fields |
|-------|---------|------------|
| `TrailLocation` | Trail content | name, slug, description, district, status, isFeatured, featuredOrder, coverMediaId, ogMediaId |
| `JournalPost` | Journal/Food content | title, slug, content, type (STORY/FOOD), status, isFeatured, featuredOrder, coverMediaId, ogMediaId, trailId |
| `SiteSettings` | Singleton site config | siteName, heroTitle, heroSubtitle, heroMediaId, heroVideoEnabled, heroVideoProvider, heroVideoUrl, heroVideoOverlay, introductionHeading, introductionContent, seasonalEyebrow, seasonalTitle, seasonalContent, seasonalMediaId, aboutHeading, aboutContent, contactEmail, socialFacebook, socialInstagram, socialYouTube, footerText |
| `MediaAsset` | Media registry | publicId, secureUrl, width, height, format, resourceType, altText |
| `TrailGallery` | Trail gallery join | trailId, mediaAssetId, sortOrder |
| `HomepageGallery` | Homepage gallery | mediaAssetId, sortOrder |

### 1.7 Existing Enums

| Enum | Values |
|------|--------|
| `ContentStatus` | DRAFT, PUBLISHED, ARCHIVED |
| `JournalType` | STORY, FOOD |
| `District` | CHITTAGONG, COX_BAZAR, RANGAMATI, BANDARBAN, KHAGRACHARI |
| `TerrainType` | COAST, HILLS, RIVER, CITY, RURAL |
| `PlaceType` | TOURIST_ATTRACTION, PLACE, NATURAL_FEATURE, PARK |
| `HeroVideoProvider` | NONE, YOUTUBE, VIMEO, DIRECT |

---

## 2. Current UX Problems

### 2.1 Critical Problems

1. **Settings page overload**: 726-line single-page form with 8 sections (General, Hero, Video, Introduction, Seasonal, About, Contact, Footer) in one continuous scroll. Excessive scrolling, poor information hierarchy, no save-per-section.

2. **No media picker in content forms**: Trail and Journal forms require raw numeric `coverMediaId` and `ogMediaId` input. Owner must know media IDs or use the separate Media Library. This is impractical.

3. **No rich text editor**: All HTML content (trail descriptions, journal content, settings text) is entered via raw `<textarea>` elements. Requires manual HTML typing. No visual formatting.

4. **No homepage management**: Featured content ordering is scattered across individual trail/journal edit forms (isFeatured checkbox, featuredOrder number). No dedicated workspace to see all homepage sections at a glance.

5. **No hero editor**: Hero configuration is buried inside the Settings page alongside unrelated footer and contact settings. No visual preview during editing.

### 2.2 Significant Problems

6. **No sidebar navigation**: Admin uses a horizontal topbar. At 10+ navigation destinations, horizontal nav becomes crowded and does not scale.

7. **No breadcrumbs**: No way to understand location hierarchy within admin.

8. **No unsaved changes protection**: Navigating away from a dirty form loses all changes without warning.

9. **No save status feedback**: Forms show brief success/error messages but no persistent save status indicator.

10. **Dashboard lacks useful metrics**: Shows only total trails, journal posts, and food posts. Missing: draft counts, media count, featured content status, homepage configuration status, incomplete items.

11. **No content type separation in navigation**: Journal and Food are different content types but share a single nav item. The journal page has type tabs, but navigation does not reflect this.

### 2.3 Minor Problems

12. **Inconsistent form patterns**: Trail/Journal use `useActionState` with server actions; Settings uses `fetch` with API routes. Different save workflows.

13. **No sticky save controls**: On long forms, the save button is at the bottom. Scrolling is required to save.

14. **Media picker not reusable**: The media picker in Settings is inline code, not a shared component. Cannot be used in Trail/Journal forms.

15. **No mobile navigation drawer**: Mobile navigation is hidden behind `hidden md:flex`. No hamburger menu or drawer.

16. **No content preview from list**: Must open edit page to preview content. No quick preview from list view.

---

## 3. Target Information Architecture

### 3.1 Primary Navigation Structure

```
Admin
├── Dashboard                    /admin
├── Content
│   ├── Trails                   /admin/trails
│   ├── Journal                  /admin/journal
│   └── Food                     /admin/food
├── Media
│   └── Media Library            /admin/media
├── Homepage
│   ├── Overview                 /admin/homepage
│   ├── Hero                     /admin/homepage/hero
│   ├── Featured Trails          /admin/homepage/trails
│   ├── Featured Stories         /admin/homepage/stories
│   ├── Featured Food            /admin/homepage/food
│   ├── Seasonal / Mood          /admin/homepage/seasonal
│   └── Gallery                  /admin/homepage/gallery
├── Site Settings
│   ├── General                  /admin/settings/general
│   ├── Introduction / About     /admin/settings/about
│   ├── Contact & Social         /admin/settings/contact
│   └── Footer                   /admin/settings/footer
├── View Site                    / (external)
└── Logout                       (action)
```

### 3.2 Navigation Hierarchy Rules

- **Level 1 (Sidebar top):** Dashboard, Content, Media, Homepage, Site Settings
- **Level 2 (Sidebar sub-items):** Expandable under Content, Homepage, Site Settings
- **Active state:** Current section highlighted in sidebar
- **Collapsed state:** Sidebar collapses to icons only at 1024px and below
- **Mobile:** Hamburger menu opens slide-in drawer

### 3.3 Route Strategy

The proposed route structure uses **dedicated routes per section** rather than nested routes with shared layout tabs. Rationale:

- Each section has distinct data requirements
- Server components can fetch only needed data
- Clear URL structure for deep linking
- Compatible with existing Next.js App Router structure
- Avoids complex shared state between sections

**Route implementation notes:**

| Current Route | Target Route | Change Type |
|---------------|-------------|-------------|
| `/admin` | `/admin` | Keep (enhance dashboard) |
| `/admin/trails` | `/admin/trails` | Keep (redesign list) |
| `/admin/trails/new` | `/admin/trails/new` | Keep (redesign form) |
| `/admin/trails/[id]/edit` | `/admin/trails/[id]/edit` | Keep (redesign form) |
| `/admin/trails/[id]/preview` | `/admin/trails/[id]/preview` | Keep |
| `/admin/journal` | `/admin/journal` | Keep (stories only) |
| `/admin/journal/new` | `/admin/journal/new` | Keep (redesign form) |
| `/admin/journal/[id]/edit` | `/admin/journal/[id]/edit` | Keep (redesign form) |
| `/admin/journal/[id]/preview` | `/admin/journal/[id]/preview` | Keep |
| — | `/admin/food` | New (food-specific list) |
| — | `/admin/food/new` | New (food create form) |
| — | `/admin/food/[id]/edit` | New (food edit form) |
| — | `/admin/food/[id]/preview` | New (food preview) |
| `/admin/media` | `/admin/media` | Keep (redesign) |
| `/admin/settings` | Split into 4 routes | Restructure |
| — | `/admin/homepage` | New (homepage overview) |
| — | `/admin/homepage/hero` | New (dedicated hero editor) |
| — | `/admin/homepage/trails` | New (featured trails curation) |
| — | `/admin/homepage/stories` | New (featured stories curation) |
| — | `/admin/homepage/food` | New (featured food curation) |
| — | `/admin/homepage/seasonal` | New (seasonal/mood editor) |
| — | `/admin/homepage/gallery` | New (homepage gallery manager) |

**Note on Food separation:** Currently `JournalPost.type = FOOD` and `JournalPost.type = STORY` share the same routes. The target architecture separates them into distinct navigation items (`/admin/journal` for stories, `/admin/food` for food) while potentially sharing underlying components. This makes the admin more intuitive for a single owner who thinks of "Journal stories" and "Food stories" as different content types.

---

## 4. Homepage vs Site Settings Separation

### 4.1 Homepage Workspace (`/admin/homepage/*`)

The Homepage workspace owns all editorial content that appears on the homepage. This is **content the owner curates regularly**.

| Section | Route | Owner Fields |
|---------|-------|-------------|
| Overview | `/admin/homepage` | Status summary of all homepage sections |
| Hero | `/admin/homepage/hero` | heroTitle, heroSubtitle, heroMediaId, heroVideoEnabled, heroVideoProvider, heroVideoUrl, heroVideoOverlay, visual preview |
| Featured Trails | `/admin/homepage/trails` | isFeatured trails (max 4), featuredOrder, up/down reordering |
| Featured Stories | `/admin/homepage/stories` | isFeatured STORY posts (max 3), featuredOrder, up/down reordering |
| Featured Food | `/admin/homepage/food` | isFeatured FOOD posts (max 3), featuredOrder, up/down reordering |
| Seasonal / Mood | `/admin/homepage/seasonal` | seasonalEyebrow, seasonalTitle, seasonalContent, seasonalMediaId |
| Gallery | `/admin/homepage/gallery` | HomepageGallery items (target 6-8), media selection, sortOrder, up/down reordering |

### 4.2 Site Settings (`/admin/settings/*`)

Site Settings owns **global identity and metadata** that changes infrequently. This is **configuration, not editorial content**.

| Section | Route | Owner Fields |
|---------|-------|-------------|
| General | `/admin/settings/general` | siteName |
| Introduction / About | `/admin/settings/about` | introductionHeading, introductionContent, aboutHeading, aboutContent |
| Contact & Social | `/admin/settings/contact` | contactEmail, socialFacebook, socialInstagram, socialYouTube |
| Footer | `/admin/settings/footer` | footerText |

### 4.3 Separation Rationale

- **Homepage = editorial** — changes weekly or monthly as content is curated
- **Site Settings = configuration** — changes rarely, maybe quarterly
- **Hero belongs on Homepage** — it is the first editorial section visitors see
- **Seasonal/Mood belongs on Homepage** — it is seasonal editorial content, not global config
- **Introduction/About belongs on Settings** — it is persistent brand content
- **Footer belongs on Settings** — it is persistent site-wide content

---

## 5. Hero Editor Plan

### 5.1 Dedicated Hero Editor (`/admin/homepage/hero`)

The hero editor receives a dedicated two-column desktop layout.

**Left Column — Controls:**
- Hero Title field (with italic helper: use `*text*` for italic)
- Hero Supporting Paragraph textarea
- Hero Poster / Cover Image (via Media Picker)
  - Current preview thumbnail
  - Select Media button → opens Media Picker
  - Replace button → opens Media Picker
  - Unlink button → removes media association
- Video Enable/Disable toggle
- Video Provider selector (when enabled): YouTube, Vimeo, Direct URL
- Video URL input (when provider selected)
- Overlay darkness slider (0-100%)
- Clear validation and helper text per field
- Mobile fallback note (poster shown on reduced-motion)

**Right Column — Preview:**
- Desktop preview frame (16:9 aspect ratio)
- Mobile preview toggle (9:16 aspect ratio)
- Shows poster image as background
- Shows video overlay preview
- Shows title and subtitle overlay
- Loading state skeleton
- Fallback state when no media selected

### 5.2 Preview Behavior

- Preview updates live as fields are edited (client-side state)
- No server round-trip for preview rendering
- Poster fallback shown when video is disabled
- Mobile preview shows poster-only (no video autoplay)

### 5.3 Save Behavior

- Single "Save Hero" button (sticky bottom bar)
- Saves all hero fields in one request via existing `/api/admin/settings` endpoint
- Success/error feedback
- No separate publish step — hero is always "live" when saved

---

## 6. Media Picker Plan

### 6.1 Reusable MediaPicker Component

The current inline media picker in Settings (`settings/page.tsx:662-723`) is not reusable. A shared `MediaPicker` component is needed.

**Props:**
```typescript
interface MediaPickerProps {
  onSelect: (asset: MediaAsset) => void;
  onUnlink?: () => void;
  currentAsset?: MediaAsset | null;
  label?: string;
  open: boolean;
  onClose: () => void;
}
```

**Features:**
- Modal overlay with search input
- Format filter (JPG, PNG, WebP, GIF)
- Folder filter (chittagong-trail/trails, /journal, /general)
- Thumbnail grid with selection state
- Alt text visibility on hover
- Selected state highlight
- Upload-new action (opens upload form within modal)
- Confirm selection button
- Cancel button
- Replace action (when current asset exists)
- Remove/unlink action (when current asset exists)
- Current media preview in the trigger area
- Loading state (skeleton grid)
- Empty state (no media found)
- Error state (fetch failure)
- Keyboard navigation (arrow keys, Enter to select, Escape to close)

### 6.2 Media Deletion Protection

The existing `deleteUnreferencedMediaAsset` in `lib/media-service.ts` provides a 4-gate pipeline:
1. Asset exists check
2. Namespace validation (ALLOWED_UPLOAD_FOLDERS)
3. Reference check (structured + inline HTML)
4. Cloudinary API delete + DB delete

The MediaPicker must NOT expose delete functionality. Delete remains in the Media Library only. The picker only handles select, replace, and unlink.

### 6.3 Unlink vs Delete Distinction

- **Unlink:** Removes the `coverMediaId` or `ogMediaId` association. The media asset remains in the library. Used in forms.
- **Delete:** Permanently removes the asset from Cloudinary and DB. Only available in Media Library. Requires reference check.

---

## 7. Rich Text Recommendation

### 7.1 Current Problem

All content entry uses raw `<textarea>` elements with HTML input. The owner must type HTML manually.

### 7.2 Recommended V1 Solution

**Tiptap** (ProseMirror-based) with a minimal toolbar.

**Why Tiptap:**
- Headless, no opinionated UI
- Outputs HTML (compatible with existing `sanitizeContent` pipeline)
- Extensible with custom nodes
- Good accessibility
- Active maintenance
- No vendor lock-in

**Supported formatting (V1):**
- Paragraphs
- Headings (H2, H3 only)
- Bold
- Italic
- Links (with URL input)
- Unordered lists
- Ordered lists
- Blockquotes
- Inline images (via Media Picker, if already safely supported)

**NOT supported in V1:**
- Tables
- Code blocks
- Embeds (YouTube, etc.)
- Custom components

### 7.3 Server-Side Sanitization

The existing `sanitizeContent` function in `lib/validation.ts` MUST remain as the final gate. Tiptap output is client-side only. All content passes through server-side sanitization on save.

**Allowed elements (existing):** p, h1-h6, blockquote, ul, ol, li, strong, em, a, img, br, hr, code, pre, table, thead, tbody, tr, th, td

**Allowed attributes:** a (href, name, target, rel), img (src, alt, width, height, loading)

**Transforms:** All `<a>` tags get `target="_blank" rel="noopener noreferrer"` automatically.

### 7.4 Implementation Boundary

Tiptap integration is planned for A7R.4 (Trail and Journal/Food editor redesign). The schema is NOT changing. The database format remains HTML strings. This is a UI-only improvement.

---

## 8. Reusable Component Inventory

### 8.1 Layout Components

| Component | Responsibility | States |
|-----------|---------------|--------|
| `AdminShell` | Top-level layout wrapper (sidebar + topbar + content area) | Desktop, tablet, mobile |
| `AdminSidebar` | Persistent sidebar navigation with section grouping | Expanded, collapsed, mobile drawer |
| `AdminTopbar` | Top bar with breadcrumbs, page title, primary action, user menu | Default, with action |
| `MobileAdminNavigation` | Hamburger menu + slide-in drawer for mobile | Open, closed |
| `Breadcrumbs` | Hierarchical path display | Current page highlighted |
| `PageHeader` | Page title, description, and contextual primary action | Default, with action |

### 8.2 Data Display Components

| Component | Responsibility | States |
|-----------|---------------|--------|
| `DataTable` | Desktop tabular data display with sortable columns | Loading, empty, error, populated |
| `MobileListCard` | Mobile card representation of list items | Default, featured, selected |
| `StatusBadge` | Content status indicator (Draft/Published/Archived) | Draft (amber), Published (green), Archived (gray) |
| `ContentTypeBadge` | Journal type indicator (Story/Food) | Story (teal), Food (orange) |
| `DistrictBadge` | Trail district indicator | One per district |
| `FeaturedBadge` | Featured content indicator with order number | Featured, not featured |
| `Pagination` | Page navigation with prev/next and page indicator | First page, middle page, last page |
| `EmptyState` | No content message with optional create action | Default, with action |
| `LoadingState` | Content loading indicator | Skeleton, spinner |
| `ErrorState` | Error message with retry action | Default, with retry |

### 8.3 Form Components

| Component | Responsibility | States |
|-----------|---------------|--------|
| `FormField` | Label + input + helper text + error message wrapper | Default, error, disabled |
| `FormSection` | Collapsible section card with title | Expanded, collapsed |
| `CharacterCounter` | Character count display for limited fields | Under limit, near limit, over limit |
| `ValidationSummary` | Form-level error summary with field links | No errors, with errors |
| `StickyActionBar` | Bottom-fixed save/discard bar | Clean, dirty, saving, saved |
| `SaveStatus` | Persistent save state indicator | Saved, unsaved, saving, error |
| `UnsavedChangesPrompt` | Navigation warning for dirty forms | Active, dismissed |
| `ConfirmationDialog` | Modal confirmation for destructive actions | Open, closed |

### 8.4 Media Components

| Component | Responsibility | States |
|-----------|---------------|--------|
| `MediaPicker` | Reusable media selection modal | Open, closed, loading, empty, error |
| `SelectedMediaPreview` | Current media thumbnail with actions | Selected, no selection |
| `MediaUploadForm` | File upload with folder and alt text | Idle, uploading, success, error |

### 8.5 Content Editor Components

| Component | Responsibility | States |
|-----------|---------------|--------|
| `RichTextEditor` | Tiptap-based content editor wrapper | Focused, blurred, error |
| `PreviewPanel` | Side panel for live content preview | Desktop, mobile toggle |
| `SlugGenerator` | Auto-slug from title/name with manual override | Auto, manual |

### 8.6 Navigation Components

| Component | Responsibility | States |
|-----------|---------------|--------|
| `Tabs` | Section tab navigation with counts | Active, inactive |
| `SearchBar` | Content search input | Empty, with query |
| `FilterBar` | Multiple filter controls in a row | All active, some active, none active |

---

## 9. Form Behavior Standards

### 9.1 Required vs Optional Fields

- **Required fields:** Label shows `*` suffix. Input has `required` attribute. Field-level validation on blur and on submit.
- **Optional fields:** No asterisk. Helper text may explain when to use.
- **Conditional required:** Fields that become required based on other fields (e.g., video URL when video is enabled) show `*` when condition is active.

### 9.2 Validation Flow

1. **On blur:** Validate single field. Show error below field if invalid.
2. **On submit:** Validate all fields. Show field errors + form-level summary at top.
3. **After fix:** Clear individual field error when user corrects it.
4. **Server validation:** If server returns errors, display them alongside client errors.

### 9.3 Save Feedback

- **Saving:** Save button shows "Saving..." with spinner. Button disabled.
- **Success:** Toast notification "Saved successfully" with auto-dismiss (4s). SaveStatus changes to "Saved".
- **Failure:** Inline error message at form top. SaveStatus changes to "Error". Save button re-enabled.
- **Partial failure:** Field-level errors displayed. Form remains editable.

### 9.4 Dirty/Unsaved State

- Form tracks dirty state via `useRef` or state comparison.
- SaveStatus shows "Unsaved changes" when dirty.
- Navigation away from dirty form triggers `UnsavedChangesPrompt`.
- Browser `beforeunload` event also triggers warning.
- Discard button resets form to last saved state.

### 9.5 Sticky Save Controls

- **Desktop:** Bottom-fixed bar with Save, Discard, and SaveStatus.
- **Mobile:** Bottom-fixed bar with Save icon and SaveStatus.
- Bar appears only when form is dirty or saving.
- Bar has sufficient z-index to float above content.

### 9.6 Preview Without Publishing

- Content editors include a "Preview" action.
- Preview opens the public-style preview page in a new tab.
- Preview shows draft content (existing `getTrailPreviewById` and `getJournalPreviewById` functions).
- No separate "publish" step — changing status to PUBLISHED and saving publishes immediately.

### 9.7 Publication Workflow

- **Draft:** Default state. Not visible publicly.
- **Published:** Visible publicly. Sets `publishedAt` if not already set.
- **Archived:** Hidden from public. Can be re-published.
- Status change is a dropdown in the editor form, saved with the form.
- Featured status (`isFeatured`) is independent of publication status.
- Homepage curation pages show publication eligibility warnings.

### 9.8 Dangerous Actions

- Delete is separated from standard editing.
- Delete requires inline confirmation (existing `DeleteButton` pattern).
- Delete button is visually distinct (red, right-aligned).
- No delete from list view — must enter edit mode first.
- Media deletion only in Media Library with full reference check.

### 9.9 Keyboard Accessibility

- All form controls are keyboard accessible.
- Tab order follows visual layout.
- Modal focus trap (Media Picker, Confirmation Dialog).
- Escape key closes modals.
- Enter key submits forms.
- Arrow keys navigate within filter controls.

### 9.10 Focus Management

- After validation error, focus moves to first error field.
- After successful save, focus returns to save button or stays in place.
- After modal close, focus returns to trigger element.
- Skip navigation link for screen readers.

---

## 10. Content List Standards

### 10.1 Common List Structure

All content lists (Trails, Journal, Food, Media) follow a consistent structure:

```
[Page Header with title + count + Create button]
[Search + Filter Bar]
[Content: Table (desktop) / Cards (mobile)]
[Pagination]
```

### 10.2 Search Placement

- Search input at top-left of filter bar.
- Placeholder text: "Search by name/slug...", "Search by title/slug..."
- Search triggers on Enter key or form submit (not on every keystroke for server-rendered lists).
- Clear button (X) inside search input when query exists.

### 10.3 Filters

- Filter controls in a horizontal row below search.
- Each filter is a `<select>` dropdown.
- "All" option is the default for each filter.
- Active filters are visually distinct.
- "Clear All" button appears when any filter is active.
- Filters persist via URL search params (existing pattern).

### 10.4 Sort Controls

- Sort by dropdown (field options vary by content type).
- Sort order toggle (ascending/descending).
- Default sort: Updated Date descending.

### 10.5 Pagination

- 20 items per page (existing pattern).
- Shows "Page X of Y" and "Z total items".
- Previous/Next buttons.
- Disabled state for first/last page.
- Page links via URL search params.

### 10.6 Desktop Table Structure

| Column | Trails | Journal | Food |
|--------|--------|---------|------|
| Title/Name | Name + Slug | Title + Slug | Title + Slug |
| Type | — | Story badge | Food badge |
| District | District badge | — | — |
| Status | Status badge | Status badge | Status badge |
| Featured | Featured badge + order | Featured badge + order | Featured badge + order |
| Related | Journal count | Trail name | Trail count |
| Dates | Updated date | Updated / Published | Updated / Published |
| Actions | Edit, Preview, View Public | Edit, Preview, View Live | Edit, Preview, View Live |

### 10.7 Mobile Card Structure

```
┌─────────────────────────────────┐
│ Trail Name              [Status]│
│ /trail-slug                      │
│─────────────────────────────────│
│ District  ·  3 journal posts    │
│─────────────────────────────────│
│              [Edit] [Preview]   │
└─────────────────────────────────┘
```

### 10.8 Empty States

- **No content:** "No [trails/posts] yet. Create your first [trail/post]." + Create button.
- **No results:** "No [trails/posts] found matching your criteria." + Clear filters link.
- **Loading:** Skeleton or spinner with "Loading..."
- **Error:** Error message with "Retry" button.

---

## 11. Dashboard Requirements

### 11.1 Dashboard Layout

```
[Page Header: Dashboard]
[Welcome message]

[Stats Grid: 6 cards in 2 rows of 3]
[Quick Actions Row]
[Two-Column Layout: Recent Content + Status Panels]
```

### 11.2 Stats Cards

| Card | Value | Color | Link |
|------|-------|-------|------|
| Total Trails | Count | Teal | /admin/trails |
| Published Trails | Count | Green | /admin/trails?status=PUBLISHED |
| Draft Trails | Count | Amber | /admin/trails?status=DRAFT |
| Total Stories | Count | Blue | /admin/journal |
| Total Food | Count | Orange | /admin/food |
| Total Media | Count | Gray | /admin/media |

### 11.3 Quick Actions

- "+ New Trail" button
- "+ New Story" button
- "+ New Food" button
- "Media Library" link

### 11.4 Status Panels

**Recent Content (left column):**
- 5 most recently updated trails
- 5 most recently updated posts

**Operational Status (right column):**
- Homepage hero: configured/incomplete indicator
- Featured trails: X/4 slots used
- Featured stories: X/3 slots used
- Featured food: X/3 slots used
- Homepage gallery: X/8 items
- Drafts needing attention (drafts older than 7 days)

### 11.5 Incomplete Items

- Warning badge if hero has no title or no media
- Warning badge if fewer than 2 featured trails
- Warning badge if homepage gallery is empty
- Warning badge if site settings have empty required fields

---

## 12. Homepage Curation Requirements

### 12.1 Homepage Overview (`/admin/homepage`)

Shows all homepage sections in a card grid:

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Hero         │ │ Featured     │ │ Featured     │
│ [Complete]   │ │ Trails       │ │ Stories      │
│ Title + Media│ │ 3/4 slots    │ │ 2/3 slots    │
│ [Edit Hero]  │ │ [Manage]     │ │ [Manage]     │
└──────────────┘ └──────────────┘ └──────────────┘
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Featured     │ │ Seasonal /   │ │ Homepage     │
│ Food         │ │ Mood         │ │ Gallery      │
│ 1/3 slots    │ │ [Complete]   │ │ 5/8 items    │
│ [Manage]     │ │ [Edit]       │ │ [Manage]     │
└──────────────┘ └──────────────┘ └──────────────┘
```

Each card shows:
- Section name
- Completion status (complete/incomplete with icon)
- Summary (e.g., "3/4 slots", "Title + poster configured")
- "Edit" or "Manage" button

### 12.2 Featured Content Ordering

**Recommended approach:** Up/Down arrow buttons (not drag-and-drop).

Rationale:
- Accessible via keyboard
- Simple to implement
- Reliable across devices
- No external dependencies
- Works with server-rendered lists

**Ordering interface:**
```
1. [▲] [▼] Trail Name A          [Remove]
2. [▲] [▼] Trail Name B          [Remove]
3. [▲] [▼] Trail Name C          [Remove]
   [ + Add Trail ]
```

- Up arrow disabled for first item.
- Down arrow disabled for last item.
- Each move triggers an API call to update `featuredOrder`.
- Maximum items enforced (4 for trails, 3 for stories, 3 for food).

### 12.3 Publication Eligibility

Featured content lists show eligibility warnings:

- Draft content cannot appear publicly
- Trail not published warning on journal posts
- Missing cover image warning
- Missing excerpt warning

### 12.4 Missing Media Warnings

- Hero section: "No poster image selected"
- Hero section: "No video URL configured" (when video enabled)
- Featured trail: "No cover image" warning on each trail card
- Seasonal section: "No seasonal image selected"
- Gallery items: "No media selected" for empty slots

---

## 13. Admin Visual Direction

### 13.1 Typography

- **Interface text:** System sans-serif stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`)
- **Headings:** Same sans-serif, weight 600-700
- **Body text:** Weight 400, 14-16px
- **Small text:** Weight 400-500, 12-13px
- **Monospace:** For slugs, public IDs, code (`'SF Mono', Monaco, monospace`)
- **Minimal serif use:** The current Playfair Display is used only for top-level page titles in the existing admin. Consider replacing with sans-serif for consistency.

### 13.2 Color System

**Neutral surfaces:**
- Background: `#F8F6F3` (warm off-white)
- Card/surface: `#FFFFFF`
- Border: `#E5E0D8`
- Text primary: `#1A1614`
- Text secondary: `#6B5E54`
- Text muted: `#9B8F84`

**Brand accents (subtle):**
- Primary action: `#3E2723` (dark brown)
- Primary hover: `#5D4037`
- Accent: `#C9A882` (warm gold)

**Status colors (high contrast):**
- Published/Success: `#059669` (green)
- Draft/Warning: `#D97706` (amber)
- Archived/Neutral: `#6B7280` (gray)
- Error/Danger: `#DC2626` (red)
- Info: `#2563EB` (blue)

**Content type colors:**
- Trail: `#0891B2` (teal)
- Story: `#2563EB` (blue)
- Food: `#EA580C` (orange)

### 13.3 Spacing and Layout

- Card padding: 24px (desktop), 16px (mobile)
- Section spacing: 32px between sections
- Form field spacing: 16px between fields
- Compact controls: 8px vertical padding
- Standard controls: 12px vertical padding
- Touch targets: minimum 44x48px

### 13.4 Component Styling

- Cards: White background, 1px border, 8px border-radius, subtle shadow
- Buttons: 8px border-radius, 12px horizontal padding
- Inputs: 8px border-radius, 12px horizontal padding, 10px vertical padding
- Badges: 12px border-radius, 4px horizontal padding, 2px vertical padding
- Focus rings: 2px outline, 2px offset, brand accent color

---

## 14. Accessibility Requirements

### 14.1 WCAG AA Compliance

- **Contrast:** All text meets 4.5:1 ratio against background. Large text (18px+) meets 3:1.
- **Focus:** Visible keyboard focus indicator on all interactive elements.
- **Labels:** All form inputs have associated `<label>` elements.
- **Alt text:** All images have alt text (existing MediaAsset supports altText).
- **Semantic HTML:** Use `<nav>`, `<main>`, `<header>`, `<section>`, `<article>` appropriately.
- **Headings:** Proper heading hierarchy (h1 → h2 → h3, no skipping).

### 14.2 Keyboard Navigation

- Tab order follows visual layout.
- Skip navigation link at top of page.
- Modal focus trap for Media Picker and Confirmation Dialog.
- Escape key closes modals and drawers.
- Arrow keys navigate within filter dropdowns and ordering lists.
- Enter submits forms.

### 14.3 Reduced Motion

- All animations respect `prefers-reduced-motion`.
- Transition durations reduced or eliminated.
- No auto-playing animations.
- Hero video preview shows poster fallback.

### 14.4 Screen Reader Support

- ARIA labels for icon-only buttons.
- Live regions for save status updates.
- Descriptive link text (not "click here").
- Status badges include screen reader text.

---

## 15. Responsive Behavior

### 15.1 Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Desktop | ≥1440px | Full sidebar + content area |
| Compact desktop | 1024-1439px | Collapsible sidebar (icons only) |
| Tablet | 768-1023px | Hidden sidebar, hamburger menu |
| Mobile | <768px | Hidden sidebar, hamburger menu, stacked layouts |

### 15.2 Admin Shell Responsive Behavior

**Desktop (≥1440px):**
- Sidebar: 260px fixed width, expanded with labels
- Content: Fluid, max-width 1200px
- Topbar: Full breadcrumbs + page title + actions

**Compact desktop (1024-1439px):**
- Sidebar: 64px collapsed, icons only, tooltips on hover
- Content: Fluid
- Topbar: Abbreviated breadcrumbs + page title

**Tablet (768-1023px):**
- Sidebar: Hidden, triggered by hamburger icon
- Mobile drawer: 280px slide-in from left
- Content: Full width
- Topbar: Hamburger + page title + actions

**Mobile (<768px):**
- Sidebar: Hidden, triggered by hamburger icon
- Mobile drawer: 280px slide-in from left
- Content: Full width, stacked
- Topbar: Hamburger + page title (truncated) + action icon

### 15.3 Content List Responsive Behavior

**Desktop:** Full table with all columns
**Tablet:** Condensed table (hide Related column)
**Mobile:** Card layout (existing pattern, enhanced)

### 15.4 Form Responsive Behavior

**Desktop:** Two-column grid for related fields
**Tablet:** Two-column grid (narrower)
**Mobile:** Single column, full-width fields

### 15.5 Hero Editor Responsive Behavior

**Desktop:** Two-column (controls left, preview right)
**Tablet:** Two-column (controls narrower, preview smaller)
**Mobile:** Single column (controls top, preview bottom)

---

## 16. Implementation Boundaries

### 16.1 What This Phase Defines

- Information architecture
- Route structure
- Navigation hierarchy
- Component responsibilities
- Form behavior standards
- Visual direction
- Responsive behavior
- Accessibility requirements

### 16.2 What This Phase Does NOT Change

- Prisma schema
- Database records
- Authentication behavior
- Cloudinary assets
- Public frontend
- Existing tests (they continue to pass)
- Package dependencies

### 16.3 What Later Phases Will Implement

- AdminShell with sidebar navigation
- Reusable MediaPicker component
- Tiptap rich text editor integration
- Dashboard redesign
- Content list redesign
- Content editor redesign
- Homepage workspace
- Hero editor
- Site Settings restructuring
- Responsive behavior
- Accessibility improvements

---

## 17. Compatibility Considerations

### 17.1 Existing Route Preservation

All existing routes continue to work during the transition. The new route structure is additive, not destructive. Old routes may be redirected to new routes once new pages are built.

### 17.2 Server Action Compatibility

The existing server actions (`createTrail`, `updateTrail`, `createJournalPost`, `updateJournalPost`) continue to work. New UI components will use the same actions.

### 17.3 API Route Compatibility

The existing API routes (`/api/admin/settings`, `/api/admin/media`, `/api/upload`) continue to work. New UI will consume the same endpoints.

### 17.4 Service Layer Compatibility

All existing services (`trail-service`, `journal-service`, `media-service`, `settings-service`) are consumed by new pages without modification.

---

## 18. Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Food separation creates duplicate routes | Medium | High | Share components via `/admin/food` using same `JournalForm` with `type=FOOD` default |
| Media Picker adds complexity | Medium | Medium | Build incrementally; start with basic selection, add features later |
| Tiptap integration breaks sanitization | High | Low | Keep `sanitizeContent` as server-side gate; Tiptap is client-only |
| Sidebar navigation adds layout shift | Low | Medium | Use CSS transitions; preserve content area width |
| Homepage ordering API calls cause flicker | Low | Medium | Optimistic UI updates; debounce API calls |
| Responsive breakpoints miss edge cases | Low | Medium | Test at exact breakpoints; use container queries where supported |

---

## 19. Phased Implementation Plan

### Phase A7R.1 — Architecture and Wireframes (Current)
- Current-state audit
- Information architecture definition
- Route structure proposal
- Component inventory
- Wireframe creation
- Owner approval

### Phase A7R.2 — Admin Shell and Reusable UI Foundation
- AdminShell layout component
- AdminSidebar with navigation
- AdminTopbar with breadcrumbs
- MobileAdminNavigation drawer
- PageHeader component
- FormField, FormSection components
- StatusBadge, ContentTypeBadge, DistrictBadge
- Toast/inline feedback system

### Phase A7R.3 — Dashboard and Content-List Redesign
- Dashboard redesign with stats, quick actions, status panels
- Trails list redesign (table + mobile cards)
- Journal list redesign (with type tabs)
- Food list redesign (separate route)
- FilterBar and SearchBar components
- Pagination component
- EmptyState, LoadingState, ErrorState

### Phase A7R.4 — Trail and Journal/Food Editor Redesign
- Trail editor redesign (with MediaPicker, RichTextEditor)
- Journal editor redesign (with MediaPicker, RichTextEditor)
- Food editor redesign (separate route, shared components)
- StickyActionBar with save/discard
- UnsavedChangesPrompt
- SaveStatus indicator
- Preview integration
- Tiptap rich text editor integration

### Phase A7R.5 — Media Library and Media Picker Redesign
- Media Library redesign (grid, filters, detail modal)
- Reusable MediaPicker component
- Media upload form component
- Reference display improvements
- Alt text editing improvements

### Phase A7R.6 — Homepage Workspace and Hero Editor
- Homepage Overview page
- Hero editor (two-column with preview)
- Featured Trails curation page
- Featured Stories curation page
- Featured Food curation page
- Seasonal/Mood editor
- Homepage Gallery manager
- Up/down ordering controls

### Phase A7R.7 — Site Settings Restructuring
- General settings page
- Introduction/About settings page
- Contact & Social settings page
- Footer settings page
- Settings navigation

### Phase A7R.8 — Responsive, Accessibility and Workflow QA
- Responsive testing at all breakpoints
- Keyboard navigation audit
- Screen reader testing
- Focus management verification
- Touch target verification
- Contrast ratio verification
- Reduced motion testing
- Workflow end-to-end testing

---

## 20. Owner Approval Checklist

Before proceeding to A7R.2, the following decisions require owner approval:

- [ ] Approved information architecture (primary navigation structure)
- [ ] Approved route structure (new routes for Homepage and Settings)
- [ ] Approved Homepage vs Site Settings separation
- [ ] Approved Hero editor two-column layout
- [ ] Approved MediaPicker requirements
- [ ] Approved rich text editor recommendation (Tiptap)
- [ ] Approved dashboard metrics (no decorative analytics)
- [ ] Approved visual direction (neutral admin with subtle brand accents)
- [ ] Approved responsive breakpoints
- [ ] Approved component inventory
- [ ] Approved phased implementation plan
- [ ] Approved separation of Food into distinct navigation item

---

*This document is the authoritative reference for Admin UX architecture. All implementation decisions in A7R.2-A7R.8 must reference this document.*
