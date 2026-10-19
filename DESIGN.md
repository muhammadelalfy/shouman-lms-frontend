---
version: 1
name: Shoman Academy
description: Arabic-first Islamic learning platform with a quiet Cairo academy identity, warm paper surfaces, ink navy, and restrained gold.
colors:
  primary: "#1A3453"
  navy: "#132643"
  gold: "#CC9B49"
  gold-text: "#604008"
  background: "#FAF7EE"
  surface: "#FFFFFF"
  text: "#192941"
  muted: "#586474"
  border: "#E5DFD1"
  success: "#1F7A4D"
  warning: "#8F5300"
  danger: "#B42318"
typography:
  sans:
    fontFamily: "Cairo, ui-sans-serif, system-ui, sans-serif"
  display:
    fontFamily: "Cairo, ui-sans-serif, system-ui, sans-serif"
  quran:
    fontFamily: "Amiri, serif"
  mono:
    fontFamily: "ui-monospace, monospace"
rounded:
  DEFAULT: "0.875rem"
  sm: "0.375rem"
  md: "0.75rem"
  lg: "0.875rem"
  xl: "1.25rem"
spacing:
  section-gap: "3.5rem"
  page-max: "77.5rem"
components:
  button: "Shared native link/button semantics; primary navy, warm outline, and text actions."
  card: "White or cream surface, warm border, restrained shadow, RTL content order."
  dialog: "Native dialog for forthcoming-feature explanations; labeled, keyboard dismissible."
  form: "Native fields with Arabic labels and inline server-validation feedback."
  status: "Text and icon accompany color; never color-only."
---

# Shoman Academy Design System

## Overview

### Creative North Star

A calm study room in an Arabic Islamic academy: cream paper, deep ink-blue headings, and small gold marks that feel like a book’s gilded edge. The visual signature is a restrained geometric star/arabesque used in large background areas or section dividers, never behind reading text. The homepage’s supplied photographs remain the source for its own imagery; Claude’s updated system export supplies the reusable component and color direction for the rest of the site.

### Product context and register

- **Audience and primary job:** visitors discover academy offerings; learners follow structured study when those services are available; staff manage content and users through role-gated tools.
- **Target market(s) and evidence:** Arabic-first academy, as established by `docs/requirements/srs.md` and the user stories. Market-specific legal or age rules remain open decisions.
- **Locale(s) and language policy:** Arabic is the current application locale and default `lang="ar" dir="rtl"`. Latin identifiers, prices, dates, URLs, and English labels use local `dir="ltr"` spans where useful. A full English locale switch is not implemented.
- **Usage scene:** phone-first visitor discovery and learning; staff tools are desktop-oriented but must reflow for narrow viewports.
- **Register:** hybrid — public home is the selected Build-Exactly composition; non-home screens use Claude’s updated cream/navy/gold system; product and admin routes use clear, task-first content.
- **Memorable signature:** a quiet geometric star motif paired with Amiri religious quotations and generous breathing room.
- **Restraint:** keep actions and reading hierarchy clear; use gold as a small accent rather than as body text on cream.
- **Anti-references:** generic LMS dashboards with dense purple gradients, decorative AI-generated Islamic clichés, text over busy patterns, and controls that look live when no operation exists.
- **Token ownership/runtime mapping:** `frontend/src/app/globals.css` is the canonical runtime token source. This file mirrors its accepted values; semantic aliases are exposed by Tailwind v4 `@theme inline`. The updated Claude tokens in `frontend/Full system design progress/tokens.css` and HTML exports are design references, not a second runtime theme. See `frontend/UX-CONTRACT.md` for route and behavior ownership.

## Colors

The runtime palette uses OKLCH for browser rendering; the frontmatter hexes are readable mirrors of those values. `--primary` is the action navy (`oklch(0.32 0.065 255)`); `--navy` is the deeper shell color (`oklch(0.27 0.06 258)`). `--gold` (`oklch(0.72 0.115 78)`) is decorative on light surfaces; gold text uses the darker `--accent-foreground` value (`oklch(0.4 0.08 75)`). `--background` is warm cream, `--card` stays white, and warm borders separate surfaces. Destructive and status colors retain their semantic meaning. Focus uses the visible ring token; selected and status states include labels/icons in addition to color. No dark theme is currently supported.

## Typography

Cairo is used for Arabic headings, body text, controls, and Latin fallback. Amiri is reserved for Quranic/religious quotations. Keep display weights for short headings, body copy at readable sizes, and line-height generous for Arabic. Use tabular numerals for dense counts/prices when available. Mixed-direction identifiers and currency are isolated with `dir="ltr"`; do not reverse Arabic text to accommodate English fragments.

