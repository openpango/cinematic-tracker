# Tech Stack

## Core Frontend
*   **Framework**: React (v18+) with TypeScript.
*   **Build Tool**: Vite (Lightning fast HMR, optimized production build).
*   **Routing**: `react-router-dom` (v6+) for client-side routing.
*   **Styling**: Vanilla CSS with strict variable-based Design System (Frosted glass, Apple aesthetics, CSS Springs).
*   **Icons**: `lucide-react` for clean, minimalist SVG icons.

## Backend & Infrastructure
*   **Database**: Supabase PostgreSQL.
*   **Authentication**: Supabase Auth (Magic Links / OTP based).
*   **Data Fetching**: Custom React hooks wrapping `@supabase/supabase-js`.
*   **External APIs**: TMDB (The Movie Database) for unified media metadata.

## Mobile Cross-Platform
*   **Wrapper**: Capacitor JS (`@capacitor/core`, `@capacitor/ios`, `@capacitor/android`).
*   **Optimization**: Native Safe Area bindings (`env(safe-area-inset-bottom)`) via CSS to ensure the web view functions seamlessly as an iOS/Android native app.
