/**
 * The cumulative Astro — the latest creature, with every system released so
 * far bolted on. Right now that's Episode 1 (reflexes only). Each future
 * episode adds a system here, on top of this base.
 */

import { reflex, REFLEXES, type Action } from "./systems/reflex.ts";

export class Astro {
  /**
   * Stage 1: no brain yet — just hardwired reflexes.
   * There is deliberately nowhere for a memory to live.
   */
  perceive(stimulus: string): Action {
    return reflex(stimulus);
  }

  /** The stimuli Astro can currently respond to. */
  get senses(): string[] {
    return Object.keys(REFLEXES);
  }
}

export { REFLEXES, type Action };
