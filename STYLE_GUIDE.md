# Portfolio Style Guide
**Shreyansh Kumar — AI/ML Engineer**
Inspired by Studio Namma / Awwwards editorial aesthetic.

---

## Color Palette

### Design Tokens (CSS custom properties on `:root`)

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `--bg` | `#EFEFEB` | `#111111` | Page background |
| `--bg-card` | `#E8E8E3` | `#1A1A1A` | Elevated surfaces |
| `--text` | `#111111` | `#EFEFEB` | Primary text |
| `--text-muted` | `rgba(17,17,17, 0.45)` | `rgba(239,239,235, 0.42)` | Labels, secondary copy |
| `--border` | `rgba(17,17,17, 0.1)` | `rgba(239,239,235, 0.1)` | All dividing lines |
| `--hover-bg` | `#111111` | `#EFEFEB` | Fill on interactive hover |
| `--hover-text` | `#EFEFEB` | `#111111` | Text on hover fill |
| `--tag-bg` | `rgba(17,17,17, 0.06)` | `rgba(239,239,235, 0.07)` | Pill tag background |

### Fixed / accent colors (never change with theme)

| Value | Used for |
|---|---|
| `#FAEA5C` | Hero name, resume title, F1 championship years — the only yellow accent |
| `#001830` | F1 card background (Red Bull navy) |
| `#E8002D` | F1 team label (Red Bull red) |
| `#EFEFEB` | Art card overlay (always light, regardless of theme) |

**Rule:** Only use `#FAEA5C` sparingly as a single focal-point accent. Do not apply it to body text, labels, or decorative elements — it reads strongest when isolated.

---

## Typography

### Fonts

| Variable | Family | Use |
|---|---|---|
| `--font-display` | Space Grotesk | Headings, names, numbers, labels |
| `--font-body` | Inter | Body copy, descriptions |

Both are loaded from Google Fonts. Always reference via the CSS variable, never hard-code the family string.

### Scale reference

| Context | Size | Weight | Letter-spacing | Notes |
|---|---|---|---|---|
| Hero name | `clamp(72px, 12.5vw, 196px)` | 700 | `-0.03em` | Yellow `#FAEA5C` |
| Resume title | `clamp(48px, 7vw, 100px)` | 700 | `-0.03em` | Yellow `#FAEA5C` |
| Contact heading | `clamp(48px, 8.5vw, 120px)` | 700 | `-0.04em` | Uppercase |
| Section heading (interest/exp) | `clamp(20px, 2.2vw, 32px)` | 600 | `-0.02em` | Display font |
| Body copy | `14.5px` | 400 | normal | Inter, `line-height: 1.75`, `var(--text-muted)` |
| Section label | `10px` | 600 | `0.32em` | Uppercase, muted |
| Micro label | `9.5–10px` | 600 | `0.25–0.28em` | Uppercase, muted |
| Tag pill | `10–13px` | 400–600 | `0.1–0.14em` | Pill border-radius |

**Rule:** Display font (`Space Grotesk`) for anything structural — titles, numbers, names. Inter for prose and descriptions. Never mix them within the same role.

---

## Spacing & Layout

### Page-level

- Horizontal padding: **`44px`** on desktop, **`24px`** on mobile (`≤ 900px`)
- `--nav-h: 58px` — always offset sections that need to clear the fixed nav
- Section vertical padding: **`100px 44px`** (standard), reduced to `60px` for About

### Grid patterns used in the site

| Component | Grid | Notes |
|---|---|---|
| Hero top | `1fr 42%` | Text left, portrait right |
| About meta bar | `repeat(4, 1fr)` | Collapses to `1fr 1fr` at 900px |
| Interests list | `80px 1fr` (per row) | 80px column for number, rest for body |
| Experience list | `120px 1fr` (per row) | 120px for meta, rest for body |
| Projects | `1fr 1fr` | Side-by-side cards; single column at 900px |
| Skills | `1fr 1fr` with `gap: 64px 100px` | Two-column groups |
| Contact links | `100px 1fr auto` | Label / value / arrow |
| F1 stats | `repeat(4, 1fr)` | Inside the dark card |

