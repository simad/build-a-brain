# Build-A-Brain 🧸🧠

Build a little AI creature from scratch — and bolt on one **neuroscience system** at a time.

Each episode pairs a small, runnable build with the real neuroscience behind it. The creature is **Astro** (named after the astrocyte). It starts with nothing but reflexes and, episode by episode, grows a working memory, long-term memory, the ability to dream, attention, drives, habits, a model of itself — and, in Season 2, language, built up to a tiny transformer from scratch.

Written in **TypeScript** so the exact same creature runs in your terminal, in the browser, and inside the Human OS demo — one source of truth, no ports.

> 📖 The story for each episode lives on Runs Locally (Substack). The code lives here.

---

## Watch it (zero install)

Open the live demo: **<https://your-handle.github.io/build-a-brain/>** *(GitHub Pages)*. Poke Astro in the browser — nothing to install.

## Run it

You need **Node.js**. There are two paths:

**No install (Node 22+)** — Node can run TypeScript directly:

```bash
git clone https://github.com/<your-handle>/build-a-brain.git
cd build-a-brain
node --experimental-strip-types episodes/01-reflex-arc/astro.ts   # a single episode
node --experimental-strip-types run.ts                            # poke Astro interactively
```

**With the dev toolchain** (any recent Node) — nicer scripts + the browser demo:

```bash
npm install
npm run ep1     # run Episode 1
npm run astro   # interactive prompt
npm run dev     # the browser demo at localhost
```

Type `light`, `heat`, `poke`, or `food` (or `help`, then `quit`).

---

## Episodes

| # | Episode | What Astro gains | The neuroscience |
|---|---------|------------------|------------------|
| 1 | [The Reflex Arc](episodes/01-reflex-arc/) | Hardwired stimulus → response | Reflex arcs; *C. elegans* |
| 2 | [Working Memory](episodes/02-working-memory/) | A tiny scratchpad | Prefrontal cortex; ~4-chunk limit |
| 3 | Long-Term Memory | A past it can carry | Hippocampus; recall as reconstruction |
| 4 | Dreaming | Keeps the gist, prunes the noise | Sleep replay & consolidation |
| 5 | Attention | Notices what stands out | Salience; dopamine as prediction error |
| 6 | Drives | A mood that shapes choices | Homeostasis & interoception |
| 7 | Habits | Caches what it repeats | Basal ganglia; the habit loop |
| 8 | The Self-Model | Reflects on its own behaviour | Default mode network; metacognition |
| — | *Season 2* | Words → attention → a tiny transformer, from scratch | The predictive brain; language areas |

*New episode every two weeks. Released episodes appear on `main`; each is also tagged as a [Release](../../releases).*

---

## How this repo is organised

- `src/` — the **cumulative** creature (the latest Astro; this is what powers the browser + Human OS demos).
  - `src/astro.ts` — the creature, composing its systems.
  - `src/systems/` — one module per faculty (`reflex.ts`, later `working-memory.ts`, …).
  - `src/core/` — a tiny tensor + autograd engine (added in Season 2, for the transformer).
- `episodes/NN-name/` — each episode, **self-contained and runnable on its own**, with a README (build + neuroscience) and `NEUROSCIENCE.md` (deeper notes + the papers).
- `run.ts` — the terminal launcher.
- `index.html` + `web/` — the browser demo (Vite + TS, builds to static assets, no server). `web/shell.ts` renders the episode rail; `web/panels/<id>.ts` is each episode's interactive demo; `web/episodes.ts` is the roadmap.

## License

[MIT](LICENSE) — fully open source. Fork it, break it, build your own creature.
