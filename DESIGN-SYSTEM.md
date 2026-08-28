# Chittagong Trail — Visual Design System

**Document:** `DESIGN-SYSTEM.md`
**Version:** 1.0 — Design System Proposal
**Status:** Awaiting brand assets + approval
**Project:** Chittagong Trail
**Domain:** `chittagongtrail.com`

---

## 1. Purpose

This document defines the visual identity and design system for the Chittagong Trail website.

It establishes:

* Visual personality and character
* Color system
* Typography system
* Spacing and layout system
* Image treatment principles
* Component visual direction
* Responsive behavior
* Cinematic/storytelling principles
* Animation direction
* Accessibility principles
* Performance principles

This document is **not a final visual design specification**.

It uses **provisional values** for colors and fonts because:

**Brand assets (logo, color references, typography) are NOT available in the repository.**

Final visual design cannot be completed until brand assets are provided.

---

# 2. Brand Asset Status

## 2.1 Inspection Results

```text
SEARCHED: Entire repository

FOUND:
  - /public/window.svg (default Next.js)
  - /public/vercel.svg (default Next.js)
  - /public/next.svg (default Next.js)
  - /public/globe.svg (default Next.js)
  - /public/file.svg (default Next.js)

NOT FOUND:
  - Chittagong Trail logo
  - Circular watercolor logo
  - Hand-lettered wordmark
  - Any brand imagery
  - Any brand color references
  - Any typography references
  - Any brand style guide
```

## 2.2 Required Assets

Before final visual design can be completed:

```text
CRITICAL:
  [ ] Logo file (PNG or SVG with transparency)
  [ ] Logo usage guidelines (if any)
  [ ] Brand color palette (or permission to derive from logo)
  [ ] Brand typography (or permission to select)

IMPORTANT:
  [ ] Logo variations (light/dark, icon-only, wordmark-only)
  [ ] Brand photography examples
  [ ] Existing brand materials

NICE TO HAVE:
  [ ] Brand pattern/texture examples
  [ ] Animation style references
```

## 2.3 Provisional Policy

```text
Until brand assets are provided:

  Colors:
    - Use clearly marked PROVISIONAL values
    - Document each for later replacement
    - Do not commit to final hex values

  Typography:
    - Use system fonts as PROVISIONAL placeholders
    - Document font choices for later replacement
    - Do not license or commit to final fonts

  Logo:
    - Use text-based logo placeholder
    - Document logo placement requirements
    - Do not invent logo treatment

  All provisional values are marked with [PROVISIONAL]
```

---

# 3. Visual Personality

## 3.1 Core character

Chittagong Trail should feel:

```text
CINEMATIC
  - Large-scale imagery
  - Full-bleed sections
  - Dramatic visual moments
  - Film-like quality

WARM
  - Cream backgrounds
  - Earthy tones
  - Inviting atmosphere
  - Not cold or clinical

EARTHY
  - Natural color palette
  - Organic shapes
  - Grounded feeling
  - Connected to landscape

ORGANIC
  - Flowing layouts
  - Not rigid grids
  - Natural rhythms
  - Handcrafted feel

EDITORIAL
  - Magazine-like typography
  - Story-driven layouts
  - Editorial pacing
  - Not template-driven

PERSONAL
  - Journal/diary feeling
  - One person's perspective
  - Authentic voice
  - Not corporate

EXPLORATORY
  - Encourages discovery
  - Connected content
  - Journey-like navigation
  - Not linear

NATURAL
  - Photography-first
  - Real places
  - Real experiences
  - Not staged or stock

STORY-DRIVEN
  - Content leads design
  - Narrative structure
  - Emotional connection
  - Not feature-driven
```

## 3.2 Differentiation

Chittagong Trail is NOT:

```text
CORPORATE TRAVEL WEBSITE
  - No hero sliders
  - No generic stock photography
  - No template layouts
  - No "Book Now" CTAs
  - No pricing tables

TOURISM BOARD WEBSITE
  - No government styling
  - No official branding
  - No directory listings
  - No promotional language
  - No multiple destinations

GENERIC TRAVEL BLOG
  - No ad-heavy layouts
  - No affiliate-focused design
  - No listicle formatting
  - No generic WordPress themes
  - No social media feed integration

BANGLADESHTRAIL.COM CLONE
  - Different visual identity
  - Different brand voice
  - Different content focus
  - Different emotional tone
```

## 3.3 Inspiration references

```text
Visual quality references:
  - National Geographic longform
  - The New York Times interactive stories
  - Patagonia brand storytelling
  - Kinfolk magazine editorial
  - Cereal magazine travel journal

NOT references:
  - TripAdvisor
  - Booking.com
  - Generic travel agency sites
  - WordPress travel themes
```

---

# 4. Color System

## 4.1 Color direction

```text
PRIMARY PALETTE:
  Cream + warm earthy accents + cinematic dark sections

AVOID:
  - Corporate blue
  - Neon colors
  - Generic "travel website" gradients
  - Overly saturated UI colors
  - Pure black (#000000) — use near-black instead
  - Pure white (#FFFFFF) — use warm white/cream instead
```