### Easings

| Variable | Value | When to use |
|---|---|---|
| `--ease` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Default transitions, fades |
| `--ease-spring` | `cubic-bezier(0.16, 1, 0.3, 1)` | Scroll reveals, large movements |

---

## Components

### Section label
Always the first child of a section. Format: `NN — TITLE`.
```html
<div class="section-label">01 — ABOUT</div>
```
Style: `10px / weight 600 / tracking 0.32em / uppercase / var(--text-muted)`.

---

### Hover-indent rows
Any list row (interests, experience, certs, film list, contact links) uses a left-padding indent on hover to create depth:
```css
transition: padding-left 0.35s var(--ease);
/* on :hover */
padding-left: 16px; /* or 12px for smaller rows */
```
This is the core interaction pattern of the site. Apply it to any new list-style component.

---

### Scroll reveal
Attach `.reveal` to any element that should animate in on scroll. The JS `IntersectionObserver` in `script.js` handles staggering siblings automatically (75ms between each).
```html
<div class="exp-item reveal"> … </div>
```
The class adds `opacity: 0; transform: translateY(28px)`. On intersect, `.visible` is added which transitions to `opacity: 1; translateY(0)`.

---

### Tag pills
Two variants exist:

**Outline pill** (skills, experience tags):
```html
<span>Python</span> <!-- inside .skill-tags or .exp-tags -->
```
Border: `1px solid var(--border)`. On hover: fills with `var(--hover-bg)`.

**Filled pill** (project tags):
```html
<span>RAG</span> <!-- inside .project-tags -->
```
Background: `var(--tag-bg)`. On parent card hover: inverts to semi-transparent white.

---

### Card hover fill (project cards)
Wipe-up dark fill using a pseudo-element:
```css
.project-card::after {
    background: var(--hover-bg);
    transform: translateY(101%);
    transition: transform 0.55s var(--ease-spring);
}
.project-card:hover::after { transform: translateY(0); }
```
All child text transitions to `var(--hover-text)` on hover. Use this pattern for future full-bleed card hover effects.

---

### Full-bleed viewport-width element
Used by the music ticker to escape its grid column and span edge-to-edge:
```css
.music-ticker {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw;
}
```
Apply this when any element inside a padded/gridded parent needs to reach the viewport edges.

---

### Animated grain texture
Two-layer grain is used on the hero portrait and art gallery items. Never use a single layer — the depth comes from layering `screen` and `overlay` blend modes at different animation speeds.

**Layer 1 — dedicated element** (`.art-grain` / `.hero-image-grain`):
```css
mix-blend-mode: screen;
opacity: 0.88;
animation: grainShift 0.1s steps(1) infinite;
```

**Layer 2 — pseudo-element** (`::before`):
```css
mix-blend-mode: overlay;
opacity: 0.75;
animation: grainShift 0.15s steps(1) infinite reverse;
```

On hover, both grain layers fade to `opacity: 0` to reveal clean color underneath.

---

### Art gallery cards
Images/videos are `aspect-ratio: 16/10`, `border-radius: 14px`. The overlay card (`.art-card`) uses `inset: 15%` — covering roughly 70% of the image area — and holds a type label and bold title. It fades and slides down on hover.

To add a new item:
```html
<div class="art-item">
    <div class="art-grain"></div>
    <img src="assets/art/photo-X.jpg" alt="">
    <!-- OR: <video src="assets/art/video-X.mov" autoplay loop muted playsinline></video> -->
    <div class="art-card">
        <span class="art-card-type">PHOTO</span>
        <p class="art-card-title">Title<br>Here</p>
    </div>
</div>
```
Images must be JPG/PNG/WebP — HEIC is not browser-supported. Convert with: `sips -s format jpeg input.HEIC --out output.jpg`

---

