# Releasing — the every-two-weeks playbook

*This file is for you, Silvia — it's not part of the lesson. It's the exact steps to publish one episode at a time.*

## The model

- **Cadence:** one episode every **2 weeks**.
- **`main`** is the public, released timeline — it only ever contains episodes that are live. This is what casual visitors see.
- **Each episode lives on its own branch** (`episode/02-working-memory`, …). Branches get pushed to GitHub too — that's fine; almost nobody browses branches, and you'd rather keep it simple than run a private backup. (Just know that a determined, technical reader *could* read ahead on a branch. For this project, that's a non-issue.)
- On release day you **merge the episode branch into `main`**, push, and cut a tagged **GitHub Release** with the episode's notes.

## One-time setup

```bash
# from the build-a-brain folder
git add .
git commit -m "Episode 1: The Reflex Arc"
git branch -M main
git remote add origin https://github.com/<your-handle>/build-a-brain.git
git push -u origin main
```

Then on GitHub: **Releases → Draft a new release → tag `v1-reflex-arc`**, paste the episode's intro, publish. Share *that* link in the Substack post.

## Starting the next episode (do this whenever you're ready to build it)

```bash
git checkout main
git pull
git checkout -b episode/02-working-memory     # branch off the latest main
```

Then build the episode in its own folder, porting from your vault draft:

1. Create `episodes/02-working-memory/` with `astro.ts`, `README.md`, `NEUROSCIENCE.md` (copy the shape of Episode 1; keep the episode file self-contained so it runs on its own). Add its `ep2` script to `package.json`.
2. Add the new faculty as `src/systems/working-memory.ts` and wire it into the cumulative creature in `src/astro.ts`.
3. Add the browser panel: `web/panels/working-memory.ts` (the interactive demo), register it in `web/shell.ts`, and flip that episode's `status` to `"live"` in `web/episodes.ts`.
4. Bump the episode table in the top-level `README.md`.
5. Commit and push the branch:

```bash
git add .
git commit -m "Episode 2: Working Memory"
git push -u origin episode/02-working-memory
```

The branch is now safely on GitHub (backup), but `main` is unchanged — the public's default view still shows only released episodes.

## Release day (every 2 weeks)

```bash
git checkout main
git merge episode/02-working-memory     # bring the new episode onto main
git push origin main
git tag v2-working-memory
git push origin v2-working-memory
```

Then draft the GitHub Release for that tag, and publish the Substack post that points to it. Done. Start the next branch.

## Checklist before each release

- [ ] `node --experimental-strip-types episodes/NN-name/astro.ts` runs cleanly
- [ ] `npm run astro` (and the browser `npm run dev`) still work — cumulative creature updated
- [ ] `npm run typecheck` passes
- [ ] Episode `README.md` has the run command + the neuroscience + a "your turn"
- [ ] `NEUROSCIENCE.md` has the sources (verified)
- [ ] Top-level README episode table updated
- [ ] The browser panel works (`web/panels/NN.ts`, registered, `status: "live"`)
- [ ] The creature itself stays dependency-free (dev-only tooling like tsx/vite is fine)
