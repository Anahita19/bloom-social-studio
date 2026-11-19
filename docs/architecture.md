# Bloom Architecture Notes

## Runtime shape

Bloom is currently a static Vite + React experience. The existing starter includes server, tRPC, and Drizzle helpers, but the social studio UI does not require a database or authenticated session for this first release.

## Main UI state

`client/src/pages/Home.tsx` owns the studio state:

- `activeView` switches between Create, Calendar, Bouquet Library, and Brand Voice.
- `bouquets` stores the six preloaded bouquets plus any browser-uploaded image.
- `selectedId`, `holiday`, and `offer` define the active campaign context.
- `copy` stores the three platform outputs.
- `schedule` stores the seven-day sample week and drop results.

Empty schedule slots accept either a dragged platform preview or a click. Click-to-add uses the default Instagram draft as a quick scheduling shortcut; both paths update the same `schedule` state and confirmation toast.

The primary create flow is composed from focused view components: `BouquetPicker`, `CampaignSetup`, `GeneratedPosts`, `PhoneFrame`, and `WeekStrip`.

## Asset strategy

The six sample bouquet images are referenced through managed `/manus-storage/async-images/` paths. New uploads use `URL.createObjectURL` for instant local feedback. A future production implementation can replace that function with a storage upload mutation while keeping the picker contract unchanged.

## Extension points

### Copy engine

Replace the `handleGenerate` timeout with an API call that accepts:

```ts
{
  bouquetImage: string;
  occasion: string;
  offer: string;
}
```

and returns:

```ts
{
  instagram: string;
  rednote: string;
  facebook: string;
}
```

### Persistence

Move `bouquets`, `copy`, and `schedule` into database-backed queries and mutations once the product needs multi-user workspaces or durable publishing state. The current UI is already separated around those three data shapes.

### Publishing integrations

The calendar can later emit scheduled jobs for Instagram, Xiaohongshu, and Facebook. Keep the calendar's `platform`, `title`, `time`, and `color` fields as presentation metadata around a durable post record.