## 4.2 Color roles

```text
BACKGROUND (PRIMARY):
  Main content background
  Warm cream or off-white

BACKGROUND (SECONDARY):
  Alternate section backgrounds
  Slightly different cream or light earth tone

SURFACE:
  Cards, panels, elevated elements
  White or very light cream

TEXT (PRIMARY):
  Headings, body text
  Near-black or very dark brown

TEXT (SECONDARY):
  Dates, metadata, captions
  Muted gray or warm gray

ACCENT:
  Links, buttons, highlights
  Forest green or earthy green

ACCENT (HOVER):
  Interactive state
  Darker or warmer variant

BORDER:
  Subtle divisions
  Very light gray or warm gray

OVERLAY:
  Text legibility on images
  Dark gradient or semi-transparent dark

DARK SECTION:
  Cinematic dark backgrounds
  Very dark brown or forest green

LIGHT SECTION:
  Cream backgrounds
  Warm off-white
```

## 4.3 Provisional colors

```text
IMPORTANT: These are PROVISIONAL values.
They will be replaced when brand assets are provided.

All values marked [PROVISIONAL] are temporary.
```

### Backgrounds

```text
--bg-primary:     #FDF8F0  [PROVISIONAL]  Warm cream
--bg-secondary:   #F5EDE3  [PROVISIONAL]  Slightly darker cream
--bg-surface:     #FFFFFF  [PROVISIONAL]  White for cards
```

### Text

```text
--text-primary:   #1C1917  [PROVISIONAL]  Near-black (warm)
--text-secondary: #78716C  [PROVISIONAL]  Warm gray
--text-muted:     #A8A29E  [PROVISIONAL]  Light warm gray
```

### Accent

```text
--accent-primary:   #3D5A3C  [PROVISIONAL]  Forest green
--accent-secondary: #8B5E3C  [PROVISIONAL]  Warm brown
--accent-hover:     #2D442C  [PROVISIONAL]  Darker green
```

### Border

```text
--border-light:   #E7E5E4  [PROVISIONAL]  Very light warm gray
--border-default: #D6D3D1  [PROVISIONAL]  Light warm gray
```

### Dark sections

```text
--dark-bg:      #1C1917  [PROVISIONAL]  Near-black
--dark-text:    #F5F5F4  [PROVISIONAL]  Off-white
--dark-accent:  #A8A29E  [PROVISIONAL]  Muted gray
```

### Overlay

```text
--overlay-dark: rgba(28, 25, 23, 0.6)  [PROVISIONAL]
--overlay-gradient: linear-gradient(
  to bottom,
  transparent 0%,
  rgba(28, 25, 23, 0.8) 100%
)  [PROVISIONAL]
```

## 4.4 Color application

```text
HOMEPAGE:
  Hero:           Full-bleed imagery + dark overlay for text
  Introduction:   --bg-primary (cream)
  Trails:         --bg-primary with --bg-surface cards
  Seasonal:       Editorial layout (image + text on cream)
  Map:            Map container (neutral background)
  Journal:        --bg-primary with --bg-surface cards
  Food:           --bg-primary with --bg-surface cards
  Gallery:        Image-first (minimal color treatment)
  About:          --bg-primary (cream)
  Footer:         --dark-bg (near-black)

NAVIGATION:
  On hero:        Transparent, white text
  Scrolled:       --bg-surface or --bg-primary, --text-primary

BUTTONS:
  Primary:        --accent-primary bg, white text
  Secondary:      Transparent, --accent-primary border/text
  Hover:          --accent-hover

CARDS:
  Background:     --bg-surface
  Border:         None or --border-light
  Text:           --text-primary
  Metadata:       --text-secondary
```

---

# 5. Typography System

## 5.1 Typography direction

```text
DISPLAY/HEADINGS:
  Direction: Editorial serif or high-contrast sans-serif
  Character: Elegant, refined, editorial
  Usage: Page titles, section headings

BODY TEXT:
  Direction: Clean, readable sans-serif
  Character: Warm, approachable, highly legible
  Usage: Paragraphs, descriptions, UI text

ACCENT/HANDWRITTEN:
  Direction: Only for logo/brand wordmark
  Character: Hand-lettered, personal
  Usage: Logo only, not for body text

NAVIGATION:
  Direction: Clean sans-serif
  Character: Clear, minimal, functional
  Usage: Nav links, buttons, UI elements

METADATA:
  Direction: Small sans-serif
  Character: Subtle, secondary
  Usage: Dates, captions, tags, categories
```

## 5.2 Font categories

```text
RECOMMENDED DIRECTION (not final):

Display/Headings:
  - Serif with editorial character
  - Examples: Playfair Display, Lora, Merriweather, or similar
  - NOT: Times New Roman, generic serif

Body:
  - Clean, warm sans-serif
  - Examples: Inter, DM Sans, Source Sans Pro, or similar
  - NOT: Arial, Helvetica (too clinical)

Logo/Wordmark:
  - Existing hand-lettered brand asset
  - NOT to be recreated as web font
```

