/**
 * Episode 2 — Working Memory.
 *
 * The brain's tiny, expensive desk: a few items held "online" at once, kept
 * alive only by sustained activity, and silently overwritten when something
 * new arrives. Cowan's modern estimate is ~4 chunks — so the default capacity
 * is 4. The smallness is the feature.
 *
 * It's a bounded queue (a deque with maxlen): push the newest, drop the oldest.
 */

export class WorkingMemory {
  private items: string[] = [];

  // ponytail: capacity is a knob, not a constant — the Lab task is "raise it
  // and watch Astro get smarter / more goldfish-like". Real WM is ~4 chunks.
  constructor(public capacity = 4) {}

  /** Hold a new item; the oldest falls out the back once we're over capacity. */
  push(item: string): void {
    this.items.push(item);
    while (this.items.length > this.capacity) this.items.shift();
  }

  /** How many of `item` are currently being held. */
  countOf(item: string): number {
    return this.items.filter((x) => x === item).length;
  }

  /** Everything currently on the desk, oldest → newest. */
  get contents(): readonly string[] {
    return this.items;
  }

  get size(): number {
    return this.items.length;
  }
}
