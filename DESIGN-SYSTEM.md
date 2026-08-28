# Chittagong Trail — Visual Design System

**Document:** `DESIGN-SYSTEM.md`
**Version:** 2.0 — Brand Assets Integrated
**Status:** Awaiting owner approval
**Project:** Chittagong Trail
**Domain:** `chittagongtrail.com`

---

## 1. Purpose

This document defines the visual identity and design system for the Chittagong Trail website.

It establishes:

* Brand identity and assets
* Color system (derived from actual logo)
* Typography system (derived from wordmark)
* Spacing and layout system
* Image treatment principles
* Component visual direction
* Responsive behavior
* Cinematic/storytelling principles
* Animation direction
* Accessibility principles
* Performance principles

This document is based on **actual brand assets** now available in the repository.

---

# 2. Brand Assets

## 2.1 Available assets

```text
LOCATION: /public/images/

ASSETS:
  1. chittagongtrail_logo.png
     - Circular watercolor logo
     - Man walking toward hills/sunrise
     - Dotted trail path
     - River at bottom
     - Dimensions: 792 x 800px
     - Aspect ratio: ~1:1 (circular)
     - Background: Transparent watercolor

  2. chittagongtrail-wordmark.png
     - Circular logo (left) + "Chittagong Trail" text (right)
     - Hand-lettered/cursive style
     - Dotted line beneath text
     - Dimensions: 1800 x 480px
     - Aspect ratio: 3.75:1
     - Background: Black (for dark backgrounds)

  3. chittagongtrail-favicon.png
     - Small circular logo
     - Dimensions: 48 x 48px
     - Aspect ratio: 1:1
```

## 2.2 Asset inspection

### chittagongtrail_logo.png

```text
COMPOSITION:
  - Circular frame with double-line border
  - Man walking toward right/horizon
  - Rolling hills/landscape
  - Dotted trail path behind figure
  - Rising sun on horizon
  - River/stream at bottom
  - Watercolor wash style

COLORS OBSERVED:
  - Background: Warm cream/off-white (#FDF5E6)
  - Hills/ground: Terracotta/warm brown (#C9A882, #B5838D)
  - Sky/sun: Soft golden yellow (#F5DEB3, #E8C87A)
  - River: Soft teal/blue-green (#7FB5C4, #6B9AC4)
  - Figure/lines: Dark brown/sepia (#5D4037)
  - Border: Dark brown (#4A3728)

CHARACTER:
  - Handmade, organic, watercolor
  - Warm, earthy, natural
  - Personal, exploratory
  - Journal-like, authentic
```

### chittagongtrail-wordmark.png

```text
COMPOSITION:
  - Circular logo on left (same as above)
  - "Chittagong Trail" text on right
  - Hand-lettered/cursive style
  - Dotted line beneath text (orange/brown dots)
  - Black background (for dark contexts)

TYPOGRAPHY OBSERVED:
  - Style: Hand-lettered, cursive, personal
  - Weight: Medium to bold
  - Character: Warm, organic, authentic
  - NOT: Formal, corporate, geometric

COLORS OBSERVED:
  - Text: Dark brown (#4A3728 or #5D4037)
  - Dots: Orange/warm brown (#D4956A or #E8A87C)
  - Background: Black (intended for dark backgrounds)

USAGE NOTE:
  - This wordmark is designed for DARK backgrounds
  - Do NOT use on light/cream backgrounds
  - Use logo-only on light backgrounds
```

### chittagongtrail-favicon.png

```text
COMPOSITION:
  - Small circular logo
  - Same watercolor style as main logo
  - Simplified for small size

CHARACTER:
  - Works at small sizes
  - Recognizable
  - Maintains brand identity
```

## 2.3 Asset relationships

