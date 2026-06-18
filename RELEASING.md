# Releasing — the every-two-weeks playbook

*This file is for you, Silvia — it's not part of the lesson. It's how to publish one episode at a time.*

## The model

- **Cadence:** one episode every **2 weeks**.
- **Everything lives on `main`.** All eight episodes are built and committed on the same branch.
- **Visibility is gated by date, not by branch.** Each episode has a `releaseAt` date in [`web/episodes.ts`](web/episodes.ts). The rail shows it as a live, selectable episode once that date has arrived; before then it's a `🔒 Unlocks <date>` teaser.
- **Scheduling a post = editing a date.** Want Episode 3 to go live July 16? Set its `releaseAt` to `2026-07-16` and commit. The deployed site flips it on automatically when the date passes (the check runs in the browser on load).

### Why not a branch per episode?

The repo is **open source** — all episode code is public regardless, and branches don't hide anything (anyone can browse them on GitHub). So per-episode branches gave zero embargo while making any cross-cutting change (a shared fix, a restyle) an 8-branch chore. One branch + a date gate kills that pain. The release schedule is about the *published reading experience*, not secrecy.

> Branches are now **optional scratch space** — use one if an episode is messy mid-build, then merge it into `main` when it's done. They are not the release mechanism.

## Building the next episode (do this whenever you're ready)

Work directly on `main` (or a short-lived scratch branch you'll merge). Port from your vault draft in `~/Documents/Notes/.../Build-A-Brain/Episodes/`:

1. Create `episodes/NN-<id>/` with `astro.ts`, `README.md`, `NEUROSCIENCE.md` (copy the shape of Episode 1; keep the episode file self-contained so it runs on its own). Add its `epNN` script to `package.json`.
2. Add the new faculty as `src/systems/<id>.ts` and wire it into the cumulative creature in `src/astro.ts`.
3. Add the browser panel `web/panels/<id>.ts` (the interactive demo) and register it in the `PANELS` map in [`web/shell.ts`](web/shell.ts).
4. Set that episode's `releaseAt` in [`web/episodes.ts`](web/episodes.ts) to its publish date.
5. Bump the episode table in the top-level `README.md`.
6. Commit and push to `main`.

Pushing to `main` triggers the GitHub Pages build automatically — but a future-dated episode still shows as locked until its date, so it's safe to ship early.

## Release day (every 2 weeks)

If you set `releaseAt` ahead of time, **there's nothing to do** — the episode unlocks itself on its date. Optionally cut a tagged GitHub Release (`vNN-<id>`) for the changelog, then publish the Substack post that links to it.

> Note: a returning visitor's browser re-evaluates the date on load, so the unlock is automatic for anyone who loads the site on/after the date. No redeploy is required (the code is already shipped); a redeploy is only needed if you *change* an already-shipped episode.

## Checklist before each release

- [ ] `node --experimental-strip-types episodes/NN-name/astro.ts` runs cleanly
- [ ] `npm run astro` (and the browser `npm run dev`) still work — cumulative creature updated
- [ ] `npm run typecheck` passes
- [ ] Episode `README.md` has the run command + the neuroscience + a "your turn"
- [ ] `NEUROSCIENCE.md` has the sources (verified)
- [ ] Top-level README episode table updated
- [ ] The browser panel works (`web/panels/NN.ts`, registered in `PANELS`)
- [ ] `releaseAt` set to the intended publish date
- [ ] The creature itself stays dependency-free (dev-only tooling like tsx/vite is fine)
