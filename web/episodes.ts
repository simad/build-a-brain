/**
 * The episode roadmap — all of Season 1 lives here on `main`. Visibility is
 * gated by date, not by branch: an episode goes live when its `releaseAt` has
 * arrived. So cross-cutting changes touch one branch, and scheduling a post is
 * just editing a date. (See RELEASING.md.)
 */

export interface EpisodeMeta {
  n: number;
  /** Matches `episodes/NN-<id>/` and `web/panels/<id>.ts`. */
  id: string;
  title: string;
  /** One line for the locked teaser — "what Astro gains". */
  gains: string;
  /** ISO date (YYYY-MM-DD) the episode unlocks. Today or earlier ⇒ live. */
  releaseAt: string;
}

/** Released once its date has arrived — drives the rail's live/locked split. */
export function isLive(ep: EpisodeMeta): boolean {
  return new Date(ep.releaseAt) <= new Date();
}

// Cadence: one episode every 2 weeks. Edit these dates to reschedule — the date
// alone controls when each episode appears; the code already lives on main.
export const EPISODES: EpisodeMeta[] = [
  { n: 1, id: "reflex-arc",       title: "The reflex arc",   gains: "Hardwired stimulus → response, with no memory.", releaseAt: "2026-06-18" },
  { n: 2, id: "working-memory",   title: "Working memory",   gains: "A tiny scratchpad it can hold a few things in.", releaseAt: "2026-07-02" },
  { n: 3, id: "long-term-memory", title: "Long-term memory", gains: "A past it can carry and reconstruct.",          releaseAt: "2026-07-16" },
  { n: 4, id: "dreaming",         title: "Dreaming",         gains: "Keeps the gist and prunes the noise, offline.", releaseAt: "2026-07-30" },
  { n: 5, id: "attention",        title: "Attention",        gains: "Notices what stands out.",                      releaseAt: "2026-08-13" },
  { n: 6, id: "drives",           title: "Drives",           gains: "A mood that shapes its choices.",               releaseAt: "2026-08-27" },
  { n: 7, id: "habits",           title: "Habits",           gains: "Caches what it repeats.",                        releaseAt: "2026-09-10" },
  { n: 8, id: "self-model",       title: "The self-model",   gains: "Reflects on its own behaviour.",                releaseAt: "2026-09-24" },
];
