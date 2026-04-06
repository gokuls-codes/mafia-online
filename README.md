## Mafia Online

Real-time social deduction game built with Next.js, React, and Supabase.

## Project Structure

- `src/app/page.tsx`: thin route entry point.
- `src/features/game/components/`: game shell and phase-specific UI.
- `src/features/game/lib/`: shared role helpers and game data mapping.
- `src/store/GameContext.tsx`: Supabase-backed game state and actions.
- `supabase/migrations/`: schema and gameplay-related DB changes.

## Getting Started

1. Install dependencies.

```bash
npm install
```

2. Create local environment variables.

```bash
cp .env.example .env.local
```

3. Fill in these values in `.env.local`.

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

4. Start the development server.

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Notes

- `node_modules` is not committed, so install dependencies before running lint, build, or dev.
- The app expects a Supabase project with the migrations under `supabase/migrations/`.
- The game UI is organized by phase to keep the route layer small and easier to maintain.

## Available Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Framework Note

This repo is pinned to `next@16.2.2`. The local framework docs referenced by `AGENTS.md` live under `node_modules/next/dist/docs/`, so install dependencies before making framework-level changes.
