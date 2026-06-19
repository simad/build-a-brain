# Episode 2 — Working Memory

> Astro gets the brain's tiny, expensive desk: a buffer that holds the last ~4 things it sensed, then forgets. For the first time the recent past can change the present — repeat a sense and it reacts differently: it flees heat it's already felt, hides from a light that keeps coming, ignores food it just ate, and stops flinching at a harmless, repeated poke.

## Run it

```bash
# no install needed (Node 22+):
node --experimental-strip-types episodes/02-working-memory/astro.ts
# or with the toolchain:
npm install && npm run ep2
```

You'll see Astro feel heat, then heat again — and the *second* time it flees instead of recoiling, because it can finally tell "this just happened." Feed it more than four things and watch the oldest fall out the back.

## What we build

A `perceive()` that first drops the stimulus onto a 4-slot buffer, then decides. The buffer is the whole lesson: a bounded queue where a new item silently shoves the oldest one out.

```ts
const REFLEXES: Record<string, Action> = {
  light: "retreat", heat: "recoil", poke: "flinch", food: "ingest",
};

class Astro {
  private wm: string[] = [];           // holds ~4 recent things, then forgets

  perceive(stimulus: string): Action {
    this.wm.push(stimulus);
    while (this.wm.length > 4) this.wm.shift();   // oldest falls out the back

    // the recent past can now override the raw reflex
    const n = this.wm.filter((x) => x === stimulus).length;
    if (stimulus === "heat"  && n >= 2) return "flee";      // remembered danger
    if (stimulus === "light" && n >= 2) return "hide";      // persistent glare
    if (stimulus === "food"  && n >= 2) return "sated";     // just ate
    if (stimulus === "poke"  && n >= 3) return "habituate"; // harmless & repeated
    return REFLEXES[stimulus] ?? "ignore";
  }
}
```

The whole capacity limit is one number: `maxlen = 4`. Notice that **every** new ability comes from the same buffer — the creature can suddenly "tell this happened recently." There's still no long-term store, though: close the program and the desk is wiped, exactly like your own working memory after a night's sleep.

## The neuroscience (the actual good part)

Working memory is the mental sticky note — what holds a phone number in your head for the seconds between reading it and dialling. The unsettling part: **it's held up by neurons that have to keep firing.** A population of cells in your **prefrontal cortex** sustains a little loop of activity, re-exciting itself to keep the item alive. Nothing is written down. Interrupt that firing — a notification, a question — and the loop collapses and the item is just *gone*. That's why a single distraction can wipe it: you're not losing a saved file, you're dropping a ball you were juggling.

And the desk is tiny. Miller's famous "seven, plus or minus two" was revised down by Cowan to about **four** chunks. The escape hatch is **chunking**: each slot holds a chunk, and a chunk can be as big as your expertise allows ("FBI" is one chunk, not three letters). Expertise doesn't raise the limit — it packs more into each slot.

→ Deeper notes and the papers: [`NEUROSCIENCE.md`](NEUROSCIENCE.md)

## Where the model bends the truth

Real working memory isn't a tidy 4-slot queue that forgets strictly oldest-first. It decays with *time* and *interference* (similar items crowd each other out), it's gated by attention, and the "4" is in chunks, not raw items. Astro's buffer captures the *spirit* — small, volatile, easily overwritten — not the mechanism.

## Your turn

Change `CAPACITY` and watch Astro get smarter or more goldfish-like. Then overload it: give it six distinct things and ask it to recall the first — it can't, it already fell out. For bonus points, add crude **chunking**: let a repeated pair collapse into one slot and watch effective capacity grow. The thing it still can't do — keep anything once the buffer clears — is exactly what we fix next, with the hippocampus.