## Layout

The platform is mobile-first. Use the established responsive composition from the selected homepage and warm Claude page examples. Content regions cap near 1240px; detailed content pages use a narrower reading measure. Use logical CSS properties and a 24px desktop / 16px narrow-screen horizontal gutter. Cards and list/detail views reflow into one column on mobile. Keep route navigation visible and stable; avoid fixed viewport clipping except in an active modal/drawer. Verify at 320, 360, 390, 768, 1024, and 1440px; dense admin tables may scroll inside their labeled container.

## Elevation & Depth

Use tonal surfaces and warm hairline borders first; use soft navy-tinted shadows for floating cards and overlays. Reserve stronger shadow and blur for an active dialog or floating menu. Avoid glass effects behind long reading content. No dark-mode adaptation is currently implemented.

## Shapes

Controls use 6–12px radii; cards use the 14–20px range already established in runtime surfaces; pills are fully rounded only for compact status/filters. Dividers are thin and warm. Icons use Lucide outline strokes with text labels for ambiguous actions.

## Components

### Foundational visual states

Interactive controls keep stable geometry in rest, hover, focus-visible, active, disabled, and busy states. Status colors pair with words and icons. The app uses inline errors and a visible loading state for forms; skeletons are reserved for data-loading routes when the user needs layout continuity. Preview routes label sample content clearly and never imply a saved action.

### Buttons and actions

One navy primary action per decision area; warm outline or text action for secondary navigation; danger color only for a confirmed destructive operation. Use specific Arabic verbs. Links navigate; buttons mutate or open an interaction. Preserve at least 44px targets for primary touch actions.

### Navigation and data display

Public navigation uses a compact header and real route links. Authenticated destinations are not exposed as working operations unless the session/API is available. Catalog lists use API cursor pagination and supported filters only; never simulate page numbers for a cursor API. Empty, no-results, API failure, and not-found states remain distinct.

### Forms and overlays

Operational forms reuse feature Zod schemas and Next.js Server Actions. Laravel calls are server-only; session credentials stay in httpOnly cookies. Errors render inline and at a summary; preserve non-sensitive values, never echo passwords. Native dialog remains the preview explanation owner; live administration uses the shared confirmation dialog in `src/features/administration/components/confirmation-dialog.tsx`.

### Iconography

Lucide outline icons, usually 18–24px, with consistent stroke width. Decorative icons are hidden from assistive technology; icon-only controls need localized accessible names. Directional icons follow the RTL flow.

### Motion

Use the installed GSAP only where a meaningful content reveal exists; routine navigation and form feedback stay immediate. Existing page animation utilities must respect `prefers-reduced-motion`. Reserve layout geometry before revealing content and avoid movement that shifts reading or focus.

### Content and data visualization

Arabic copy is concise and task-oriented. Sample/demo content is visibly identified. Prices, course outlines, availability, statuses, progress, and permissions become operational only when sourced from an approved API; the E5 screens show labeled synthetic examples and never imply a saved outcome. The admin dashboard includes one explicitly synthetic chart with its values also available as text; production analytics await an approved contract.

### E5 screen composition

The `/preview` directory links the public, learner, and admin screen examples. Every example displays a persistent preview notice. Public discovery uses open page sections; learner and admin screens use a shared RTL workspace with a responsive navigation disclosure. Forms, filters, quiz choices, lesson notes, and dialogs change local in-memory state only. Navigation to real catalog, identity, and account routes remains available, with server-owned API/session behavior. Reuse the shared primitives in `src/features/experience/shared/` and keep each domain screen in its own feature family.

## Do's and Don'ts

- **Do:** preserve the active homepage composition and use the aligned Claude system on routes beyond it.
- **Do:** keep API-backed catalog content traceable to visible offering resources.
- **Don't:** imply enrollment, payment, certificate issuance, quiz passing, upload, or admin mutations succeeded without a backend operation.
- **Don't:** use muted gold as small text on white/cream or use decorative patterns behind body copy.

## Frontend administration increment — 2026-10-19

Supported user/role and curriculum administration now lives in `src/features/administration`. Its live `/admin/users`, `/admin/roles`, and `/admin/offerings` routes use existing cream/navy/gold shared styles and server-owned API adapters. These routes supersede earlier preview-only descriptions for those capabilities. Every admin design example is explicitly under `/preview/admin/...`; unsupported legacy administration destinations remain labeled previews.

The live authoring signature is the restrained gold start-edge on nested curriculum cards: it expresses subject/lesson hierarchy rather than introducing a separate visual system. Forms use persistent inline feedback, native selects, typed ISO timestamps preserving offsets, and cancel-first native confirmation dialogs. No new tokens or fonts were introduced.
