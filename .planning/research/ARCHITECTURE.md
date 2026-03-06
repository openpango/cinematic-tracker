# System Architecture

## Overview
Cinematic Tracker follows a standard Backend-as-a-Service (BaaS) architecture using Supabase for server state and a Vite React SPA for client computing. CapacitorJS bridges the SPA into native WebView contexts for App Store deployment.

## Frontend (Client)
- **State Management**: Simple React `useState` and `useEffect` hooks currently drive the UI.
- **Components**: The component tree is split into three functional areas:
  - `/ui`: Reusable primitives (`<Card>`, `<Button>`, `<GlassPane>`).
  - `/media`: Domain-specific components (`<MediaCard>`).
  - `/layout`: Structural shell (`<BottomNav>`).
- **Routing**: `react-router-dom` drives view changes without page reloads.

## Backend (Supabase)
- **Auth**: Handled by `supabase.auth`. Users receive JWTs representing their Session state.
- **Database**: PostgreSQL handles structured data.
  - `media`: Acts as an internal cache of TMDB concepts so relational joins (e.g. `list_items` to `media`) can pull Poster/Title data directly without round-tripping to TMDB.
  - `list_items`: Pivot table linking a User UUID to a Media UUID, and tracking the ENUM status (`to_watch`, `watched`).

## External Integrations
- **TMDB (The Movie Database)**: Single source of truth for media search (`/search/multi`). Mapped client-side into our internal `MediaItem` interface logic.