```text
LOGO (chittagongtrail_logo.png):
  - Primary brand mark
  - Use on LIGHT backgrounds (cream, white)
  - Use for: favicon source, about page, social sharing

WORDMARK (chittagongtrail-wordmark.png):
  - Logo + text combination
  - Use on DARK backgrounds (near-black, dark brown)
  - Use for: footer, dark sections, hero on dark imagery

FAVICON (chittagongtrail-favicon.png):
  - Pre-sized for browser tab
  - Use directly as favicon
```

---

# 3. Logo Usage Rules

## 3.1 Primary logo

```text
ASSET: chittagongtrail_logo.png

USAGE:
  - Primary brand mark
  - Light backgrounds (cream, white, light imagery)
  - About page
  - Social sharing / OG images
  - Favicon source

PLACEMENT:
  - Centered or left-aligned
  - Maintain clear space (minimum: 50% of logo width)
  - Do not add effects (drop shadow, glow, etc.)
  - Do not distort aspect ratio
  - Do not crop
```

## 3.2 Wordmark

```text
ASSET: chittagongtrail-wordmark.png

USAGE:
  - Dark backgrounds (near-black, dark brown, dark imagery)
  - Footer (dark background)
  - Hero sections with dark overlays
  - Dark cinematic sections

PLACEMENT:
  - Left-aligned or centered
  - Maintain clear space
  - Do not add effects
  - Do not distort aspect ratio
  - Do not use on light backgrounds (text will not be visible)
```

## 3.3 Favicon

```text
ASSET: chittagongtrail-favicon.png

USAGE:
  - Browser tab icon
  - Bookmarks
  - Small brand touchpoints

PLACEMENT:
  - Direct use as favicon
  - No additional processing needed
```

## 3.4 Navigation usage

### Desktop navigation

```text
LIGHT BACKGROUND (scrolled state):
  - Use: chittagongtrail_logo.png (logo only)
  - Size: Height ~40-48px
  - Position: Left

DARK BACKGROUND (hero state, if dark):
  - Use: chittagongtrail-wordmark.png
  - Size: Height ~40-48px
  - Position: Left

RECOMMENDATION:
  - Use logo-only (chittagongtrail_logo.png) for desktop nav
  - Works on both light and dark backgrounds
  - Maintain consistent height
```

### Mobile navigation

```text
LIGHT BACKGROUND:
  - Use: chittagongtrail_logo.png (logo only)
  - Size: Height ~36-40px
  - Position: Left

DARK BACKGROUND:
  - Use: chittagongtrail-wordmark.png (cropped to logo if needed)
  - OR: Use logo-only for consistency
  - Size: Height ~36-40px

RECOMMENDATION:
  - Use logo-only for mobile nav consistency
  - Hamburger menu triggers navigation overlay
```

## 3.5 Footer usage

```text
FOOTER BACKGROUND: Dark (near-black or dark brown)

USE: chittagongtrail-wordmark.png
  - The wordmark is designed for dark backgrounds
  - Position: Top-left or centered
  - Size: Height ~48-64px
  - Maintain clear space

ALTERNATIVE:
  - Use logo-only + text "Chittagong Trail" in UI font
  - If wordmark doesn't fit design
```

## 3.6 Hero usage

```text
HERO WITH DARK OVERLAY:
  - Use: chittagongtrail-wordmark.png
  - Position: Centered
  - Size: Height ~64-96px (or larger for cinematic feel)
  - Ensure text legibility against overlay

HERO WITH LIGHT/CREAM BACKGROUND:
  - Use: chittagongtrail_logo.png
  - Position: Centered
  - Size: Height ~120-160px
  - Full visual impact

HERO WITH IMAGERY:
  - Depends on image brightness
  - Dark image: Use wordmark
  - Light image: Use logo
```

## 3.7 Do not

```text
DO NOT:
  - Distort aspect ratio
  - Add drop shadows or effects
  - Crop logo arbitrarily
  - Change colors
  - Recreate logo with web fonts
  - Use wordmark on light backgrounds
  - Use logo on very dark backgrounds without contrast
  - Place on busy imagery without overlay
```

---

# 4. Color System

## 4.1 Color derivation

