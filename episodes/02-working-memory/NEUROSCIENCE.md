# Episode 2 — Neuroscience notes & sources

## Working memory, in plain terms

Working memory is holding a few things "online" while you work on them — not storage, but active maintenance.

1. A small population of neurons in the **prefrontal cortex** (with parietal partners) keeps firing to hold an item active — **persistent activity**.
2. Because the item is held by *activity*, not by a written trace, it's **volatile**: interrupt the firing and the item is lost.
3. Capacity is small — Cowan's estimate is about **4 chunks** — and a "chunk" can be large if it's a familiar pattern (**chunking**).

## Why it matters for the build

A bounded queue (`maxlen = 4`) is a faithful cartoon of all three properties: it's **small**, it's **volatile** (cleared when the program ends, like activity-based storage), and a new item **overwrites** the oldest (interference / displacement). The new ability it unlocks — acting on the recent past — is the first thing reflexes alone can't do.

## Honest caveats

- Decay is driven by **time and interference**, not a strict oldest-first eviction.
- The limit is in **chunks**, not raw items; expertise repacks the slots rather than adding them.
- Real WM is **gated by attention** (Episode 5) — not everything you sense gets a slot.

## Sources

- **The original "magical number seven":** Miller, G. A. (1956). *The Magical Number Seven, Plus or Minus Two.* *Psychological Review, 63*(2), 81–97.
- **The modern revision down to ~4:** Cowan, N. (2001). *The magical number 4 in short-term memory: a reconsideration of mental storage capacity.* *Behavioral and Brain Sciences, 24*(1), 87–114. https://pubmed.ncbi.nlm.nih.gov/11515286/
- **Persistent prefrontal activity as the substrate of WM:** Goldman-Rakic, P. S. (1995). *Cellular basis of working memory.* *Neuron, 14*(3), 477–485. https://pubmed.ncbi.nlm.nih.gov/7695894/
- **The structure of WM (phonological loop, central executive):** Baddeley, A. D., & Hitch, G. (1974). *Working memory.* In *The Psychology of Learning and Motivation* (Vol. 8). Any cognitive psychology text covers the model.

*Citations verified via PubMed where linked.*
