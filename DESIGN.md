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

# Shoman Center Design System

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

### Authenticated workspace landing pages — 2026-10-20

`features/workspaces` owns the real learner dashboard, learning-availability view and admin overview. The visual anchor is a quiet welcome panel with a gold book-edge rule and small geometric star; task cards use existing cream/navy tokens, Cairo, native links and a single outline icon. No made-up KPI totals or synthetic progress appear in authenticated surfaces. Admin list previews state that they show only a first-page excerpt. Natural document scroll, wrapped task grids/account identifiers, visible focus and reduced-motion overrides follow sibling pages. `AdminShell` remains the administration navigation owner with an active dashboard tab; learner landing navigation belongs to the workspace feature. Existing authored demo dashboards stay in the preview gallery.


## Academy motion — 2026-10-21

The academy now vendors actual component source listed on 21st.dev, with full MIT licenses and pinned upstream revisions in `THIRD-PARTY-NOTICES.md`.

- `src/components/ui/shimmer-button.tsx`: Magic UI Shimmer Button's moving conic perimeter, highlight and backdrop; adds a semantic Next.js link variant. Used by primary landing CTAs and learner/admin preview sidebar discovery links.
- `src/components/ui/animated-grid-pattern.tsx`: Magic UI Animated Grid Pattern's ResizeObserver, generated cells and Motion opacity sequence. Geometric star tiles and gold replace the original grey Cartesian grid. Used in hero and preview/live admin shell edges.
- `src/components/ui/border-beam.tsx`: Magic UI Border Beam's offset-path animation and border mask, gold/cream instead of purple. Used on track cards and preview dashboard sidebar intro.
- `src/components/ui/carousel.tsx`: shadcn/ui Carousel's Embla hook, context, select/reInit synchronization and controls. RTL direction, Arabic controls and instant navigation under reduced motion are academy adaptations. `AcademySlider` is its wrapper for tracks and the content hub.
- `src/components/ui/blur-fade.tsx`: Magic UI Blur Fade reveals landing sections on viewport entry, including repeat entry. Dashboard cards use the same rise/fade direction through native Web Animations. Keyboard focus reveals content immediately. Server-rendered content remains readable.
- `motion` and `embla-carousel-react` are explicit runtime dependencies. Sliders show a partial next card at every breakpoint and advance every 4.5 seconds while visible. Arabic pause/resume, previous/next and pagination controls supplement RTL drag and keyboard navigation. Hover, focus, hidden tabs and reduced motion suspend autoplay; manual pause persists until resumed. Content remains horizontally scrollable without JavaScript.
- Decorative effects replay on viewport entry: grid pulse under four seconds, beam four seconds. Shimmer runs for three seconds on mount; hover/focus adds an 850ms face sweep and 4px lift. Landing reveals take 750ms and dashboard cards 700ms, without layout shifts. Reduced motion uses static tiles, no border beam, no shimmer and instant carousel transitions. Native semantics, focus indicators, existing preview disclaimers and API/session behavior are preserved.
- Global styles and animation keyframes live in `src/app/globals.css`; runtime color tokens retain their authority.

### Counters and scroll progress — 2026-10-21

- `src/components/ui/animated-counter.tsx` (Magic UI Number Ticker pattern, locally written): counts up once on viewport entry for landing stats, learner stat tiles and admin stat cards. Handles Latin and Arabic-Indic digits, thousands separators and prefixes like "+". Server HTML and reduced motion show the final value; `aria-label` carries the final value. Sample values stay labelled as examples.
- `src/components/ui/scroll-progress.tsx`: 3px gold progress bar on the landing page and the learner/admin workspace shell; hidden under reduced motion.
- `parallax-layer.tsx`: stats-section photo drifts ±60px against scroll. `tilt-card.tsx`: track cards lean up to 6° toward a mouse/pen pointer (not touch/keyboard). Hero gold heading text shifts its gradient slowly. All three are off under reduced motion.
- `islamic-pattern.tsx`: chained eight-pointed-star (khatam) geometry drifting diagonally over 28s; the medallion and light sweep were removed at product owner request. Fixed behind the whole landing page (and stretched over the full learner/admin workspace body), plus on top of the stats and CTA photos; static under reduced motion. Gold via `currentColor` from the `--gold` token.
- Learner and admin workspaces get a top-fading `IslamicPattern` (lattice only, stronger than the original design restraint, per product owner request) behind content; it follows the same reduced-motion and forced-colors rules.
- `scroll-effects.tsx`: on the landing page, section headings rise, grid items stagger in (every fourth zooms), two-column layouts slide in from opposite sides, footer columns rise. Uses the individual `translate`/`scale` properties with a backwards-filled animation so hover transforms still work. Not applied under reduced motion; content is visible without JS.
- Slider update: looping, center-aligned coverflow style (active card full size with gold ring, neighbours scaled .9 and dimmed), 2.2s autoplay with a 20-frame glide, and smaller cards (about 3.8 visible on desktop, 66% width on mobile). Supersedes the 4.5s / partial-next-card description above.

