# Veloxa — Next.js + Supabase starter

Real auth, a real database schema, and a working upload → moderation → publish
pipeline. No payments, streaming SDK, or AI recommendations wired up yet —
those need product decisions (which payment processor, which audio CDN,
which recommendation approach) before there's code worth writing.

## 1. Set up Supabase

1. Create a project at supabase.com.
2. In the SQL editor, run `supabase/schema.sql`, then `supabase/policies.sql`.
3. In Storage, create two buckets: `tracks` and `artwork`. Mark them public
   (or keep them private and switch `getPublicUrl` calls to signed URLs).
4. Copy your project URL and keys into `.env.local` (copy `.env.example` and fill in).

## 2. Make yourself an artist/admin for testing

After signing up once through the app, run in the SQL editor:

```sql
update profiles set is_artist = true, is_admin = true where id = 'your-user-id';
```

## 3. Install and run

```bash
npm install
npm run dev
```

Visit http://localhost:3000.

## What's real vs. placeholder

| Area | Status |
|---|---|
| Auth (signup/login/logout) | Real — Supabase Auth |
| Database schema + RLS | Real — see `supabase/` |
| Track upload | Real — hits Storage + `tracks` table |
| Moderation queue | Real — admin approve/reject updates the DB |
| Search | Real — queries `tracks` by title/genre |
| Playback | Placeholder — no audio engine wired up |
| Payments / premium | Placeholder — `premium` is just a boolean today |
| AI recommendations | Not started |
| Artist analytics charts | Not started — `play_history` table exists to build them from |

## Suggested next steps, in order

1. Wire actual audio playback (e.g. Howler.js or the native `<audio>` element)
   to `audio_url` on the player page.
2. Add a payments provider (Stripe is the common choice) and flip `premium`
   on webhook.
3. Build analytics queries against `play_history` for the artist dashboard.
4. Only after the above works end-to-end, look at recommendation logic —
   it needs real play data to be worth building.
