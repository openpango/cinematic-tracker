# Project Requirements

## Product Vision
To create the most visually stunning, performant, and intuitive media tracking application on the market, bypassing the bloat of IMDB or Trakt by focusing strictly on a premium "Apple-native" design aesthetic.

## Functional Requirements
1.  **Authentication**: Secure, friction-free login (Magic Links preferred to avoid password fatigue).
2.  **Search**: Lightning-fast, debounced search against a global master database (TMDB).
3.  **Media States**: Items must exist in distinct binary states (`To Watch` vs `Watched`).
4.  **Organization**: Users need free-form organization methods (Folders for hard groupings, Tags for soft filtering).

## Non-Functional Requirements
1.  **Aesthetics (Critical)**: The UI must not look like a generic web app. It must utilize `backdrop-filter` blurring, heavy spring animations, highly legible typography (Outfit / San Francisco), and strict safe-area respects.
2.  **Platform Availability**: Must deploy natively to iOS via the App Store and Android via Google Play from a single web codebase (Capacitor).
3.  **Performance**: Near-instant load times. Client-side routing must feel like native screen transitions without browser flashes.
4.  **Responsiveness**: While mobile-first, the constraints (max-width 600px) must look elegant and centered on Desktop displays.
