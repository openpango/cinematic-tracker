# Agent Memory Log

## Project History & Achievements

### Phases 1-3: Core Scaffolding & Design System
*   **Vite + React (TypeScript)** environment successfully initialized.
*   Implemented a rigorous **Apple-style Vanilla CSS Design System** bypassing generic frameworks like Tailwind. We utilized `backdrop-filter: blur(20px)`, strict CSS variables for Safe Areas (`env(safe-area-inset-bottom)`), and spring-physics for interactive elements.
*   **Supabase** client configured and bound to a robust React Hook (`useAuth`) that controls the internal `react-router-dom` flow. Auth flows were established using Magic Links.

### Phases 4-5: Mobile Wrapping & Core Features Mockup
*   Built fluid, static mocked UIs for `Home`, `Search`, and `Folders` views, applying the CSS design system accurately.
*   Initialized **CapacitorJS** (`npx cap init` / `sync`) to wrap the Vite web build into native iOS and Android environments.

### Phase 6: Real Data & Production Scale
*   Connected the external **TMDB API** for live media searching within the `<Search>` view.
*   Established relational bindings to **Supabase** via PostgreSQL database schemas. Mock arrays were deleted, and `<Home>`, `<Search>`, and `<Folders>` views now actively ping strict Row-Level Security endpoints to read/write authentic User data.
*   Branding was elevated using the "Outfit" Google Font for all heading topography.

### Phase 7: Long-Term Architecture
*   The generic `README` flow was deprecated in favor of a specialized `.planning` directory.
*   Root constraint documents (`ROADMAP.md`, `STATE.md`, etc.) and depth research documents (`ARCHITECTURE.md`, `PITFALLS.md`) were drafted to guide the project's long-term v1.0, v1.5, and v2.0 feature sets.

### Phase 8: Media Details Screen
*   Implemented `fetchMediaDetails` into the `lib/tmdb.ts` wrapper.
*   Built a full-screen `<MediaDetails>` React component featuring an immersive hero backdrop, horizontally scrolling cast sliders, and fluid nested routing. Users can now intimately explore a TV show/Movie before adding it to their Supabase Queue.

## Architectural Lessons Learned
1. **RegEx Find & Replace on nested closures is dangerous**: During Phase 8, `multi_replace_file_content` failed to correctly align standard nested `.map()` closing braces in `tmdb.ts`. 
   * *Resolution*: When structural changes heavily affect deep closures, just rewrite the entire file or use highly targeted replacements.
2. **Capacitor Lifecycle**: The `.env` file requires `VITE_` prefixes, and running `npx cap sync` is mandatory after every `npm run build` so that the native iOS/Android wrappers ingest the newest `/dist/` web output.
3. **Openclaw Paradigm**: The user prefers structured tracking. Planning documents are hidden in a `.planning` directory, and the Agent's state identity is captured via `.agent/` (`identity.md`, `soul.md`, `memory.md`).
