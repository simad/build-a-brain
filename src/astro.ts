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

/** Reflex actions, plus what working memory unlocks. */
export type Action = ReflexAction | "flee";

export class Astro {
  private wm = new WorkingMemory(4);

  /**
   * Stage 2: a stimulus first lands on the working-memory desk, then drives a
   * response. For the first time the recent past can change the present —
   * a second dose of heat in the buffer means "this again? I'm out" (flee)
   * rather than flinching at it fresh every time.
   */
  perceive(stimulus: string): Action {
    this.wm.push(stimulus);
    if (stimulus === "heat" && this.wm.countOf("heat") > 1) return "flee";
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
