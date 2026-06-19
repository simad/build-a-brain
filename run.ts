/**
 * Build-A-Brain — meet the latest Astro, in your terminal.
 *
 * Easiest (Node 22+, no install):
 *     node --experimental-strip-types run.ts
 * Or with the dev toolchain:
 *     npm install && npm run astro
 *
 * Type a stimulus (light / heat / poke / food), or `help` / `quit`.
 */

import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { Astro, type Action } from "./src/astro.ts";

function describe(stimulus: string, action: Action): string {
  if (action === "ignore") {
    return `Astro doesn't know what '${stimulus}' is, so it does nothing.`;
  }
  const flavour: Record<Action, string> = {
    retreat: "backs away from it",
    recoil: "recoils away",
    flinch: "flinches",
    ingest: "pumps it in",
    flee: "bolts — it remembers this one",
    hide: "hides — the light keeps coming",
    sated: "ignores it — it just ate",
    habituate: "barely reacts — it's used to the poking now",
    ignore: "ignores it",
  };
  return `Astro ${flavour[action]}.`;
}

async function main(): Promise<void> {
  const astro = new Astro();
  const rl = createInterface({ input: stdin, output: stdout });

  console.log("=".repeat(56));
  console.log("  Build-A-Brain — Episode 1: little Astro can only react.");
  console.log("  It has no memory yet, so the same poke always gets the");
  console.log("  same flinch. Try poking it five times. :)");
  console.log("=".repeat(56));
  console.log(`  Try one of: ${astro.senses.join(", ")}`);
  console.log("  Commands: help, quit\n");

  for (;;) {
    const raw = (await rl.question("stimulus > ")).trim().toLowerCase();
    if (raw === "quit" || raw === "exit" || raw === "q") break;
    if (raw === "help" || raw === "h" || raw === "?") {
      console.log(`  Stimuli: ${astro.senses.join(", ")}. Or 'quit'.`);
      continue;
    }
    if (raw === "") continue;
    console.log("  " + describe(raw, astro.perceive(raw)));
  }

  rl.close();
  console.log("bye! 🧫");
}

main();
