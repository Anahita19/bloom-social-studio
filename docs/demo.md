# Bloom Social Studio — Demo Guide

## Demo goal

Show how Bloom turns one floral idea into three platform-native posts and a scheduled week. The demo is designed to take about three minutes.

## Walkthrough

### 1. Start in Create

The default view is the campaign workbench. Choose **Blush peony** from the bouquet rail. The selected photo is echoed in the setup panel and in each of the three mobile previews.

### 2. Set the feeling

Keep **Mother's Day** as the occasion and **Free handwritten note** as the offer. The setup area intentionally keeps the inputs compact: one photo, one moment, one reason to act.

### 3. Generate all three voices

Click **Generate all 3 posts**. Bloom shows a short writing state and then refreshes all three previews together:

- Instagram uses a warm, hashtag-aware caption.
- Xiaohongshu (RedNote) uses a bilingual, conversational caption with Chinese hashtags.
- Facebook uses a slightly longer, story-led caption.

### 4. Schedule the idea

Drag a preview card by its **drag to schedule** affordance and drop it on one of the empty Saturday or Sunday slots in the schedule strip. The slot changes to the platform-specific scheduled post and a confirmation toast appears.

Select **Open calendar** to see the full week. Existing sample content is already distributed across Monday through Friday so the workspace feels populated on first open.

### 5. Explore the studio utilities

- **Calendar** gives a full seven-day view with channel color coding.
- **Bouquet library** shows all six preloaded photos and supports adding a local JPG or PNG.
- **Brand voice** documents the writing principles: warm, specific, sensory, and never loud.

## Screenshot

The repository preview image is stored at [`docs/assets/bloom-create-demo.png`](assets/bloom-create-demo.png).

## Acceptance notes

The demo is intentionally self-contained and does not require an external LLM or database. Generation is simulated locally so the product flow can be reviewed immediately. The app is ready for a later integration with a durable storage layer and a production copy-generation endpoint.