### Authentication glass surface — 2026-10-21

The supplied login design now owns the auth route family: a centered translucent card over a smoky navy/blue canvas. Auth-local tokens are deep navy `#0b1d3a`, royal blue `#1b3a66` / `#4678d2`, cream `#fbf7ee`, and gold `#d4af55` for the book-emblem ring, focus indicators, and small feedback borders only. Other route tokens retain their existing ownership. Cairo, Arabic RTL, real Server Actions, password visibility, field errors and recovery routes remain canonical. `src/components/ui/login-form.tsx` owns the shared visual shell/background; feature auth components own form behavior. No social OAuth controls or divider are rendered. Smoke animates for at most 4.5 seconds per entrance/resize, pauses in hidden tabs, respects live reduced-motion preference, and falls back to a static navy/blue CSS background without WebGL. All animation frames, listeners and GPU resources are cleaned up on unmount.

### Marketing journeys — 2026-10-22

`src/features/marketing` extends the established Cairo/Arabic RTL academy identity with a navy introductory band, a quiet learning-journey rail, book-spine sample track cards and cream reading surfaces. Gold remains a thin marker/ring rather than a large surface. Existing global tokens remain authoritative; feature CSS derives its colors from them. `/preview/marketing` owns fifteen explicitly labeled exploration/tool pages covering the adopted marketing scope. Desktop section navigation becomes a native mobile selector (platform popup accepted). The scannable certificate QR uses the `qrcode` library with a sufficient quiet zone and points only to an explicit sample verification route; it does not represent a real credential.

### Student and teacher entry placement — 2026-10-22

The landing hero has two explicit role-preview entries: «انضم كطالب» opens `/preview/dashboard`; «انضم كمعلم» opens `/instructor`. Both are labeled preview navigation and never create accounts or assign roles. Registration remains in the existing authentication flow. The landing adds a quiet four-card discovery section for optional guidance, track journeys/videos, free challenges and scholarships, using existing cream/navy tokens, Cairo and restrained accents.

`features/marketing/discovery.tsx` owns reusable audience-specific cards. Student dashboards own discovery, companions, badges, family, scholarships, seasonal content, meetings and certificate samples. The teacher dashboard owns notification composition and a meeting link retaining teacher navigation context. Administration owns the track-card/video editor. Marketing sidebars and mobile selectors list only the current audience's pages; they are navigation organization, never authorization. This supersedes the earlier mixed public/tools marketing navigation.

### Reference alignment and teacher canvas — 2026-10-23

User reference: `/home/mohamed/Downloads/landing-page.jpeg`, a visual source for section layout, feature icon metaphors, device mockup, photographic counter ribbon and review/community composition. It supplies no verified academy outcomes, reviews, accreditation or totals. Existing runtime tokens and local media assets remain canonical; no new theme or duplicated icon system is introduced.

Teacher dashboard and teacher marketing tools use one fixed decorative khatam layer behind the full viewport, covering sidebar/content spacing and long-page gaps. It is isolated beneath content, aria-hidden, ignores pointer events, and uses the existing no-preference animation/forced-colors/reduced-motion contract. Other dashboard backdrop variants retain their prior scope. Admin navigation now exposes student notifications separately from campaigns. Admin message composition reuses the canonical marketing audience component with admin-specific permission wording rather than duplicating filter/modal logic.

### Auth Islamic motion and local trial entry — 2026-10-23

The user replaced the smoky login background with the canonical animated khatam geometry. Auth screens keep the navy/royal-blue canvas and translucent card; restrained gold lines animate with the existing IslamicPattern motion and remain static for reduced motion. The shared pattern is decorative and noninteractive; forced colors removes it. This supersedes the earlier smoke-canvas background ownership; the old exported smoke component is no longer rendered by auth forms.

Login may show «تعبئة بيانات التجربة» only when a dedicated local student trial account is explicitly configured. The button fills the normal email/password fields without submitting or changing return destinations. The nearby copy identifies a shared trial account. No existing administrator or user credentials are supplied. Server configuration is disabled by default and only accepts the reserved trial-email pattern.

### Platform dark theme and rounded discovery panels — 2026-10-23

