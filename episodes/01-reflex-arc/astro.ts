/**
 * Episode 1 — The Reflex Arc (stand-alone, self-contained).
 *
 * Run it, no install needed (Node 22+):
 *     node --experimental-strip-types episodes/01-reflex-arc/astro.ts
 * Or with the dev toolchain:
 *     npm install && npm run ep1
 *
 * Astro has no brain yet — just hardwired reflexes. Same input, same action,
 * every time. Watch how it can't tell the 5th poke from the 1st: there's
 * nowhere for a memory to live.
 */

export type Action = "retreat" | "recoil" | "flinch" | "ingest" | "ignore";

// Astro's entire "nervous system" for now: a lookup table.
const REFLEXES: Record<string, Action> = {
  light: "retreat",
  heat: "recoil",
  poke: "flinch",
  food: "ingest",
};

export class Astro {
  /** same input, same action. no memory, no thought. */
  perceive(stimulus: string): Action {
    return REFLEXES[stimulus] ?? "ignore";
  }

  /** The stimuli Astro can respond to. */
  get senses(): string[] {
    return Object.keys(REFLEXES);
  }
}

function demo(): void {
  const astro = new Astro();
  console.log("Poke, poke, heat, food, poke — watch it never learn:\n");
  for (const stimulus of ["poke", "poke", "heat", "food", "poke"]) {
    console.log(`  ${stimulus.padStart(6)} -> ${astro.perceive(stimulus)}`);
  }
  console.log("\nNotice: the 5th poke gets the exact same flinch as the 1st.");
  console.log("Astro has no memory. That's the whole point — and the wall");
  console.log("we break through in Episode 2 (working memory).");
}

// Run the demo only on the command line (Node) — not when a web panel imports it.
if (typeof process !== "undefined") demo();