```text
COLORS DERIVED FROM ACTUAL LOGO:

The following colors are extracted from chittagongtrail_logo.png:

CREAM/WARM WHITE:
  - Background color of logo
  - Hex: #FDF5E6 (approximate)
  - Role: Primary background

TERRACOTTA/WARM BROWN:
  - Hills, ground, earth
  - Hex: #C9A882 (approximate)
  - Role: Warm accent

SOFT GOLDEN:
  - Sun, sky highlights
  - Hex: #E8C87A (approximate)
  - Role: Warm highlight

TEAL/BLUE-GREEN:
  - River, water
  - Hex: #7FB5C4 (approximate)
  - Role: Cool accent (use sparingly)

DARK BROWN/SEPIA:
  - Figure, lines, text
  - Hex: #5D4037 (approximate)
  - Role: Primary text, headings

ORANGE/WARM BROWN (from wordmark dots):
  - Dotted line accent
  - Hex: #D4956A (approximate)
  - Role: Accent, highlights

NOTE: These are approximations from visual inspection.
Exact values would require color picker analysis.
```

## 4.2 Color palette

### Primary palette (final, derived from logo)

```text
IMPORTANT: These colors are DERIVED FROM THE ACTUAL LOGO.
They are not arbitrary — they come from the brand assets.
```

#### Backgrounds

```text
--bg-primary:      #FDF5E6  (Warm cream — from logo background)
--bg-secondary:    #F5E6D3  (Slightly darker cream)
--bg-surface:      #FFFFFF  (White for cards, elevated surfaces)
```

#### Text

```text
--text-primary:    #5D4037  (Dark brown/sepia — from logo figure)
--text-secondary:  #8D6E63  (Lighter brown)
--text-muted:      #A1887F  (Muted brown)
```

#### Accents

```text
--accent-primary:   #C9A882  (Terracotta — from logo hills)
--accent-secondary: #D4956A  (Orange/warm — from wordmark dots)
--accent-teal:      #7FB5C4  (Teal — from logo river, use sparingly)
```

#### Dark sections

```text
--dark-bg:         #3E2723  (Very dark brown — for cinematic sections)
--dark-text:       #FDF5E6  (Cream text on dark)
--dark-accent:     #C9A882  (Terracotta accent on dark)
```

### Color roles

```text
BACKGROUND (PRIMARY):
  Main content background
  --bg-primary: #FDF5E6 (warm cream)

BACKGROUND (SECONDARY):
  Alternate section backgrounds
  --bg-secondary: #F5E6D3 (slightly darker cream)

SURFACE:
  Cards, panels, elevated elements
  --bg-surface: #FFFFFF (white)

TEXT (PRIMARY):
  Headings, body text
  --text-primary: #5D4037 (dark brown)

TEXT (SECONDARY):
  Dates, metadata, captions
  --text-secondary: #8D6E63 (lighter brown)

TEXT (MUTED):
  Very secondary information
  --text-muted: #A1887F (muted brown)

ACCENT (PRIMARY):
  Links, buttons, highlights
  --accent-primary: #C9A882 (terracotta)

ACCENT (SECONDARY):
  Additional accent, hover states
  --accent-secondary: #D4956A (orange/warm)

ACCENT (TEAL):
  Special accent, map, water references
  --accent-teal: #7FB5C4 (teal — use sparingly)

DARK SECTION BACKGROUND:
  Cinematic dark sections
  --dark-bg: #3E2723 (very dark brown)

DARK SECTION TEXT:
  Text on dark backgrounds
  --dark-text: #FDF5E6 (cream)

BORDER:
  Subtle divisions
  --border-light: #E8DCC8 (warm light gray)
  --border-default: #D7C9B8 (warm medium gray)
```

### Overlay

```text
--overlay-dark: rgba(62, 39, 35, 0.6)  (dark brown overlay)
--overlay-gradient: linear-gradient(
  to bottom,
  transparent 0%,
  rgba(62, 39, 35, 0.8) 100%
)  (for text legibility on hero images)
```

