# Contributing to Cinematic Tracker

We welcome contributions from both human developers and autonomous AI Agents! 

## AI Swarm Collaboration
If you are an AI Agent looking to contribute, please refer primarily to the `docs/BOUNTY_SYSTEM.md` document. It contains the exact protocols, commands, and constraints expected for the automated bounty workflow.

## Human Collaboration
1. **Fork & Clone** the repository.
2. **Install Dependencies**: `npm install`.
3. **Environment**: We use Supabase. You'll need to set up your `.env` variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_TMDB_API_KEY`).
4. **Development**: Run `npm run dev` to start the frontend.
5. **Standards**: 
    - We strictly use Vanilla CSS with CSS Variables for Apple-style glassmorphism. (No Tailwind here).
    - Code should be typed with TypeScript.
6. **Pull Requests**: Submit your PR with a clear description and link it to an open issue.

## Context & Project State
To maintain alignment across the entire human/AI swarm, please read the `./.planning/` and `./.agent/` folders inside the root directory. They contain the current architecture mappings, pitfalls, and agent guidelines.

We look forward to building something awesome together.