## 5.3 Provisional fonts

```text
IMPORTANT: These are PROVISIONAL placeholders.
Final fonts will be selected after brand asset review.

--font-display: Georgia, "Times New Roman", Times, serif  [PROVISIONAL]
--font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
             "Helvetica Neue", Arial, sans-serif  [PROVISIONAL]
--font-mono: "SF Mono", SFMono-Regular, Consolas, 
             "Liberation Mono", Menlo, monospace  [PROVISIONAL]
```

## 5.4 Type scale

```text
BASE SIZE: 16px (1rem)

Scale:
  --text-xs:    0.75rem    (12px)
  --text-sm:    0.875rem   (14px)
  --text-base:  1rem       (16px)
  --text-lg:    1.125rem   (18px)
  --text-xl:    1.25rem    (20px)
  --text-2xl:   1.5rem     (24px)
  --text-3xl:   1.875rem   (30px)
  --text-4xl:   2.25rem    (36px)
  --text-5xl:   3rem       (48px)
  --text-6xl:   3.75rem    (60px)
  --text-7xl:   4.5rem     (72px)
```

## 5.5 Font weights

```text
--font-light:    300
--font-normal:   400
--font-medium:   500
--font-semibold: 600
--font-bold:     700
```

## 5.6 Line heights

```text
--leading-none:    1
--leading-tight:   1.25
--leading-snug:    1.375
--leading-normal:  1.5
--leading-relaxed: 1.625
--leading-loose:   2
```

## 5.7 Letter spacing

```text
--tracking-tighter: -0.05em
--tracking-tight:   -0.025em
--tracking-normal:  0
--tracking-wide:    0.025em
--tracking-wider:   0.05em
--tracking-widest:  0.1em
```

## 5.8 Typography application

```text
PAGE TITLE (H1):
  Size: --text-5xl to --text-7xl (48-72px)
  Weight: --font-bold or --font-semibold
  Line height: --leading-tight
  Letter spacing: --tracking-tight
  Usage: Hero title, page heading

SECTION HEADING (H2):
  Size: --text-3xl to --text-4xl (30-36px)
  Weight: --font-semibold
  Line height: --leading-tight
  Usage: Section titles

SUBHEADING (H3):
  Size: --text-2xl (24px)
  Weight: --font-semibold
  Line height: --leading-snug
  Usage: Subsections, card titles

CARD TITLE (H3/H4):
  Size: --text-xl to --text-2xl (20-24px)
  Weight: --font-semibold
  Line height: --leading-snug
  Usage: Trail cards, journal cards

BODY TEXT:
  Size: --text-base (16px)
  Weight: --font-normal
  Line height: --leading-normal
  Usage: Paragraphs, descriptions

SMALL TEXT:
  Size: --text-sm (14px)
  Weight: --font-normal
  Line height: --leading-normal
  Usage: Secondary information

CAPTION/METADATA:
  Size: --text-xs to --text-sm (12-14px)
  Weight: --font-normal
  Line height: --leading-normal
  Color: --text-secondary or --text-muted
  Usage: Dates, tags, categories, captions

NAVIGATION:
  Size: --text-base (16px)
  Weight: --font-medium
  Usage: Nav links

BUTTON:
  Size: --text-base (16px)
  Weight: --font-medium
  Usage: Button text
```

## 5.9 Text measure / reading width

```text
MAX LINE LENGTH:
  Body text: 65-75 characters optimal
  Approximate max-width: 680px (for body text columns)

CONTENT WIDTHS:
  Narrow (text-heavy): max-w-2xl (672px)
  Medium: max-w-4xl (896px)
  Wide: max-w-6xl (1152px)
  Full: No max-width
```

---

# 6. Spacing System

## 6.1 Spacing scale

```text
Base unit: 4px

--space-0:   0px
--space-1:   0.25rem   (4px)
--space-2:   0.5rem    (8px)
--space-3:   0.75rem   (12px)
--space-4:   1rem      (16px)
--space-5:   1.25rem   (20px)
--space-6:   1.5rem    (24px)
--space-8:   2rem      (32px)
--space-10:  2.5rem    (40px)
--space-12:  3rem      (48px)
--space-16:  4rem      (64px)
--space-20:  5rem      (80px)
--space-24:  6rem      (96px)
--space-32:  8rem      (128px)
--space-40:  10rem     (160px)
--space-48:  12rem     (192px)
--space-64:  16rem     (256px)
```

## 6.2 Layout containers

```text
CONTAINER:
  Max width: 1200px
  Margin: auto
  Padding-x: --space-4 to --space-6 (responsive)

CONTENT CONTAINER:
  Max width: 1200px
  Margin: auto
  Padding: Responsive

NARROW CONTENT:
  Max width: 680px (optimal reading width)

WIDE CONTENT:
  Max width: 1400px (for full-bleed sections)
```

## 6.3 Section spacing

