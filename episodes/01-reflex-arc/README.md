# Episode 1 — The Reflex Arc

> Astro starts with no brain at all: just hardwired stimulus → response. The simplest thing a nervous system can do, and the first thing it ever did.

## Run it

```bash
# no install needed (Node 22+):
node --experimental-strip-types episodes/01-reflex-arc/astro.ts
# or with the toolchain:
npm install && npm run ep1
```

You'll see Astro react to a little sequence of stimuli. Poke it five times — it flinches identically every time. It has **no memory**, so it can't tell the fifth poke from the first. That's not a bug; it's the entire lesson.

## What we build

A creature whose "brain" is a single lookup table — `stimulus → action` — and a one-line `perceive()` that reads from it. No state, no history, no choice.

```ts
type Action = "approach" | "recoil" | "flinch" | "eat" | "ignore";

const REFLEXES: Record<string, Action> = {
  light: "approach", heat: "recoil", poke: "flinch", food: "eat",
};

class Astro {
  perceive(stimulus: string): Action {
    return REFLEXES[stimulus] ?? "ignore";
  }
}
```

## The neuroscience (the actual good part)

Touch a hot pan and your hand moves *before you feel anything* — because your brain was skipped on purpose. A pain sensor fires up to the **spinal cord**, and the cord answers directly, routing the signal straight back to the muscles. Your brain only gets the memo a fraction of a second later (that's why the "ow!" lands *after* your hand has already moved). Why? **Speed** — a round-trip to the brain is a longer wire with more synapses, and when you're being burned, milliseconds are tissue.

And whole animals run on nothing but this: the worm *C. elegans* has exactly **302 neurons** (every connection mapped) and lives a full life on reflexes alone. Reflexes aren't a primitive the brain rises above — they're the **foundation** it was built on top of.

→ Deeper notes and the papers: [`NEUROSCIENCE.md`](NEUROSCIENCE.md)

## Where the model bends the truth

Real reflexes aren't perfectly frozen — they can be turned up or down (you flinch harder when you're already tense), and even *C. elegans* learns to ignore a harmless repeated poke. Astro's reflexes are the clean textbook version. The "turn it down with experience" machinery is a sneak peek at memory — Episode 2.

## Your turn

Add a new reflex to the `REFLEXES` table. Then try to make Astro react *differently the second time it sees heat*, as if it remembered the stove was hot. You can't — there's nowhere to put the memory. That failure is exactly the wall evolution hit, and it's what we fix next.
