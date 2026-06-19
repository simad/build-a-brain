/**
 * The cumulative Astro — the latest creature, with every system released so
 * far bolted on. Through Episode 2 that's reflexes + a small working memory.
 * Each future episode adds a system here, on top of this base.
 *
 * (Each episode's *frozen* creature lives in `episodes/NN/astro.ts`; this is
 * the running-latest one used by the terminal and the Human OS pet.)
 */

import { reflex, REFLEXES, type Action as ReflexAction } from "./systems/reflex.ts";
import { WorkingMemory } from "./systems/working-memory.ts";

/** Reflex actions, plus the four "I've seen this lately" reactions working memory unlocks. */
export type Action = ReflexAction | "flee" | "hide" | "sated" | "habituate";

export class Astro {
  private wm = new WorkingMemory(4);

  /**
   * Stage 2: a stimulus first lands on the working-memory desk, then drives a
   * response. For the first time the recent past can override the raw reflex —
   * the buffer lets Astro notice "this just happened" and react differently.
   */
  perceive(stimulus: string): Action {
    this.wm.push(stimulus);
    const n = this.wm.countOf(stimulus);
    if (stimulus === "heat" && n >= 2) return "flee"; //      remembered danger → escape
    if (stimulus === "light" && n >= 2) return "hide"; //     persistent glare → take cover
    if (stimulus === "food" && n >= 2) return "sated"; //     just ate → leave it
    if (stimulus === "poke" && n >= 3) return "habituate"; // harmless & repeated → stop reacting
    return reflex(stimulus);
  }

  /** The stimuli Astro can currently respond to. */
  get senses(): string[] {
    return Object.keys(REFLEXES);
  }

  /** What's currently on the working-memory desk (oldest → newest). */
  get memory(): readonly string[] {
    return this.wm.contents;
  }
}

export { REFLEXES };