```text
SECTION PADDING (VERTICAL):
  Mobile:  --space-12 to --space-16 (48-64px)
  Tablet:  --space-16 to --space-20 (64-80px)
  Desktop: --space-20 to --space-24 (80-96px)

BETWEEN SECTIONS:
  --space-16 to --space-24 (64-96px)
  Can be reduced if section backgrounds alternate

FULL-BLEED SECTIONS:
  No horizontal padding
  Content contained within max-width
```

## 6.4 Component spacing

```text
CARD PADDING:
  --space-5 to --space-6 (20-24px)

BUTTON PADDING:
  Small:  --space-2 --space-4 (8px 16px)
  Medium: --space-3 --space-5 (12px 20px)
  Large:  --space-4 --space-6 (16px 24px)

INPUT PADDING:
  --space-3 --space-4 (12px 16px)

FORM SPACING:
  Between fields: --space-5 to --space-6 (20-24px)
  Label to input: --space-2 (8px)
```

## 6.5 Element spacing

```text
HEADING TO CONTENT:
  --space-4 to --space-6 (16-24px)

BETWEEN PARAGRAPHS:
  --space-4 to --space-5 (16-20px)

BETWEEN LIST ITEMS:
  --space-2 to --space-3 (8-12px)

BETWEEN SECTIONS IN CONTENT:
  --space-8 to --space-12 (32-48px)

CARD GRID GAP:
  --space-6 to --space-8 (24-32px)
```

## 6.6 Grid system

```text
MOBILE (0-767px):
  Columns: 4
  Gap: --space-4 (16px)
  Padding: --space-4 (16px)

TABLET (768-1023px):
  Columns: 8
  Gap: --space-6 (24px)
  Padding: --space-6 (24px)

DESKTOP (1024px+):
  Columns: 12
  Gap: --space-6 to --space-8 (24-32px)
  Padding: --space-6 to --space-8 (24-32px)
```

---

# 7. Image System

## 7.1 Image principles

```text
PHOTOGRAPHY IS PRIMARY:
  - Real founder photography, not stock
  - Large-scale, high-quality images
  - Minimal text interference
  - Let images tell stories

NOT SECONDARY:
  - Small thumbnails
  - Heavy overlays
  - Decorative backgrounds only
  - Generic stock imagery

DO NOT:
  - Download or introduce stock images
  - Use placeholder images as final content
  - Invent photography that doesn't exist
```

## 7.2 Image types and treatment

### Hero images

```text
Aspect ratio: 16:9 or wider (21:9 for cinematic)
Object-fit: Cover
Position: Center or custom focal point
Overlay: Optional gradient for text legibility
Full-width: Yes, edge-to-edge on desktop
Mobile: Full-width, may crop to vertical
```

### Trail images

```text
Cover/featured: 16:9 or 4:3
Gallery images: Various ratios acceptable
Object-fit: Cover
Cropping: Center or smart focal point
Grid: Consistent aspect ratio in grid display
```

### Journal cover images

```text
Aspect ratio: 16:9 or 3:2
Object-fit: Cover
Cropping: Center
Consistent ratio across cards
```

### Food photography

```text
Same as journal cover images
Aspect ratio: 16:9 or 4:3
Object-fit: Cover
Focus on food, not excessive styling
```

### Gallery images

```text
Aspect ratio: Various (or consistent grid ratio)
Object-fit: Cover
Minimal or no captions
Location names only (optional)
Masonry or uniform grid
```

### Inline content images

```text
Max-width: 100%
Aspect ratio: Auto (natural)
Optional border radius
Optional caption below
```

## 7.3 Image overlays

```text
HERO:
  - Gradient: transparent to dark (bottom)
  - Purpose: Text legibility
  - Intensity: Adjustable per image

CARDS:
  - No overlay typically
  - Optional subtle hover overlay

GALLERY:
  - Optional hover overlay with location name
  - Subtle, not heavy

DARK SECTIONS:
  - May use lighter overlay for contrast
```

## 7.4 Image placeholders

```text
Before real images:
  - Gray/neutral placeholder rectangles
  - Maintain aspect ratio
  - No decorative patterns
  - Clear labeling
  - Example: "Patenga Beach — Hero Image"
```

## 7.5 Image optimization

```text
NEXT.JS IMAGE COMPONENT:
  - Responsive sizing
  - Lazy loading by default
  - WebP/AVIF format support
  - Blur placeholder for lazy load

SIZES ATTRIBUTE:
  - Hero: sizes="100vw"
  - Cards: sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  - Gallery: sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"

QUALITY:
  - Hero: 85-90
  - Cards: 75-80
  - Gallery: 75-80
```

---

# 8. Component Visual Principles

## 8.1 Navigation

### Desktop

