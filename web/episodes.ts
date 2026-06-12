/**
 * The episode roadmap — metadata only, so it can live on `main` even though the
 * later episodes ship one at a time. As each episode is released on its branch,
 * flip its `status` to "live" and add a panel in `web/panels/<id>.ts`.
 */

export interface EpisodeMeta {
  n: number;
  /** Matches `episodes/NN-<id>/` and `web/panels/<id>.ts`. */
  id: string;
  title: string;
  /** One line for the locked teaser — "what Astro gains". */
  gains: string;
  status: "live" | "locked";
}

export const EPISODES: EpisodeMeta[] = [
  { n: 1, id: "reflex-arc",       title: "The reflex arc",   gains: "Hardwired stimulus → response, with no memory.", status: "live" },
  { n: 2, id: "working-memory",   title: "Working memory",   gains: "A tiny scratchpad it can hold a few things in.", status: "locked" },
  { n: 3, id: "long-term-memory", title: "Long-term memory", gains: "A past it can carry and reconstruct.",          status: "locked" },
  { n: 4, id: "dreaming",         title: "Dreaming",         gains: "Keeps the gist and prunes the noise, offline.", status: "locked" },
  { n: 5, id: "attention",        title: "Attention",        gains: "Notices what stands out.",                      status: "locked" },
  { n: 6, id: "drives",           title: "Drives",           gains: "A mood that shapes its choices.",               status: "locked" },
  { n: 7, id: "habits",           title: "Habits",           gains: "Caches what it repeats.",                        status: "locked" },
  { n: 8, id: "self-model",       title: "The self-model",   gains: "Reflects on its own behaviour.",                status: "locked" },
];