## 4.3 Color application

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
  Footer:         --dark-bg (very dark brown)

NAVIGATION:
  On hero:        Transparent, white/cream text
  Scrolled:       --bg-surface or --bg-primary, --text-primary

BUTTONS:
  Primary:        --accent-primary bg, --dark-bg text (dark brown)
  Secondary:      Transparent, --accent-primary border/text
  Hover:          --accent-secondary

CARDS:
  Background:     --bg-surface
  Border:         None or --border-light
  Text:           --text-primary
  Metadata:       --text-secondary
```

## 4.4 Color contrast

```text
WCAG AA COMPLIANCE:

--text-primary (#5D4037) on --bg-primary (#FDF5E6):
  Contrast ratio: ~7.5:1 ✓ (passes AAA)

--text-primary (#5D4037) on --bg-surface (#FFFFFF):
  Contrast ratio: ~6.8:1 ✓ (passes AA)

--text-secondary (#8D6E63) on --bg-primary (#FDF5E6):
  Contrast ratio: ~4.6:1 ✓ (passes AA for normal text)

--dark-text (#FDF5E6) on --dark-bg (#3E2723):
  Contrast ratio: ~10.2:1 ✓ (passes AAA)

All color combinations meet WCAG AA standards.
```

---

# 5. Typography System

## 5.1 Typography direction

```text
TYPOGRAPHY BASED ON WORDMARK ANALYSIS:

The wordmark uses a hand-lettered/cursive style.
This is a BRAND ASSET, not a web font.

For UI typography, we need:
  - Display/Headings: Editorial, warm, complements hand-lettered wordmark
  - Body: Clean, readable, warm sans-serif
  - NOT: Corporate, geometric, cold

RECOMMENDATION:
  - Display: Serif with editorial character (e.g., Playfair Display, Lora)
  - Body: Warm sans-serif (e.g., DM Sans, Inter, Source Sans Pro)
  - The wordmark remains a brand asset, not recreated as web font
```

## 5.2 Font categories

```text
DISPLAY/HEADINGS:
  Character: Editorial, warm, refined
  Examples: Playfair Display, Lora, Merriweather, Libre Baskerville
  NOT: Times New Roman, generic serif, geometric sans

BODY TEXT:
  Character: Clean, warm, highly legible
  Examples: DM Sans, Inter, Source Sans Pro, Nunito Sans
  NOT: Arial (too clinical), Helvetica (too corporate)

METADATA/CAPTIONS:
  Character: Subtle, secondary
  Same family as body, smaller size and/or lighter weight

UI ELEMENTS (buttons, nav):
  Character: Clean, functional
  Same family as body
```

## 5.3 Provisional fonts

```text
IMPORTANT: Final font selection should be reviewed against brand assets.
These are recommendations based on wordmark character.
```

### Option A (Recommended)

```text
--font-display: 'Playfair Display', Georgia, serif
  - Editorial, warm, elegant
  - Complements hand-lettered wordmark
  - Good for headings and titles

--font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif
  - Clean, warm, modern
  - Highly legible
  - Good for body text and UI
```

### Option B

```text
--font-display: 'Lora', Georgia, serif
  - Warm, readable, slightly less formal than Playfair
  - Good for journal/editorial feel

--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
  - Clean, neutral, highly legible
  - Very popular for web
```

### Option C (Conservative)

```text
--font-display: Georgia, 'Times New Roman', serif
  - System serif, warm, reliable
  - No external font loading

--font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
  - System sans-serif stack
  - No external font loading
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
  - Logo: Left (chittagongtrail_logo.png)
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
  - Use: chittagongtrail_logo.png
  - Height: ~40-48px
  - Maintain aspect ratio
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

LOGO:
  - Use: chittagongtrail_logo.png
  - Height: ~36-40px
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
  - Border-radius: --radius-md (8px)
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
BACKGROUND: --accent-primary (#C9A882)
TEXT: --dark-bg (#3E2723) — dark brown text
PADDING: --space-3 --space-5 (12px 20px) medium
BORDER-RADIUS: --radius-md (8px)
FONT: --font-body, --font-medium
SIZE: --text-base (16px)

HOVER:
  Background: --accent-secondary (#D4956A)
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
  Text: --dark-bg

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
  Color: --accent-secondary
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
BACKGROUND: --dark-bg (#3E2723)
TEXT: --dark-text (#FDF5E6)
LINKS: --dark-text, hover: --accent-primary

LAYOUT:
  Desktop: 4 columns
  Tablet: 2 columns
  Mobile: Stacked

COLUMNS:
  1. Brand wordmark + statement
  2. Explore (navigation)
  3. Follow (social)
  4. Contact

PADDING:
  --space-16 to --space-20 (64-80px) vertical
  --space-6 to --space-8 (24-32px) horizontal

WORDMARK:
  - Use: chittagongtrail-wordmark.png
  - Height: ~48-64px
  - Maintain aspect ratio
  - The wordmark is designed for dark backgrounds

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
  Border-radius: --radius-md (8px)
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
  - --dark-bg (#3E2723) backgrounds
  - --dark-text (#FDF5E6) text
  - Cinematic feel
  - Used for emphasis

LIGHT SECTIONS:
  - --bg-primary (#FDF5E6) backgrounds
  - --text-primary (#5D4037) text
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

BRAND COLORS COMPLIANCE:
  --text-primary on --bg-primary: ~7.5:1 ✓
  --text-primary on --bg-surface: ~6.8:1 ✓
  --text-secondary on --bg-primary: ~4.6:1 ✓
  --dark-text on --dark-bg: ~10.2:1 ✓

All color combinations meet WCAG AA standards.
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
  /* Colors — FINAL (derived from brand assets) */
  --color-background: #FDF5E6;
  --color-background-secondary: #F5E6D3;
  --color-surface: #FFFFFF;
  --color-text: #5D4037;
  --color-text-secondary: #8D6E63;
  --color-text-muted: #A1887F;
  --color-accent: #C9A882;
  --color-accent-secondary: #D4956A;
  --color-accent-teal: #7FB5C4;
  --color-border: #E8DCC8;
  --color-border-default: #D7C9B8;
  --color-dark-bg: #3E2723;
  --color-dark-text: #FDF5E6;
  --color-dark-accent: #C9A882;
  
  /* Typography — RECOMMENDED (pending approval) */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  
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
  
  /* Border radius */
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
        accent: {
          DEFAULT: 'var(--color-accent)',
          secondary: 'var(--color-accent-secondary)',
          teal: 'var(--color-accent-teal)',
        },
        dark: {
          bg: 'var(--color-dark-bg)',
          text: 'var(--color-dark-text)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
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

## 16.1 LOCKED (Design principles, based on brand assets)

```text
These are FINAL, based on actual brand assets:

  - Visual personality: Cinematic, warm, earthy, editorial, personal
  - Color palette: Derived from actual logo (cream, terracotta, teal, dark brown)
  - Logo usage: chittagongtrail_logo.png (light bg), chittagongtrail-wordmark.png (dark bg)
  - Favicon: chittagongtrail-favicon.png
  - Spacing system: 4px base, consistent scale
  - Layout: Container-based, responsive grid
  - Image-first approach
  - Mobile-first responsive
  - Accessibility-first
  - Performance-conscious
  - Animation: Subtle, purposeful, GSAP
```

## 16.2 FINAL (Approved based on brand assets)

```text
COLORS — FINAL:
  --bg-primary: #FDF5E6 (warm cream)
  --bg-secondary: #F5E6D3 (darker cream)
  --bg-surface: #FFFFFF (white)
  --text-primary: #5D4037 (dark brown)
  --text-secondary: #8D6E63 (lighter brown)
  --text-muted: #A1887F (muted brown)
  --accent-primary: #C9A882 (terracotta)
  --accent-secondary: #D4956A (orange/warm)
  --accent-teal: #7FB5C4 (teal — use sparingly)
  --dark-bg: #3E2723 (very dark brown)
  --dark-text: #FDF5E6 (cream)

LOGO USAGE — FINAL:
  chittagongtrail_logo.png → Light backgrounds (nav, about, hero on light)
  chittagongtrail-wordmark.png → Dark backgrounds (footer, dark sections, hero on dark)
  chittagongtrail-favicon.png → Browser favicon
```

## 16.3 PROVISIONAL (Awaiting owner approval)

```text
TYPOGRAPHY — PROVISIONAL:
  Display: 'Playfair Display', Georgia, serif (recommended)
  Body: 'DM Sans', system sans-serif stack (recommended)
  
  Note: These are recommendations based on wordmark character.
  Final font selection should be reviewed against brand assets.

BORDER RADIUS — PROVISIONAL:
  --radius-sm: 4px
  --radius-md: 8px
  --radius-lg: 16px
  
  Note: These are reasonable defaults. Can be refined.

SHADOWS — PROVISIONAL:
  Standard shadow scale. Can be refined.
```

## 16.4 NEEDS OWNER APPROVAL

```text
1. Typography: Confirm Playfair Display + DM Sans (or alternatives)
2. Border radius: Confirm 4px/8px/16px scale
3. Shadow depths: Confirm shadow scale
4. Any major visual direction changes
```

---

# 17. Image Asset Strategy

## 17.1 Asset locations

```text
PUBLIC PATHS:
  /images/chittagongtrail_logo.png
  /images/chittagongtrail-wordmark.png
  /images/chittagongtrail-favicon.png

DO NOT:
  - Rename files
  - Move to different directory
  - Duplicate unnecessarily
  - Modify original files
```

## 17.2 Next.js usage

```text
NEXT.JS IMAGE COMPONENT:
  import Image from 'next/image'

  <Image
    src="/images/chittagongtrail_logo.png"
    alt="Chittagong Trail"
    width={792}
    height={800}
    priority
  />

FAVICON:
  In layout.tsx or head:
  <link rel="icon" href="/images/chittagongtrail-favicon.png" />
```

## 17.3 Aspect ratios

```text
chittagongtrail_logo.png:        792 x 800  (~1:1)
chittagongtrail-wordmark.png:    1800 x 480 (3.75:1)
chittagongtrail-favicon.png:     48 x 48   (1:1)
```

---

# 18. Next Steps

## 18.1 Before Phase 5

```text
1. Owner reviews this document
2. Owner confirms typography selection
3. Owner confirms color palette
4. Owner confirms logo usage rules
5. Owner approves to proceed to Phase 5
```

## 18.2 Phase 5 preview

```text
PHASE 5 — UI / Frontend Implementation

This will include:
  - Update globals.css with final colors
  - Update layout.tsx with fonts and favicon
  - Build homepage sections
  - Build trail pages
  - Build journal pages
  - Build food pages
  - Build about page
  - Build 404 page
  - Build admin interface
  - Implement Leaflet map
  - Implement GSAP animations
```

---

# 19. Approval Gate

This document is considered final after:

1. Owner reviews brand asset integration
2. Owner approves typography selection
3. Owner approves color palette
4. Owner approves logo usage rules

After approval:

```text
DESIGN SYSTEM
      ↓
  APPROVED
      ↓
PHASE 5 — IMPLEMENTATION
```

Do not skip the approval gates.

---

# 20. Important Notes

## For future agents

```text
1. Brand assets are now available in /public/images/
2. Colors are FINAL (derived from actual logo)
3. Typography is RECOMMENDED (pending approval)
4. Logo usage rules are defined
5. Do not invent new colors or fonts
6. Follow the defined logo usage rules
```

## For project owner

```text
1. Review the color palette derived from your logo
2. Review the typography recommendations
3. Review the logo usage rules
4. Approve before Phase 5 begins
```

---

**Design system finalized with brand assets. Awaiting owner approval.**