```text
STYLE:
  - Minimal and lightweight
  - Transparent on hero
  - Solid on scroll (bg-primary or bg-surface)
  - Fixed or sticky top

LAYOUT:
  - Logo: Left
  - Links: Right
  - Horizontal list
  - Generous spacing between links

HEIGHT:
  - 72-80px

LINK STYLING:
  - Text color: --text-primary
  - Hover: --accent-primary
  - Active: --accent-primary
  - Font: --font-body, --font-medium
  - Size: --text-base (16px)

LOGO:
  - Text-based placeholder for now
  - Will be replaced with actual logo
  - Font: Display or custom (TBD)
```

### Mobile

```text
TRIGGER:
  - Hamburger icon (right)
  - Three lines or custom icon

MENU:
  - Full-screen overlay or slide-in
  - Background: --bg-primary or --bg-surface
  - Links: Vertical list
  - Large touch targets (48px minimum)

LINK STYLING:
  - Text color: --text-primary
  - Size: --text-xl to --text-2xl (20-24px)
  - Padding: --space-4 to --space-6 (16-24px)
  - Border-bottom: --border-light

CLOSE:
  - X icon or tap outside
  - Clear close target
```

## 8.2 Trail cards

```text
STRUCTURE:
  - Image (16:9 ratio)
  - Content area
    - Title (H3)
    - Description (optional, 1-2 lines)
    - Arrow/link indicator

VISUAL TREATMENT:
  - Background: --bg-surface
  - Border: None or 1px --border-light
  - Border radius: --radius-md (8px) [PROVISIONAL]
  - Shadow: None or --shadow-sm
  - Overflow: Hidden (image bleeds to edges)

HOVER STATE:
  - Subtle elevation: --shadow-md
  - Or subtle scale: 1.02
  - Transition: --transition-normal

IMAGE:
  - Aspect ratio: 16:9
  - Object-fit: Cover
  - Width: 100%
  - Display: Block

CONTENT:
  - Padding: --space-5 (20px)
  - Title: --text-xl, --font-semibold
  - Description: --text-sm, --text-secondary
  - Margin-top: --space-3 (12px)

States:
  - Default
  - Hover (subtle elevation)
  - Focus (accessibility)
```

## 8.3 Journal cards

```text
STRUCTURE:
  - Image (16:9 ratio)
  - Content area
    - Title (H3)
    - Date (small, muted)
    - Excerpt (optional, 1-2 lines)
    - Related trail (optional, small link)

VISUAL TREATMENT:
  - Same as Trail card

ADDITIONAL FIELDS:
  - Date: --text-sm, --text-muted
  - Trail: --text-sm, --accent-primary, link
```

## 8.4 Food cards

```text
STRUCTURE:
  - Same as Journal card
  - Food is a category, not separate component

VISUAL TREATMENT:
  - Same as Journal card
```

## 8.5 Buttons

### Primary button

```text
BACKGROUND: --accent-primary
TEXT: White or --bg-surface
PADDING: --space-3 --space-5 (12px 20px) medium
BORDER-RADIUS: --radius-md (8px) [PROVISIONAL]
FONT: --font-body, --font-medium
SIZE: --text-base (16px)

HOVER:
  Background: --accent-hover
  Transition: --transition-fast

FOCUS:
  Outline: 2px solid --accent-primary
  Outline-offset: 2px
```

### Secondary button

```text
BACKGROUND: Transparent
BORDER: 1px solid --accent-primary
TEXT: --accent-primary
PADDING: Same as primary

HOVER:
  Background: --accent-primary
  Text: White

FOCUS: Same as primary
```

### Tertiary (text link)

```text
BACKGROUND: None
BORDER: None
TEXT: --accent-primary
UNDERLINE: On hover or always
PADDING: 0

HOVER:
  Color: --accent-hover
  Text-decoration: underline
```

### Button sizes

```text
Small:  --space-2 --space-4 (8px 16px), --text-sm
Medium: --space-3 --space-5 (12px 20px), --text-base
Large:  --space-4 --space-6 (16px 24px), --text-lg
```

## 8.6 Footer

```text
BACKGROUND: --dark-bg (near-black)
TEXT: --dark-text (off-white)
LINKS: --dark-text, hover: --accent-primary (or lighter variant)

LAYOUT:
  Desktop: 4 columns
  Tablet: 2 columns
  Mobile: Stacked

COLUMNS:
  1. Brand name + statement
  2. Explore (navigation)
  3. Follow (social)
  4. Contact

PADDING:
  --space-16 to --space-20 (64-80px) vertical
  --space-6 to --space-8 (24-32px) horizontal

BORDER-TOP:
  None or subtle dark border

COPYRIGHT:
  --text-sm, --dark-accent
  Margin-top: --space-8 (32px)
```

## 8.7 Forms (Admin)

```text
INPUT:
  Background: --bg-surface
  Border: 1px --border-default
  Border-radius: --radius-md (8px) [PROVISIONAL]
  Padding: --space-3 --space-4 (12px 16px)
  Font-size: --text-base (16px)

FOCUS:
  Border-color: --accent-primary
  Outline: None or subtle

LABEL:
  Font-size: --text-sm (14px)
  Font-weight: --font-medium
  Margin-bottom: --space-2 (8px)
  Color: --text-primary

SELECT:
  Same as input
  Appearance: Custom or native

TEXTAREA:
  Same as input
  Min-height: 120px
  Resize: Vertical
```

