# Cinematic Tracker Architecture

## Core Stack
* **Frontend**: Vite + React 18 + TypeScript.
* **Component Styling**: *Strictly Vanilla CSS*. We use CSS variables for theming, focusing on iOS-style glassmorphism.
* **Backend**: Supabase Postgres + GoTrue Auth. 
* **Mobile Wrap**: Ionic Capacitor 6.
* **API Ingestion**: TMDB (The Movie Database).

## State Management
We do *not* use Redux or Zustand.
All application state is scoped locally or globally managed via standard React Context (e.g., `useAuth()`) and custom Supabase query hooks.

## Database & RLS
We rely on Supabase Edge computing and `postgREST` rather than local Node server endpoints.
- `media`: Global cache of TMDB properties.
- `list_items`: Pivot table determining if an `auth.uid()` has Watched or Queue'd a `media_id`.
- `folders`: Custom categorization clusters. 

If an Agent needs to interact with the database, it MUST review the exact table definitions located within `/supabase_schema.sql` at the root directory.
