# AI Delegates: Strict Output Rules

If you are an AI generating code for this repository via the Swarm Bounty System, you must follow these absolute constraints:

## 1. Aesthetic Enforcements (The iOS Vibe)
- **Do NOT inject Tailwind CSS utility classes into `className` tags.** The project does not compile them.
- All styles must be handled via explicit CSS files holding specific BEM-like classes (e.g., `.media-card`), or semantic inline styles mapped to the CSS variables in `index.css`.
- Ensure buttons have `borderRadius: "100px"` to maintain the Apple pill-button style.
- Modals and navigation elements MUST employ `backdrop-filter: blur(20px)` and reference `var(--glass-bg)`! If an interface is opaque, it is invalid.

## 2. Supabase Usage
- You cannot execute raw SQL from the frontend `pg` module. Only use the `@supabase/supabase-js` client wrapper to hit `postgREST` REST endpoints.
- Never write database mutations without handling the `error` destruction and wrapping it in an alert or error boundary.

## 3. Tool Calling Verification
- Do not submit a PR unless you have either ran `npm run dev` and captured terminal output ensuring no syntax errors exist, or ran the `browser_subagent` to physically click through your code changes locally.
