# Build-A-Brain — webapp simplification, episode selector & release branching

**Date:** 2026-06-12
**Status:** Approved (pending spec review)
**Repo:** build-a-brain (no commits yet — this work creates the first commit on `main`)

## Summary

Three coordinated changes to build-a-brain:

1. **Toolchain** — keep Vite + TypeScript (the minimal TS build tool), but remove
   friction: drop the `tsx` dependency, trim per-episode scripts, and make the
   static-deploy story explicit. The webapp is already static (`vite build` →
   `dist/`); no server runs in production.
2. **Webapp** — replace the bare "Meet Astro" page with an **episode navigator**:
   a left rail listing episodes (ep1 live, later episodes faded + locked), and a
   main panel showing the selected episode. Episode 1's panel gets the themed,
   animated p5 amoeba + reflex trace, theme-aware so it matches Human OS.
3. **Release branching** — `main` only ever holds released episodes (ep1 now).
   Each future episode is built on its own `episode/NN-name` branch and merged on
   release. The currently-present ep2–8 drafts move off `main` into a gitignored
   `drafts/` folder.

## Decisions (locked)

- Keep **Vite + TypeScript**. Not Next.js (heavier), not a buildless JS rewrite
  (loses TS authoring). TS in the browser requires a build step; Vite is the
  lightest one and emits static assets.
- Buildless capability ceiling is irrelevant: season-2's in-browser LLM can load
  from CDN via import maps + `fetch()` weights (e.g. WebLLM) — Vite passes these
  through, no bundler change.
