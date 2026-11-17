# Bloom — Social Studio

## Implementation plan

Build a static React workspace in the existing web-db-user starter. The product is a single-page social media copywriting studio for Bloom flower shop, with three connected flows in one workspace: create campaign, review platform previews, and schedule posts into a weekly calendar. Keep data local in React state for this first static release; uploaded files use object URLs in the browser and the six preloaded bouquet images use managed storage URLs. AI copy generation is represented by an intentional, short local loading state that produces platform-tailored sample copy from the chosen bouquet, holiday, and offer.

The app structure will keep the existing `client/src/App.tsx` router and place the product UI in `client/src/pages/Home.tsx`, with global styling in `client/src/index.css`. `client/public/manus-routes.json` will declare the `/` route. Bouquet assets are referenced from managed storage paths returned by the image generation tool. `app.config.ts` will provide a durable logo URL for project metadata.

## Product behavior

- Create page is the default view and is the main workspace.
- Users can choose a preloaded bouquet photo or upload a new image.
- Users can select a holiday and an offer; the selected context is reflected in the generation summary.
- “Generate all 3 posts” runs a brief loading state and updates Instagram, RedNote, and Facebook preview cards together.
- Each preview resembles a real phone post with platform-specific header and caption treatment.
- Generated post chips are draggable and can be dropped into weekly calendar day slots.
- Calendar view shows five sample posts already assigned across one week and supports moving generated posts into empty slots.
- Library view shows all six preloaded bouquet photos with names and use counts.
- The UI is responsive and stays usable at narrower widths by stacking the create studio and collapsing the calendar strip.

## Project structure

- `client/src/pages/Home.tsx`: main Bloom Studio app, view navigation, generation state, library, calendar, and preview components.
- `client/src/index.css`: floral magazine visual system, responsive layout, mobile post cards, interaction states, and typography.
- `client/public/manus-routes.json`: route manifest for the single-page workspace.
- `app.config.ts`: project logo metadata.
- `plan.md`, `TODO.md`: approved plan and outcome tracking.

## Design direction

### Candidate styles

- Floral magazine editorial — 0.06
- Quiet luxury florist ledger — 0.04
- Soft atelier dashboard — 0.08

Chosen: **Floral magazine editorial**.

- **Design Movement:** Contemporary botanical editorial design, pairing the calm of a printed flower magazine with the confidence of a studio tool.
- **Core Principles:** Generous white space, clear editorial hierarchy, tactile paper-like surfaces, and soft but legible contrast.
- **Color Philosophy:** Warm ivory keeps the canvas light like uncoated paper; blush pink marks creation and warmth; sage green carries action, status, and the living quality of the brand; charcoal ink keeps dense copy readable.
- **Layout Paradigm:** A narrow left studio rail anchors the workspace while the right canvas opens into a large editorial workbench. The create flow is split into an image-led setup rail and an asymmetric preview field rather than a centered card grid.
- **Signature Elements:** Fine hairline rules, tiny uppercase editorial labels, and rounded photo thumbnails with generous breathing room.
- **Interaction Philosophy:** Actions should feel like arranging stems: deliberate, calm, and easy to undo. Dragging a post into the calendar is the main tactile moment.
- **Animation:** Use restrained fades and short 180–220ms lifts on cards and buttons. Generation gets a subtle shimmer, never a loud spinner.
- **Typography System:** Cormorant Garamond for wordmark, section titles, and preview copy; DM Sans for navigation, metadata, labels, and controls. Use italic serif sparingly for editorial emphasis.
- **Brand Essence:** Bloom is the calm command center for turning beautiful stems into a week of thoughtful social moments; warm, observant, composed.
- **Brand Voice:** Headlines are short and gently confident. Example lines: “A little more bloom in the week.” and “Write the feeling before you write the caption.”
- **Wordmark & Logo:** A lowercase `bloom` wordmark paired with a small four-petal line mark, treated like a florist’s pressed-stem signature.
- **Signature Brand Color:** `#C98788`, a dusty petal rose used as Bloom’s ownable accent.
