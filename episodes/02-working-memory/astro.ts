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

export type Action =
  | "retreat" | "recoil" | "flinch" | "ingest" | "ignore" // reflexes (Episode 1)
  | "flee" | "hide" | "sated" | "habituate"; //              what working memory unlocks

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

    // The recent past can now override the raw reflex — "I've seen this lately."
    const n = this.wm.filter((x) => x === stimulus).length;
    if (stimulus === "heat" && n >= 2) return "flee"; //      remembered danger → escape
    if (stimulus === "light" && n >= 2) return "hide"; //     persistent glare → take cover
    if (stimulus === "food" && n >= 2) return "sated"; //     just ate → leave it
    if (stimulus === "poke" && n >= 3) return "habituate"; // harmless & repeated → stop reacting
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
  console.log("Working memory lets the recent past change the response:\n");
  for (const stimulus of ["heat", "heat", "poke", "poke", "poke"]) {
    const action = astro.perceive(stimulus);
    console.log(`  ${stimulus.padStart(6)} -> ${action.padEnd(9)} | memory: [${astro.memory.join(", ")}]`);
  }
  console.log("\n  heat→recoil then FLEE; poke→flinch then HABITUATE — it remembers.\n");

  // Self-checks: each "I've seen this lately" reaction, made to fail loudly if broken.
  const heat = new Astro(); heat.perceive("heat");
  console.assert(heat.perceive("heat") === "flee", "2nd heat → flee");
  const light = new Astro(); light.perceive("light");
  console.assert(light.perceive("light") === "hide", "2nd light → hide");
  const food = new Astro(); food.perceive("food");
  console.assert(food.perceive("food") === "sated", "2nd food → sated");
  const poke = new Astro(); poke.perceive("poke"); poke.perceive("poke");
  console.assert(poke.perceive("poke") === "habituate", "3rd poke → habituate");
  const cap = new Astro();
  for (const s of ["a", "b", "c", "d", "e"]) cap.perceive(s);
  console.assert(cap.memory.length === 4 && cap.memory.join() === "b,c,d,e", "buffer caps at 4, oldest falls out");
  console.log("  Memory holds only ~4 — the 5th thing pushes the 1st out. (Long-term store: Episode 3.)");
}

// Run the demo only on the command line (Node) — not when a web panel imports it.
if (typeof process !== "undefined") demo();