User requested a platform-wide dark mode and header toggle. `globals.css` owns the `.dark` semantic token set: deep navy background, raised navy cards, cream body text, light royal-blue links/actions, restrained gold accents and visible dark borders. Dedicated navy photographic banners retain cream foregrounds; QR imagery remains white/navy for scanning. Feature CSS uses semantic surfaces rather than fixed white fields, including profile/catalog/workspaces/marketing controls and status colors. Auth retains its intentionally navy canvas in both modes.

The shared ThemeToggle appears once in each runtime header, with an Arabic action label, pressed state, visible focus and44px target. Preference follows the device until explicitly selected, persists as appearance-only localStorage and synchronizes between tabs. A constrained head bootstrap applies it before first paint; ThemeSync owns device/storage listeners and cleanup. Storage failure leaves interactive toggling available. This supersedes the earlier light-only presentation policy without changing account settings or API behavior.

The ambiguous “second three sections” request was interpreted as the three sections immediately after the hero: Needs, Tracks and landing discovery. They share softly rounded32px token-based background panels with responsive gutters; anchors, sliders and authentication behavior are preserved.

### Open landing sections and revised footer — 2026-10-23

The user withdrew the rounded-background treatment. Needs, Tracks and landing discovery again sit on the open page canvas, with their individual cards unchanged. This supersedes the rounded32px panel addition above.

The footer now has a restrained navy surface, a deeper dark-mode variant, cream text with readable muted hierarchy, small gold heading/ring accents, one brand column and three navigation groups. Known learning/academy/account destinations use real internal links; account links reflect signed-in navigation. Social controls stay visibly unavailable pending channel configuration. Desktop uses four columns, tablet gives the brand a full row, and mobile places account links across the final row. The developer-directory footer link is removed.

The all-pages sidebar shortcut is no longer rendered on student workspace surfaces. Staff role previews and administration retain their existing access to the design directory.

### GPT category artwork — 2026-10-23

At the user’s request, the eight Needs category symbols now use individually generated transparent GPT illustrations: a book, graduation cap, family, leaf, Quran stand, prayer niche, supplication hands and heart. A ninth full-bleed mosque illustration completes the row. New `need-*-gpt-v2.png` assets preserve earlier artwork. Navy, royal blue and cream dominate, with small gold edge accents. These are illustrative objects, not academy photography or verified outcomes. Arabic labels remain real text; decorative cutouts use empty alt text. Fixed image dimensions and Next Image optimization preserve layout and avoid delivering full-size originals to small cards. Both themes use the same transparent artwork. Section backgrounds remain open.

### Student workspace routing and translucent panels — 2026-10-23

Signed-in `/dashboard` and `/my-learning` now reuse the complete learner dashboard and activity-list presentation inside the canonical workspace shell, after the existing server-side session and current-user checks. The real account name accompanies the persistent sample-data notice: these screens do not claim actual enrollment or saved progress. Student sidebar and bottom navigation use `/dashboard`, `/my-learning`, and `/account`. Learning opens with the current-activity filter selected; completed and purchased samples remain available through explicit filters. Sidebar navigation flows with the document rather than owning a fixed-height scroll area; mobile keeps the existing collapsible navigation and bottom bar.

The user restored rounded backgrounds for Needs, Tracks and landing discovery with an82% semantic-card surface, letting the underlying geometric pattern remain visible. Learner groups use72% panels and88% card surfaces. Opacity applies to backgrounds only; text and controls retain full contrast. This supersedes the open-section treatment while preserving both themes and reduced-motion behavior.

### Wider landing canvas — 2026-10-23

The landing page uses a shared 100rem (1600px) content maximum instead of 1280px, including the header, rounded sections, nested track content and footer. Existing responsive gutters and narrow reading measures remain in place. This wider canvas is specific to the public landing page.

### Unified student workspace canvas — 2026-10-23

The student workspace, platform header and footer share a 1600px maximum with 24px desktop outer gutters. One decorative pattern belongs to the workspace shell, spans both columns and uses 16% opacity to keep text clear. The student sidebar surface stretches with its content column; it remains in document flow without internal scrolling. Mobile uses the full width, the canonical collapsed menu and bottom navigation. Teacher and administration backdrop owners are unchanged.

### Softer light landing pattern — 2026-10-23

The light landing-page pattern uses 12% opacity, reduced from 40%. Dark-mode pattern opacity and rounded panel surfaces retain their existing values.

### Published landing interests and open student canvas — 2026-10-24

The student dashboard no longer has a maximum-width or rounded outer frame. Header, workspace and footer retain responsive gutters; one fixed decorative Islamic pattern covers the whole viewport, respecting reduced motion and forced colors. This supersedes the bounded student canvas. Light landing pattern opacity remains12%; dark mode retains40%.