---

# 9. Responsive Design Principles

## 9.1 Mobile-first approach

```text
DESIGN ORDER:
  1. Design mobile first
  2. Enhance for tablet
  3. Enhance for desktop

NOT:
  - Desktop first
  - Shrink desktop for mobile
  - Afterthought responsive
```

## 9.2 Breakpoints

```text
Mobile:  0 - 767px
Tablet:  768px - 1023px
Desktop: 1024px+
```

## 9.3 Responsive behaviors

### Navigation

```text
Mobile:  Hamburger menu (full-screen overlay)
Tablet:  Hamburger or expanded (space permitting)
Desktop: Full horizontal navigation
```

### Grids

```text
Mobile:  1 column (full width cards)
Tablet:  2 columns
Desktop: 3-4 columns (depending on context)
```

### Hero

```text
Mobile:  Full width, stacked content, reduced height
Tablet:  Full width, centered content
Desktop: Full width, centered content, full height
```

### Cards

```text
Mobile:  Full width, stacked
Tablet:  50% width (2 per row)
Desktop: 33% or 25% width (3-4 per row)
```

### Typography

```text
Mobile:  Reduced sizes (h1: --text-4xl, not --text-6xl)
Tablet:  Intermediate sizes
Desktop: Full sizes
```

### Images

```text
Mobile:  Full width, may crop to fit
Tablet:  Full width or constrained
Desktop: Constrained by container
```

### Sections

```text
Mobile:  Stacked, full width
Tablet:  May use 2-column layouts
Desktop: Full layout options
```

### Map

```text
Mobile:  Simplified interaction, tap-based
Tablet:  Standard interaction
Desktop: Full interaction, hover tooltips
```

### Full-screen sections

```text
Mobile:  Reduced height (not full viewport)
Tablet:  May be full height
Desktop: Full viewport height
```

## 9.4 Touch-friendly interaction

```text
MINIMUM TOUCH TARGET: 48px x 48px

APPLIES TO:
  - Navigation links (mobile)
  - Buttons
  - Card tap targets
  - Map markers
  - Pagination
  - Form inputs

SPACING:
  - Between touch targets: minimum 8px
  - Prefer 12-16px spacing
```

---

# 10. Cinematic / Storytelling Principles

## 10.1 Visual storytelling

```text
THE SITE SHOULD FEEL:
  - Editorial
  - Journal-like
  - Personal
  - Exploratory
  - Cinematic (but not over-produced)

NOT:
  - Corporate
  - Template-driven
  - Generic travel site
  - Tourism board
  - Feature-focused
```

## 10.2 Content presentation

```text
JOURNAL POSTS:
  - Long-form content
  - Generous whitespace
  - Inline images
  - Readable line length (65-75 characters)
  - Editorial pacing

TRAIL PAGES:
  - Location-focused
  - Practical information
  - Visual gallery
  - Connected to journal stories

HOMEPAGE:
  - Journey-like flow
  - Progressive disclosure
  - Invitation to explore
  - Not a dump of content
```

## 10.3 Photography treatment

```text
PHOTOGRAPHY IS PRIMARY:
  - Large, high-quality images
  - Minimal text interference
  - Let images tell stories

NOT SECONDARY:
  - Small thumbnails
  - Heavy overlays
  - Decorative backgrounds only
```

## 10.4 Editorial rhythm

```text
SECTION PACING:
  - Alternate section backgrounds (light/dark/cream)
  - Vary content density
  - Include visual pauses (white space)
  - Don't stack heavy sections

CONTENT FLOW:
  - Hero (impact)
  - Introduction (context)
  - Trails (discovery)
  - Seasonal (emotion)
  - Map (exploration)
  - Journal (stories)
  - Food (culture)
  - Gallery (visual)
  - About (connection)
  - Footer (closure)

VISUAL WEIGHT:
  - Heavy (full-bleed images)
  - Light (text on cream)
  - Medium (cards on cream)
  - Dark (cinematic sections)
  - Alternate for rhythm
```

## 10.5 Dark/light contrast

```text
DARK SECTIONS:
  - Near-black backgrounds
  - Light text
  - Cinematic feel
  - Used for emphasis

LIGHT SECTIONS:
  - Cream backgrounds
  - Dark text
  - Editorial feel
  - Used for readability

ALTERNATION:
  - Don't stack dark sections
  - Don't stack light sections
  - Alternate for visual rhythm
  - Use transitions (overlap, gradient)
```

---

# 11. Animation Direction

## 11.1 Core principles

```text
1. PURPOSEFUL: Animation serves UX, not decoration
2. SUBTLE: Enhances, doesn't distract
3. NATURAL: Feels organic, not mechanical
4. CINEMATIC: Slow and intentional
5. PERFORMANCE: 60fps, no jank
6. ACCESSIBLE: Respects prefers-reduced-motion
7. CONSISTENT: Similar interactions, similar animations
```

