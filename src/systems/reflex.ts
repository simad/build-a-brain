/**
 * Episode 1 — The Reflex Arc.
 *
 * Astro's entire "nervous system" at this stage: a lookup table from a
 * stimulus to a fixed action. No state, no memory, no choice — like the
 * spinal shortcut that yanks your hand off a hot pan before your brain
 * is even consulted.
 */

export type Action = "approach" | "recoil" | "flinch" | "eat" | "ignore";

/** The reflex table — the creature's whole wiring diagram for now. */
export const REFLEXES: Record<string, Action> = {
  light: "approach",
  heat: "recoil",
  poke: "flinch",
  food: "eat",
};

/** Map a stimulus straight to an action. Same input, same output, always. */
export function reflex(stimulus: string): Action {
  return REFLEXES[stimulus] ?? "ignore";
}
