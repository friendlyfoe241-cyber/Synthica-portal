# Synthica Brand Guidelines

A reference for designers, developers, and contributors building or extending the Synthica website (`synthica.org`). These guidelines are derived from the live codebase (`styles.css`, `src/index.css`, and page templates).

---

## 1. Brand Foundation

### Mission

Synthica makes **research approachable** for high school students worldwide. Programs, curriculum, mentorship, and publishing are **free** and **non-selective** by design.

### Positioning

| Attribute | Direction |
|-----------|-----------|
| Tone | Welcoming, direct, credible — never gatekeeping or prestige-obsessed |
| Audience | High school students, early-career researchers, educators, partners |
| Promise | Real output over prestige; zero cost; global access |
| Personality | Optimistic, student-led, academically serious but not intimidating |

### Primary Tagline

> **Research made approachable for YOU**

The word **YOU** is always emphasized in gold (`#FFD700`) with an animated underline on the homepage hero.

### Organization Name

- **Written form:** Synthica (capital S only)
- **Legal/context:** Synthica Research Group (editorial and affiliation contexts)
- **Domain:** `https://www.synthica.org`
- **Primary community CTA:** [Discord](https://discord.gg/8wPzZkGy5Z)

---

## 2. Logo & Visual Identity

### Logo Assets

| Asset | Path | Usage |
|-------|------|--------|
| Primary logo | `src/logo/Synthica Logo.png` | Navbar, footer, OG fallback |
| Favicon | `src/logo/Synthica Favicon.png` | Browser tab, `<link rel="icon">` |
| Social preview | `src/logo/Synthica Preview Image.png` | Open Graph / Twitter cards |
| Placeholder avatar | `src/logo/Synthica Preview Image (5).jpg` | Team members without photos |

React builds mirror assets under `public/assets/logo/`.

### Logo Usage Rules

- Always pair the logo mark with the wordmark **Synthica** in navigation and footer unless space is critically constrained (favicon only).
- Navbar: logo icon height ≈ `2rem`, wordmark at `1.5rem`, weight `700`, color **white** on hero backgrounds.
- Footer: logo icon + `Synthica` text in accent blue (`#78b4fb`).
- Minimum clear space: at least the height of the logo icon on all sides.
- Do not stretch, rotate, recolor the mark, or place it on busy non-brand backgrounds without the glass navbar treatment.

---

## 3. Color System

### Primary Palette — Sky Blue Gradient

The Synthica “sky” is the signature look. It anchors heroes and positive brand moments.

| Name | Hex | Role |
|------|-----|------|
| Sky Deep | `#2589ed` | Gradient start, links, journal accents |
| Sky Mid | `#4999e8` | Gradient step |
| Sky Light | `#69aaec` | Gradient step |
| Sky Pale | `#99ccff` | Gradient end, comparison card |
| Brand Blue | `#78b4fb` | Buttons, highlights, member roles, social hover |
| Brand Blue Dark | `#5c9eeb` | Button hover, gradients |
| Brand Blue Deep | `#1a6bb5` | Role badges (director), dark accents |

**Home hero gradient (vertical):**
```
#2589ed 0% → #4999e8 5% → #69aaec 35% → #99ccff 65% → #ffffff 100%
```

**Page hero gradient (subpages):** Same stops; used on About, Programs, Journal, Editorial Board, Work With Us.

### Accent — Gold

| Name | Hex | Role |
|------|-----|------|
| Gold | `#FFD700` | Hero emphasis, section title highlights, rotating text |
| Gold Soft | `#FFF176` | Glow effects (e.g. comparison “Synthica” title) |
| Gold Badge | `#ffd700` → `#ffb800` | Published badges on editorial cards |

**Highlight classes (use consistently):**
- `.highlight-text`, `.yellow-text`, `.highlight-blue` → gold `#FFD700` on heroes
- `.synthica-highlight` → brand blue `#78b4fb` in body sections
- `.highlight-you` → gold with animated underline
- `.yellow-highlight` → dark text with gold underline decoration
- `.blue-highlight` → gold text (despite the name)

### Neutrals & Text

| Name | Hex | Role |
|------|-----|------|
| Ink | `#0F172A` | Platform titles, step titles |
| Heading | `#1F2937` | Section titles, card headings |
| Body | `#6B7280` | Bios, subtitles, secondary copy |
| Body Alt | `#64748B` | Platform subtitle, step descriptions |
| Muted | `#4B5563` | Journal ledes |
| Slate | `#475569` | Affiliation tags (editorial board) |
| Border | `#e2e8f0` | Cards, form embeds |
| Surface Alt | `#f5f8fc` | Alternating journal/editorial sections |
| Surface | `#F9FAFB` / `#f1f5f9` | Section backgrounds |

### Semantic Colors

| Meaning | Hex | Usage |
|---------|-----|--------|
| Negative / contrast | `#EF4444` | “Scam programs” comparison card title |
| ORCID | `#A6CE39` | ORCID icon fill on editorial profiles |
| Success / upcoming | Brand blue gradients | “Releasing soon” status cards |

### Color Don’ts

- Do not introduce purple, neon green, or heavy dark-mode palettes on the main marketing site.
- Do not use gold and red together as co-primary accents.
- Keep body text on white/light surfaces dark gray — never pure black (`#000`).

---

## 4. Typography

### Primary Typeface — Garet

```html
<link href="https://fonts.cdnfonts.com/css/garet" rel="stylesheet">
```

```css
font-family: 'Garet', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

Garet is used **site-wide** for the main Synthica property (static HTML and React SPA). All new pages must load Garet before `styles.css` / `src/index.css`.

### Type Scale

| Element | Size | Weight | Color context |
|---------|------|--------|---------------|
| Home hero `h1` | `4rem` | `800` | White on sky gradient |
| Page hero title | `4rem` | `700` | White on sky gradient |
| Platform / section title | `3rem` | `700–800` | `#0F172A` or `#1F2937` |
| Footer CTA title | `2.5rem` | `700` | `#1F2937` |
| Featured member name | `2rem` | `600` | `#1F2937` |
| Hero / page subtitle | `1.5rem` / `1.125rem` | `400` | White or `#6B7280` |
| Section subtitle / lede | `1.125rem` | `400` | `#6B7280`, line-height `1.6–1.8` |
| Body / bio | `0.9–1rem` | `400` | `#6B7280` |
| Member role | `1rem–1.25rem` | `500` | `#78b4fb` |
| Section badge | `0.875rem` | `400` | `#333` on pill |
| Uppercase labels | `0.72rem` | `700` | `#2589ed`, letter-spacing `0.1–0.12em` |
| Role badges (editorial) | `0.7rem` | `700` | Uppercase, letter-spacing `0.08em` |

### Editorial & Hierarchy Rules

- **One hero headline per page.** Split-color titles: first word(s) in white or dark, emphasized word in gold.
- Section badges appear **above** section titles, centered.
- Prefer sentence case for badges (`Leadership`, `Coming Soon`) and title case for navigation.
- Avoid all-caps in long paragraphs; reserve uppercase for small labels and role badges.

---

## 5. Layout & Spacing

### Grid & Containers

| Token | Value | Usage |
|-------|-------|--------|
| Page max-width | `1200px` | Most sections (`.journal-container`, `.partnerships-container`, `.eb-container`) |
| Narrow content | `760–900px` | Ledes, FAQ, featured leader grid |
| Featured profile card | `1040px` max | About page Quang Bui card |
| Navbar width | `70vw` | Centered pill nav |
| Section padding | `6rem 2rem` | Standard vertical rhythm |
| Features platform | `8rem 0` | Homepage overview block |

### Border Radius

| Element | Radius |
|---------|--------|
| Navbar | `50px` (full pill) |
| Primary buttons | `25–30px` |
| Cards (standard) | `16–24px` |
| Leader / editor cards | `16–20px` |
| Badges / pills | `20px` or `999px` |
| Dropdown menus | `12px` |

### Responsive Breakpoints

Primary tuning occurs at **`768px`** and **`480px`** in `styles.css`. Mobile patterns:
- Single-column grids
- Reduced hero type (`4rem` → smaller)
- Navbar and feature grid stack vertically
- Editorial leader grid → `1fr`

---

## 6. Visual Language — Glassmorphism

Synthica’s UI is built on **frosted glass** surfaces over soft gradients.

### Core Recipe

```css
background: rgba(255, 255, 255, 0.15–0.75);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.3–0.4);
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05–0.08);
```

### Where It Appears

- Navbar (15% white on hero)
- Dropdown menus (98% white)
- Feature / partnership / team cards
- Footer CTA panel (`rgba(255,255,255,0.5)`)
- Editorial leader and editor cards
- Status cards (“Releasing soon”, “Applications open”)

### Shadows

- Resting: soft, low-opacity (`0 4px 15–20px rgba(0,0,0,0.05–0.08)`)
- Hover: lift `translateY(-2px to -4px)` with deeper shadow
- Navbar: `0 8px 32px rgba(0, 61, 130, 0.2)` for sky context

---

## 7. Components

### 7.1 Navigation

**Structure (all pages):**

```
Logo → Home | About ▾ | Journal ▾ | Programs ▾ | Work with us ▾ | [Join Us Now]
```

| Item | Links |
|------|-------|
| About | Our Mission, Our Team |
| Journal | About, Aims & Scope, For Authors, Policies, Submit, Editorial Board |
| Programs | Competition (external), SISTER Program, Research Group, Free Course |
| Work with us | Partnerships, Sponsorships |

**Behavior:** Hover-activated dropdowns with 150ms close delay. Dropdown links darken to `#1F2937`, hover background `rgba(120,180,251,0.1)`, text shifts `#78b4fb`.

**Join Us Now:** Always links to Discord. Uses `.join-btn` styling.

### 7.2 Buttons

Three button families share the same glass-blue DNA:

| Class | Context |
|-------|---------|
| `.join-btn` | Navbar CTA |
| `.hero-cta-btn` | Homepage hero |
| `.footer-cta-button` | Footer CTA block |

**Primary button style:**
- Gradient: `rgba(120,180,251,0.9)` → `rgba(120,180,251,0.7)`
- White text, weight `600`
- Inset highlight via `::before` pseudo-element
- Hover: full opacity blue, `translateY(-2px)`

Secondary patterns: `.cta-primary-button`, `.journal-btn-primary` on Journal pages.

### 7.3 Section Badge

```html
<div class="section-badge">Leadership</div>
```

Pill with light gray fill, subtle border, centered above `.section-title`. Interchangeable with `.platform-badge` on homepage (`Overview`).

### 7.4 Section Title Pattern

```html
<h2 class="section-title">Founding <span class="yellow-text">Team</span></h2>
<p class="section-subtitle">Supporting sentence in gray.</p>
```

Alternate highlight spans: `.highlight-text`, `.highlight-blue` (both gold on heroes).

### 7.5 Cards

| Card type | Class | Use |
|-----------|-------|-----|
| Partnership / program | `.partnership-type-card` | 3-column feature grids (SISTER, Work With Us, Free Course preview) |
| Team member | `.team-member-card` | About team grid |
| Featured leader | `.featured-member-card` | About core team spotlight |
| Research group feature | `.research-group-feature` | Icon + title + description row |
| Editorial leader | `.eb-leader-card` | Founding team (Editorial Board) |
| Editorial editor | `.eb-editor-card` | Senior / Associate / Review editors |
| Status | `.status-card.upcoming-status` | Coming soon, announcements |
| Comparison | `.comparison-card` | Synthica vs. scam programs |

**Card hover:** Always subtle lift — never aggressive scale transforms.

### 7.6 Footer

`.footer-cta-combined` — gradient from white to cool gray-blue (`#D4DFEC`), containing:

1. **CTA block** — glass card, gold-highlighted keyword in title, Discord button
2. **Bottom bar** — logo, © year, LinkedIn + Instagram icons

Copyright format: `© {year} Synthica. All rights reserved.`

### 7.7 Icons

- **UI icons:** Coolicons SVG set at `src/coolicons/coolicons SVG/`
- **Social:** Inline SVG (LinkedIn, Instagram) — `currentColor`, hover to `#78b4fb`
- **ORCID:** Green circle `#A6CE39` with white glyph on editorial profiles

Icon sizing in cards: typically `28–40px` inside `.partnership-type-icon` or `.feature-icon`.

### 7.8 Homepage-Specific

| Component | Notes |
|-----------|-------|
| Colleges scroller | Heading: **“Backed by researchers from”** + looping university logos |
| Rotating text | Gold (`.rotating-text`), cycles value props in platform title |
| Globe hero (React) | `Home.jsx` — split layout with 3D globe, meteors |
| Comparison section | Red “Scam Programs” vs. blue gradient “Synthica” with glowing yellow wordmark |
| FAQ | Accordion with `+` icon toggle |
| Steps | Numbered circles `#78b4fb`, vertical connector line |

### 7.9 Editorial Board Patterns

**Leadership cards** include: circular photo (120px), role badge, optional published badge, name, ORCID link, affiliation pills, left-aligned bio.

**Editor cards** include: 72px avatar (photo or gradient initials), category label, name, ORCID, affiliations, optional bio.

**Category tracks** (editor grid labels):
Biology, Computer Science, Chemistry, Economics, Mathematics, Physics, Psychology, Humanities

**Avatar fallback:** Deterministic gradient from name hash (see `AVATAR_COLORS` in `EditorialBoard.jsx`).

### 7.10 Journal Page

Journal HTML uses shared `styles.css` plus inline journal-specific rules:
- `.journal-section` / `.journal-section-alt` alternating backgrounds
- `.journal-lede` for intro copy
- `.journal-submit-card` for pre-submit checklist
- Google Form embed: bordered container `#e2e8f0`, iframe height `800px`
- Label style: uppercase blue `0.72rem` for “Submit directly below”

---

## 8. Motion & Interaction

| Effect | Implementation |
|--------|----------------|
| Smooth scroll | `html { scroll-behavior: smooth; }` |
| Nav link hover | `translateY(-2px)` |
| Dropdown | Fade + `translateY` over `0.3s ease` |
| Button hover | `translateY(-2px)`, stronger shadow |
| Card hover | `translateY(-3px to -4px)` |
| YOU underline | CSS keyframe `underline-animation` 0.6s |
| Rotating headline | `slideUp` / `slideInUp` keyframes |
| Synthica glow | `glow-pulse` on comparison card |
| React pages | `framer-motion` fade-in (`opacity 0→1`, `y 20→0`, `0.55–0.6s`) |
| Stats / counters | IntersectionObserver-triggered count-up on About |
| FAQ | Class toggle `.active` on `.faq-item` |

**Principle:** Motion should feel light and confident — never bouncy or playful to the point of undermining academic credibility.

---

## 9. Photography & Imagery

- **Team photos:** Circular crops, `object-fit: cover`, often `object-position: top center` for editorial.
- **College logos:** Grayscale or muted full-color in scroller; consistent height in track.
- **Editorial photos:** Prefer professional headshots; fallback to initials on brand-blue gradient.
- **No stock clutter:** Avoid generic “students with laptops” hero imagery; the sky gradient + globe carries the homepage.

---

## 10. Voice & Copy Guidelines

### Do

- Lead with **accessibility** and **zero cost**
- Use plain language: “learn how to do research,” not “leverage synergistic inquiry”
- Emphasize **global community** (Discord, 93+ countries, 1000+ researchers)
- Name real institutions and programs when factual
- Keep CTAs action-oriented: **Join Us Now**, **Get notified on Discord**, **Submit a Manuscript**

### Don’t

- Imply exclusivity or pay-to-win dynamics
- Overpromise publication outcomes
- Use jargon without explanation
- Reference removed programs or people in public copy without verifying the codebase

### Sample CTA Hierarchy

1. **Primary:** Discord community (`https://discord.gg/8wPzZkGy5Z`)
2. **Secondary:** Program-specific pages, Journal submission
3. **External:** Global Research Challenge (`https://globalresearchchallenge.org`)
4. **Contact:** `quang@synthica.org` (journal inquiries)

---

## 11. Information Architecture

### Static HTML Pages (production on Vercel)

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Main landing |
| About | `about.html` | Mission, team |
| Journal | `journal.html` | Author guidelines + submit form |
| Editorial Board | `editorial-board.html` | Leadership + editors |
| Research Group | `research-group.html` | Program landing |
| SISTER Program | `sister-program.html` | Program landing |
| Free Course | `free-course.html` | Coming-soon course landing |
| Work With Us | `work-with-us.html` | Partnerships + sponsorships |

### React SPA Routes (`src/App.jsx`)

Mirrors key pages for dev/preview: `/`, `/about`, `/journal`, `/editorial-board`, `/research-group`, `/sister-program`, `/free-course`, `/work-with-us`, `/newsletter`, `/admin`.

**Rule:** When changing brand elements, update **both** `styles.css` (static HTML) and `src/index.css` (React) unless intentionally scoped.

---

## 12. SEO & Social Metadata

### Required Meta Pattern

```html
<meta property="og:site_name" content="Synthica">
<meta property="og:image" content="https://www.synthica.org/src/logo/Synthica Preview Image.png">
<link rel="canonical" href="https://www.synthica.org/{page}">
```

### Structured Data

Homepage uses `EducationalOrganization` schema. Journal uses `Periodical`. Maintain JSON-LD on new top-level pages where applicable.

---

## 13. Implementation Checklist for New Pages

- [ ] Load **Garet** from CDN Fonts
- [ ] Link `styles.css`
- [ ] Use `page-hero` + `page-navbar` for subpages (or `.header` for full-viewport home-style)
- [ ] Copy nav dropdown structure from `index.html`
- [ ] Include `footer-cta-combined` with Discord CTA
- [ ] Center content in `1200px` max container
- [ ] Use `section-badge` + `section-title` + `section-subtitle` hierarchy
- [ ] Apply glass card pattern for content blocks
- [ ] Primary CTA → Discord unless page-specific action is clearer
- [ ] Add dropdown hover script (copy from existing HTML pages)
- [ ] Mirror changes in React page + `src/index.css` if the route exists

---

## 14. File Reference

| Purpose | Primary file |
|---------|--------------|
| Static site styles | `styles.css` |
| React SPA styles | `src/index.css` |
| Shared navbar (React) | `src/components/Navbar.jsx` |
| Shared footer (React) | `src/components/Footer.jsx` |
| Icons | `src/coolicons/coolicons SVG/` |
| Logo assets | `src/logo/` |

---

## 15. Brand in One Glance

```
Font:     Garet
Sky:      #2589ed → #99ccff → #ffffff
Accent:   #78b4fb (interactive) + #FFD700 (emphasis)
Surface:  White glass + soft gray sections
Shape:    Rounded pills and 16–24px cards
Feel:     Open, academic, global, free
CTA:      Join the Discord community
```

---

*Last updated: June 2026 — reflects the codebase at `synthica.org` main branch.*