### The Interstellar / film-feature block
Yellow `#FAEA5C` background, always. Title text is `#111111` in light mode, `#EFEFEB` in dark mode (explicitly overridden — the yellow background is fixed so the text needs to adapt, not the background):
```css
.film-hero { color: #111111; }
[data-theme="dark"] .film-hero { color: #EFEFEB; }
```

---

### F1 driver card
Dark navy `#001830` card, fixed (does not adapt to theme). Internal color assignments:
- Team label: `#E8002D`
- Driver name: `#ffffff`
- Championship years: `#FAEA5C`
- Watermark numeral: `rgba(255,255,255, 0.04)`
- Stats dividers: `rgba(255,255,255, 0.08)`

If adding a new "dark themed" card for a different subject, follow the same pattern: fixed dark background, white body text, yellow `#FAEA5C` for the key highlight number.

---

## Dark Mode

Toggled by setting `data-theme="dark"` on `<html>`. All colors reference CSS variables so they adapt automatically. Exceptions that need explicit overrides:

- `.film-hero` — text color (background is fixed yellow)
- `.film-feature-meta` — text color on yellow background
- `.art-card` — always uses hardcoded `#EFEFEB` background (it's intentionally "a piece of paper")
- F1 card — fully fixed colors, no theme adaptation needed

When adding new components: use only `var(--bg)`, `var(--text)`, `var(--text-muted)`, `var(--border)`, etc. Only reach for hardcoded hex values when the element has a fixed "identity" color that shouldn't invert (like the yellow INTERSTELLAR banner or the Red Bull card).

---

## Animation Reference

| Name | Effect | Used on |
|---|---|---|
| `lineReveal` | Slide up from `translateY(105%)` + fade | Hero name lines |
| `fadeUp` | Fade + `translateY(16px)` up | Hero tagline |
| `fadeIn` | Pure opacity 0→1 | Hero footer, hero image panel |
| `grainShift` | 10-step background-position shift | All grain layers |
| `scrollPulse` | scaleY pulse on vertical bar | Hero scroll indicator |
| `ticker` | `translateX(0 → -50%)` infinite | Music artists ticker |
| `.reveal` / `.visible` | `opacity + translateY(28px)` on scroll | All section content |

**Rule for new entrance animations:** prefer `fadeUp` (subtle) for secondary content, `lineReveal` (dramatic) only for large display text. Keep `animation-delay` under `1s` total from page load.

---

## Adding a New Section

1. Add a `<section>` with `padding: 100px 44px` (or reuse the shared `section` rule).
2. First child: `<div class="section-label">NN — TITLE</div>`.
3. Number the section label sequentially from existing ones.
4. If it's a list: use the `80px 1fr` / `120px 1fr` two-column grid pattern with `border-bottom: 1px solid var(--border)` on each row.
5. Add `.reveal` to each animated child.
6. Apply `transition: padding-left 0.35s var(--ease)` + `:hover { padding-left: 16px }` to any row-style items.
7. Keep body copy at `14–15px / Inter / line-height 1.75 / var(--text-muted)`.

## Adding a New Interest Item

Copy the structure of an existing `.interest-item`. Use `.interest-item--wide` if the body content (e.g. a gallery) is significantly taller than a standard block. Update the `interest-num` span sequentially. The hover-indent animation is inherited automatically.

---

## File Structure

```
portfolio/
├── index.html          # Landing page (hero, about, interests, contact)
├── resume.html         # Resume page (experience, projects, skills, certs)
├── style.css           # Single shared stylesheet
├── script.js           # Cursor, dark mode, scroll reveal, nav blur
├── STYLE_GUIDE.md      # This file
└── assets/
    ├── hero-portrait.jpg
    ├── Shreyansh_Kumar_Resume.pdf
    └── art/
        ├── photo-1.jpg   (sketch)
        ├── photo-2.jpg   (photo)
        ├── video-3.mov   (video, crop: object-position center top)
        └── photo-4.jpg   (photo)
```

Both HTML pages share the same `style.css` and `script.js`. The nav dark mode toggle state is page-scoped (not persisted across navigation) — if persistence matters in future, use `localStorage`.