The Needs section is now sourced from the public Laravel homepage endpoint. Only published, enabled cards render; a load failure shows a retry state instead of hardcoded replacements. Known local illustration keys map to the nine GPT assets. Cards and the section action lead to validated catalogue destinations and direct guests through login. Administrators with `homepage.manage` use `/admin/homepage/needs` to edit section text, add/remove/reorder/hide cards, choose artwork and photo/icon treatments, save drafts and confirm publishing. Native image/style selects intentionally use platform popups. Unsaved navigation uses an academy dialog; page unload uses the native lifecycle warning. Version conflicts preserve the editor contents and offer a reload. Laravel owns validation, authorization, draft/public separation, version locking and audit writes.

### Local admin trial entry — 2026-10-24

The login form can show «تعبئة بيانات المدير» beside the student trial entry when local demo mode and the dedicated admin trial flag are explicitly enabled. Only a reserved `trial-admin-*` account may be exposed. Filling does not submit; explicit return destinations are preserved, otherwise admin trial login opens `/admin/dashboard`. Other administrator credentials remain private. Registration and recovery screens never render these controls.

### Center naming and administrator entry — 2026-10-24

The displayed brand is مركز د. حازم شومان. Administrator and center-manager logins default to `/admin/dashboard`, which presents the existing design directory with explicit preview labels and permission-based connected-service links. Real administrative records remain available through the expandable connected tools and dedicated routes. Student entry remains `/dashboard`; safe explicit return destinations are preserved.

### Admin statistics and full-page geometry — 2026-10-24

The admin preview dashboard presents its overview and sample statistics before charts, review tasks, activity, and marketing discovery. Preserve sample labels: these are not live platform totals. Admin workspace geometry has a single fixed viewport layer with restrained 16% field opacity; it spans page margins and gaps in both themes. The sidebar stretches with the document and keeps the existing mobile toggle. Live administrative pages share the same background treatment.

### Teacher dashboard composition — 2026-10-24

Teacher entry uses the fluid RTL workspace with a document-height sidebar and the shared restrained 16% geometry. Navigation covers the existing teaching tools, preparation checklist, discussions, communication previews, guidance and account. Overview cards count available interface tools, never students or operational activity. The order is heading, tool overview, preparation guidance, teaching tasks, checklist and permissions, then communication. Two communication cards fill two equal columns on wide screens. Mobile navigation remains collapsible without an internal scrolling sidebar.


## CSV CRUD controls — CSV-CRUD-20261025

Live admin CRUD surfaces share `src/features/administration/csv/controls.tsx` and the private same-origin `/api/admin/csv/[resource]/[operation]` boundary. Existing cards, native file inputs, inline Arabic feedback and confirmation dialog remain canonical. Export includes all matching results rather than one cursor page; templates come from Laravel. Imports are atomic, bounded to 200 rows/1 MiB, require explicit confirmation, expose server row errors and never automatically retry uncertain outcomes. Homepage imports save drafts only; unsaved homepage edits disable CSV and pending CSV disables save/publish. The FAQ CSV-only tool is permission-gated in the connected administration overview; it does not imply a delivered FAQ editor. Backend authorization remains authoritative and tokens never reach browser code.

### Stronger dashboard typography — 2026-10-26

All dashboard workspaces retain the existing Cairo family with loaded real font weights. Sidebar links use 14px/700 and active links800; group labels12px/800 and workspace names15px/800. Dashboard body defaults to16px/600 with generous1.9 line height, headings/table headers/key values800 and controls/labels700. Smaller contextual notices keep their documented size. Apply through shared workspace/admin selectors so learner, teacher, admin previews and connected CRUD screens agree, while the public landing and religious Amiri text retain their own hierarchy. Verify both themes and narrow widths for wrapping and overflow after the weight/size increase.

### Read-only audit reader — SH-805C, 2026-10-28

`src/features/administration/audit` owns the live redacted audit table. It reuses `AdminShell`, `CursorNavigation` and the audit export-only `CsvControls` variant; current system-administrator role and audit.view permission govern discovery and server reads. The dedicated `/admin/audit-logs` route owns its shared style imports and localized noindex metadata. `audit/audit.css` owns only table geometry and the labeled overflow region's visible focus; natural document scrolling, shared tokens and sibling forms retain their established owners. The native RTL table displays seven permitted metadata fields, LTR-isolated identifiers, explicit UTC timestamps and neutral unavailable values. No total, analytics or historical identity/detail lookup is implied. Contract evidence: workspace `docs/superpowers/specs/2026-10-28-live-audit-log-design.md`, Binding contract; backend `Modules/Administration/app/Http/Resources/AuditLogResource.php`, toArray.