## 11.2 Animation types

### Page transitions

```text
V1: Minimal page transitions
Content replaces, no dramatic transitions

FUTURE: Fade or slide transitions
```

### Scroll animations

```text
GSAP + ScrollTrigger for:
  - Section reveal on scroll
  - Parallax effects (subtle)
  - Hero text animation
  - Counter animations (if needed)

NOT for:
  - Every element
  - Distracting effects
  - Performance-heavy animations
```

### Micro-interactions

```text
BUTTON HOVER:
  - Subtle color change
  - Or subtle transform (scale/translate)

CARD HOVER:
  - Subtle elevation change
  - Or subtle scale

LINK HOVER:
  - Color change
  - Or underline appear

IMAGE HOVER:
  - Subtle zoom (optional)
  - Or subtle overlay
```

### Loading states

```text
SKELETON LOADING:
  - Card grids
  - Image galleries
  - Content areas

SPINNER:
  - Form submissions
  - Individual actions
```

## 11.3 Reduced motion

```text
ALL ANIMATIONS MUST RESPECT:
  prefers-reduced-motion: reduce

PROVIDE FALLBACK:
  - No animation
  - Instant state changes
  - Static alternatives
```

## 11.4 What to avoid

```text
AVOID:
  - Excessive bouncing
  - Generic SaaS animations
  - Constant motion
  - Animation that hurts performance
  - Animation that interferes with reading
  - Animation that causes accessibility problems
  - Parallax on mobile (performance)
```

---

# 12. Accessibility Principles

## 12.1 Color contrast

```text
ALL TEXT MUST MEET WCAG AA:
  - Normal text: 4.5:1 contrast ratio
  - Large text: 3:1 contrast ratio

PROVISIONAL COLORS MUST BE TESTED
for contrast before finalization.
```

## 12.2 Focus states

```text
ALL INTERACTIVE ELEMENTS MUST HAVE:
  - Visible focus indicator
  - Keyboard accessible
  - Logical tab order

FOCUS STYLE:
  - Outline or border change
  - High contrast
  - 2px solid, offset 2px
```

## 12.3 Semantic HTML

```text
USE PROPER HEADING HIERARCHY:
  - H1: One per page
  - H2: Sections
  - H3: Subsections

USE LANDMARKS:
  - header, nav, main, footer
  - Sections with headings
```

## 12.4 Image accessibility

```text
ALL IMAGES MUST HAVE:
  - Alt text (stored in database)
  - Descriptive, not keyword-stuffed
  - Decorative images: empty alt
```

## 12.5 Touch targets

```text
MINIMUM TOUCH TARGET: 48px x 48px
SPACING: 8px minimum between targets
```

---

# 13. Performance Principles

## 13.1 Image optimization

```text
NEXT.JS IMAGE COMPONENT:
  - Responsive sizing
  - Lazy loading
  - WebP/AVIF format
  - Blur placeholders

AVOID:
  - Huge unoptimized images
  - Background images via CSS
  - Unnecessary full-resolution
```

## 13.2 Hero media strategy

```text
HERO IMAGES:
  - Optimized for web (85-90 quality)
  - Responsive sizes
  - Lazy load below fold
  - Consider blur-up technique

HERO VIDEO (FUTURE):
  - Compressed
  - Lazy loaded
  - Poster image fallback
```

## 13.3 Animation performance

```text
USE:
  - transform and opacity for animations
  - requestAnimationFrame
  - Will-change sparingly

AVOID:
  - Animating layout properties (width, height, padding)
  - Complex filters on large elements
  - Animations on scroll without throttling
```

## 13.4 Mobile bandwidth

```text
PRIORITIZE:
  - Smaller images on mobile
  - Lazy load non-critical
  - Progressive loading
  - Reduce animation complexity
```

---

# 14. Tailwind / Design Token Preparation

## 14.1 CSS custom properties

```css
:root {
  /* Colors — PROVISIONAL */
  --color-background: #FDF8F0;
  --color-background-secondary: #F5EDE3;
  --color-surface: #FFFFFF;
  --color-text: #1C1917;
  --color-text-secondary: #78716C;
  --color-text-muted: #A8A29E;
  --color-accent: #3D5A3C;
  --color-accent-secondary: #8B5E3C;
  --color-accent-hover: #2D442C;
  --color-border: #E7E5E4;
  --color-border-default: #D6D3D1;
  --color-dark-bg: #1C1917;
  --color-dark-text: #F5F5F4;
  
  /* Typography — PROVISIONAL */
  --font-display: Georgia, "Times New Roman", Times, serif;
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
              "Helvetica Neue", Arial, sans-serif;
  
  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
  --spacing-20: 5rem;
  --spacing-24: 6rem;
  --spacing-32: 8rem;
  --spacing-40: 10rem;
  --spacing-48: 12rem;
  --spacing-64: 16rem;
  
  /* Border radius — PROVISIONAL */
  --radius-none: 0px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;
}
```

## 14.2 Tailwind theme extension

