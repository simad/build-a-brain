/**
 * Episode 2 — Working Memory (stand-alone, self-contained).
 *
 * Run it, no install needed (Node 22+):
 *     node --experimental-strip-types episodes/02-working-memory/astro.ts
 * Or with the dev toolchain:
 *     npm install && npm run ep2
 *
 * Astro now keeps the last few things it sensed in a tiny buffer (~4 items,
 * then it forgets). For the first time the recent past can change the present:
 * a second dose of heat in the buffer means "this again? I'm out" → flee.
 */

export type Action = "retreat" | "recoil" | "flinch" | "ingest" | "flee" | "ignore";

const REFLEXES: Record<string, Action> = {
  light: "retreat",
  heat: "recoil",
  poke: "flinch",
  food: "ingest",
};

const CAPACITY = 4; // Cowan's ~4 chunks. The smallness is the feature.

export class Astro {
  private wm: string[] = []; // holds the last ~4 things, then forgets

  perceive(stimulus: string): Action {
    this.wm.push(stimulus);
    while (this.wm.length > CAPACITY) this.wm.shift(); // oldest falls out the back

    // It can now act on the recent past, not just the present moment.
    if (stimulus === "heat" && this.wm.filter((x) => x === "heat").length > 1) {
      return "flee"; // "this again? I'm out."
    }
    return REFLEXES[stimulus] ?? "ignore";
  }

  get senses(): string[] {
    return Object.keys(REFLEXES);
  }

  /** What's currently on the desk, oldest → newest. */
  get memory(): readonly string[] {
    return this.wm;
  }
}

function demo(): void {
  const astro = new Astro();
  console.log("Feel heat, then heat again — the second time, it remembers:\n");
  for (const stimulus of ["poke", "heat", "light", "heat"]) {
    const action = astro.perceive(stimulus);
    console.log(`  ${stimulus.padStart(6)} -> ${action.padEnd(7)} | memory: [${astro.memory.join(", ")}]`);
  }

  // Self-checks: the whole lesson, made to fail loudly if the logic breaks.
  const a = new Astro();
  a.perceive("heat");
  console.assert(a.perceive("heat") === "flee", "second heat in the buffer should flee");
  const b = new Astro();
  for (const s of ["a", "b", "c", "d", "e"]) b.perceive(s);
  console.assert(b.memory.length === 4, "buffer caps at 4");
  console.assert(b.memory.join() === "b,c,d,e", "oldest (a) fell out the back");
  console.log("\nMemory only holds ~4. The 5th thing pushes the 1st out the back.");
  console.log("Close the program and the desk is wiped — no long-term store yet (Episode 3).");
}

// Run the demo only on the command line (Node) — not when a web panel imports it.
if (typeof process !== "undefined") demo();
