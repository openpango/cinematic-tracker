# Technical Pitfalls & Edge Cases

## 1. TMDB Rate Limiting
- TMDB has soft rate limits. Our `Search.tsx` currently employs a rudimentary `setTimeout` debounce of 500ms. 
- **Risk**: If a user rapid-types or backspaces aggressively, the browser might fire overlapping API calls resulting in race conditions where an older query resolves *after* a newer one.
- **Mitigation Needed**: Implement `AbortController` in the `searchMedia` TMDB wrapper so previous inflight requests are killed when a new keystroke occurs.

## 2. Supabase Cache Integrity (`media` table)
- When a user adds a movie to their list, we first check if `tmdb_id` exists in our local `media` table. If not, we insert it.
- **Risk**: TMDB occasionally updates movie posters or metadata. Because we cache this at insert time, our internal `media` table might grow stale over years.
- **Mitigation Needed**: A server-side CRON job (perhaps a Supabase Edge Function) that periodically sweeps the `media` table for entries older than X months and syncs them against TMDB.

## 3. Safari IOS Safe Area Rendering
- The iOS PWA / Capacitor webview handles `env(safe-area-inset-bottom)` inconsistently depending on whether the system keyboard is open.
- **Risk**: When a user focuses on the `Search` input, the keyboard pushes up the Viewport, but the sticky BottomNav might awkwardly float onto the screen.
- **Mitigation Needed**: We may need to dynamically hide `<BottomNav>` when an input receives focus, or rely on `@capacitor/keyboard` listener events.

## 4. RLS Privilege Escalation
- **Risk**: Missing RLS policies on the `media` table. Right now it's public read/write for authenticated users. A bad actor could potentially rewrite existing cached `media` rows.
- **Mitigation Needed**: Ensure `media` table has an RLS policy that prevents `UPDATE` commands from the client; only allowing `INSERT` when the `tmdb_id` doesn't exist.