```javascript
// tailwind.config.js (if needed)
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        accent: 'var(--color-accent)',
        // etc.
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      spacing: {
        // Use default Tailwind spacing
      },
    },
  },
}
```

## 14.3 Avoid arbitrary values

```text
DON'T create dozens of arbitrary utility values.

USE:
  - CSS custom properties for design tokens
  - Tailwind defaults where possible
  - Consistent spacing scale
  - Limited, purposeful color palette
```

---

# 15. Design System Page Coverage

The proposed system must work across:

```text
PUBLIC PAGES:
  /               — Homepage (cinematic, editorial)
  /trails         — Trail index (cards, grid)
  /trails/[slug]  — Trail detail (hero, gallery, map)
  /journal        — Journal index (cards, grid)
  /journal/[slug] — Journal detail (editorial, longform)
  /food           — Food index (cards, filtered)
  /food/[slug]    — Food detail (editorial, longform)
  /about          — About (personal, editorial)
  /404            — Error (simple, branded)

ADMIN PAGES:
  /admin          — Dashboard (functional, simple)
  /admin/journal  — Journal CRUD (forms, tables)
  /admin/trails   — Trail CRUD (forms, tables)
```

## 15.1 Admin visual treatment

```text
ADMIN USES:
  - Simpler, functional visual language
  - Same color system (lighter usage)
  - Same typography (smaller scale)
  - Standard form components
  - Tables for lists

ADMIN DOES NOT USE:
  - Full-bleed cinematic sections
  - Heavy animations
  - Large hero images
  - Editorial layouts

ADMIN IS:
  - Functional
  - Clean
  - Efficient
  - Not branded cinematically
```

---

# 16. Open Decisions

## 16.1 LOCKED (Design principles)

```text
These can safely be treated as design principles:

  - Visual personality: Cinematic, warm, earthy, editorial, personal
  - Color direction: Cream + earthy accents + dark sections
  - Typography direction: Editorial serif headings + clean sans body
  - Spacing system: 4px base, consistent scale
  - Layout: Container-based, responsive grid
  - Image-first approach
  - Mobile-first responsive
  - Accessibility-first
  - Performance-conscious
  - Animation: Subtle, purposeful, GSAP
```

## 16.2 PROVISIONAL (Awaiting brand assets)

```text
These depend on missing brand assets:

  - Exact color hex values
  - Exact font families
  - Logo treatment
  - Brand-specific styling
  - Final accent color
  - Border radius values
  - Shadow depths
```

## 16.3 NEEDS OWNER APPROVAL

```text
These require project owner decision:

  1. Brand assets (logo, colors, typography) — CRITICAL
  2. Final color palette (after assets provided)
  3. Final font selection (after assets provided)
  4. Logo usage rules
  5. Any major visual direction change
  6. Gallery section treatment (if standalone later)
  7. Map visual style (if standalone later)
```

---

# 17. Missing Brand Assets

## 17.1 Critical (Must have before final design)

```text
[ ] Chittagong Trail logo (PNG/SVG with transparency)
[ ] Logo usage guidelines (if any)
[ ] Brand color palette (or permission to derive from logo)
[ ] Brand typography (or permission to select)
```

## 17.2 Important (Should have before final design)

```text
[ ] Logo variations (light/dark, icon-only, wordmark-only)
[ ] Brand photography examples
[ ] Existing brand materials (social media, etc.)
[ ] Any brand style guide (if exists)
```

## 17.3 Nice to have (Can refine later)

```text
[ ] Brand pattern/texture examples
[ ] Icon style preferences
[ ] Animation style references
[ ] Photography guidelines
```

---

# 18. Next Steps

## 18.1 Before design finalization

```text
1. Provide brand assets (logo, colors, typography)
2. Review provisional colors/fonts
3. Approve spacing system
4. Approve layout principles
5. Approve component principles
6. Approve responsive behavior
7. Approve animation philosophy
```

## 18.2 After brand assets provided

```text
1. Replace provisional colors with brand colors
2. Replace provisional fonts with brand fonts
3. Finalize logo treatment
4. Refine component styling to match brand
5. Create final design tokens
6. Update all documentation
7. Update globals.css and layout.tsx
```

---

# 19. Approval Gate

This document is not considered final until:

1. Brand assets are provided
2. Provisional values are replaced
3. Project owner approves final design system

After approval:

```text
DESIGN SYSTEM
      ↓
  APPROVED
      ↓
VISUAL DESIGN
      ↓
  APPROVED
      ↓
IMPLEMENTATION
```

Do not skip the approval gates.

---

# 20. Important Notes

## For future agents

```text
1. DO NOT invent final colors or fonts
2. DO NOT commit to provisional values
3. DO NOT begin visual implementation without approval
4. DO mark all provisional values clearly
5. DO ask for brand assets before finalizing
```

## For project owner

```text
1. Provide brand assets when available
2. Review and approve provisional approach
3. Confirm spacing/layout principles
4. Approve before visual design begins
```

---

**Design system awaits brand assets and approval.**
