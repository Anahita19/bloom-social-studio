# Bloom QA Checklist

Use this checklist when reviewing a new branch or recording a demo.

## Create flow

- [ ] The Create view opens by default.
- [ ] The bouquet rail contains six preloaded sample photos.
- [ ] Selecting a bouquet updates the selected-bouquet row and all three phone previews.
- [ ] Uploading a JPG or PNG adds it to the bouquet library and selects it.
- [ ] Holiday and offer controls update their selected values.
- [ ] Generate all 3 posts shows a writing state and then refreshes Instagram, RedNote, and Facebook copy together.

## Preview and schedule

- [ ] All three previews show platform identity, bouquet image, caption, and engagement affordances.
- [ ] A generated preview can be dragged onto an empty week-strip slot.
- [ ] An empty week-strip slot can also be clicked to add the default Instagram draft.
- [ ] Open calendar switches to the full publishing calendar.
- [ ] An empty full-calendar slot can be clicked to add the default Instagram draft.
- [ ] A generated preview can be dragged into an empty full-calendar slot.

## Utility views

- [ ] Calendar shows seven days and the five preloaded sample posts.
- [ ] Bouquet Library shows the six sample photos and its Add photo control works.
- [ ] Brand Voice shows Bloom's writing principles and vocabulary.
- [ ] The layout remains usable on a narrow viewport with horizontally scrollable phone previews.

## Repository and build

- [ ] `pnpm check` passes.
- [ ] `pnpm build:static` passes.
- [ ] `GET /manus-routes.json` returns HTTP 200 and the `/` route.
- [ ] README, Persian quick-start, demo, architecture, changelog, and this checklist are present.
