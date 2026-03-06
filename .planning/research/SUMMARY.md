# Research Summary & Conclusions

This directory exists to document design choices that don't fit into the standard codebase or issue tracker. 

**Core Philosophies adopted during Phase 6**:
1.  **Don't build a backend**. Supabase handles all structural SQL and auth securely via RLS.
2.  **Rely on Capacitor**. Building React Native/Expo requires maintaining two distinct UI paradigms. By using Vite + Capacitor + Strict iOS CSS variables, we get 90% of the native feel for 10% of the maintenance cost.
3.  **UI over Everything**. The core differentiator of this app is its aesthetic. `backdrop-filter`, spring-physics on buttons (`transform: scale(0.96)`), and heavy San Francisco / Outfit typography are non-negotiable standards. Any newly proposed feature MUST obey these visual constraints.