- Branch naming: **`episode/NN-name`** (already what RELEASING.md uses).
- ep2–8 drafts: **set aside in gitignored `drafts/`**, recreated per the playbook
  when each episode is built (the user's vault is the canonical draft source).
- Rail layout: **left vertical rail**.
- The themed amoeba is **folded into this work** (was a separate task).

## A. Toolchain

- `package.json`:
  - Keep `tsx` for the `ep1` / `astro` scripts — it runs on any Node. (Dropping it
    for `node --experimental-strip-types` was tried and reverted: the dev machine
    runs Node 20, and that flag needs Node 22.6+, so it would break `npm run ep1`.)
  - Add `@types/node` to `devDependencies` so `tsc --noEmit` resolves `node:*`
    imports in `run.ts` (the CLI). This makes `npm run typecheck` pass.
  - Keep `"dev": "vite"`, `"build": "vite build"`, `"typecheck": "tsc --noEmit"`.
  - Trim `ep2`–`ep8` scripts (each episode branch adds its own `epN`).
  - devDeps end up: `@types/node`, `tsx`, `typescript`, `vite`.
- No `vite.config.ts` needed for ep1 (defaults are fine); add later only if a base
  path is required for the host. `index.html` at the repo root is Vite's entry.
- Deploy = `npm run build` → upload `dist/` to any static host (GitHub Pages /
  `brain.debugginghumans.com`). `vite dev` is local-only convenience.

## B. Webapp — episode navigator

### Structure (still Vite + TS, static)

```
index.html              # mount point + p5 (CDN) + module entry
web/
  main.ts               # bootstraps the shell into #app
  shell.ts              # renders rail + active/locked panel; owns selection state
  episodes.ts           # EpisodeMeta[] manifest (roadmap metadata)
  theme.ts              # ?theme= + postMessage('humanos:theme') → light/dark class
  style.css             # webapp palette + chrome (glassy, light/dark), or co-located
  panels/
    reflex-arc.ts       # ep1 demo: p5 amoeba + stimulus buttons + trace
src/                    # the creature (unchanged) — panels import from here
  astro.ts
  systems/reflex.ts
```

### Episode manifest (`web/episodes.ts`)

```ts
export interface EpisodeMeta {
  n: number;
  id: string;          // matches episodes/NN-<id> and panels/<id>.ts
  title: string;
  gains: string;       // one-line "what Astro gains" (for the locked teaser)
  status: "live" | "locked";
}
```

ep1 `live`; ep2–8 `locked`. This is roadmap metadata only (mirrors the README
table), so it is fine on `main`. Optionally a season-2 entry at the end.

### Shell behaviour (`web/shell.ts`)

- Build the left rail from `EPISODES`:
  - **live** → filled badge, highlighted, selectable.
  - **locked** → ~50% opacity, outline badge, `lock` icon, selectable (→ teaser).
  - Episodes beyond the next locked one collapse into a faint
    "+N more, then season 2" line so the rail stays short.
- Selecting an episode renders its panel into the main area:
  - **live** → look up a panel module by `id` in a small registry and mount it.
  - **locked** → render a faded teaser (title + `gains` + "coming soon" lock),
    never an empty/broken demo.
- Default selection on load: the single `live` episode (ep1).

### ep1 panel (`web/panels/reflex-arc.ts`)

- **Logic from the shared creature:** `import { Astro } from "../../src/astro.ts"`.
  On a stimulus button press, call `astro.perceive(stimulus)` to get the action —
  the panel never hardcodes the reflex table.
- **Rendering only** (ported from the Human OS prototype): a p5 amoeba that
  breathes/bobs/drifts at idle, with per-action animations keyed off the returned
  action (`approach`→drift+glow, `recoil`→shrink+shift, `flinch`→quick squash,
  `eat`→lean+chew). A `VT323` trace console logs
  `perceive("poke") → flinch()`, capped at the last ~6 lines.
- Buttons are generated from `astro.senses` (light / heat / poke / food).
- p5 loaded from CDN (`<script src=".../p5.min.js">`) in `index.html`; the panel
  uses the global, falls back to a static emoji if p5 is unavailable.

### Theme (`web/theme.ts`)

- On load, read `?theme=light|dark` from the URL and apply a `dark` class.
- Listen for `window.message` events of shape `{ type: "humanos:theme", theme }`
  and switch live. Default light. This is the Human OS handshake — when iframed at
  `brain.debugginghumans.com`, the creature matches the OS palette.

## C. Release branching

- This is the **first commit**. `main` carries **ep1 only**:
  - keep: `src/astro.ts`, `src/systems/reflex.ts`, `episodes/01-reflex-arc/`,
    `web/`, `index.html`, `run.ts`, `package.json`, `package-lock.json`,
    `tsconfig.json`, `.gitignore`, `README.md`, `RELEASING.md`, `LICENSE`,
    `docs/`.
- **Drafts set aside** into gitignored `drafts/`:
  - `drafts/systems/` ← the 7 unwired `src/systems/*.ts` (everything but `reflex.ts`).
  - `drafts/episodes/` ← `episodes/02-...` through `episodes/08-...`.
  - Add `drafts/` to `.gitignore`. This also makes `npm run typecheck` clean
    (unfinished drafts leave the compile set).
- Commit on `main`: **"Episode 1: The Reflex Arc"** (includes `docs/` spec). No
  remote push — left to the user per RELEASING.md's one-time setup.

### Per-episode extension recipe (add to RELEASING.md checklist)

When building episode N on its `episode/NN-name` branch:

1. `src/systems/<faculty>.ts` (from `drafts/` or the vault) + wire into `src/astro.ts`.
2. `web/panels/<id>.ts` — the episode's interactive demo; register it in the shell.
3. Flip `EPISODES[N].status` to `"live"` in `web/episodes.ts`.
4. `episodes/NN-name/` teaching files; add an `epN` script to `package.json`.
5. Bump the README episode table.

## Verification

- `npm run typecheck` clean (drafts no longer in the compile set).
- `npm run ep1` runs the self-contained episode.
- `npm run astro` starts the interactive CLI.
- `npm run build` → static `dist/`.
- Browser (`npm run dev`): rail shows ep1 active + ep2 locked/faded; ep1 panel
  animates Astro on stimulus and logs the trace; selecting a locked episode shows
  the teaser; `?theme=dark` and a `humanos:theme` postMessage both switch palette.
- `git ls-files` shows ep1 content only; `git status` clean (drafts ignored).

## Out of scope

- Hosting headers / the `brain.debugginghumans.com` subdomain (infra side).
- Season-2 transformer/LLM (future; the buildless path is confirmed viable).
- Pushing to a remote (user does the one-time `git remote add` + push).
