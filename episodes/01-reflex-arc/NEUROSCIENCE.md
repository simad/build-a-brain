# Episode 1 — Neuroscience notes & sources

## The reflex arc, in plain terms

A reflex is a circuit that **bypasses the brain**:

1. A **sensory neuron** detects something (heat, pressure).
2. It synapses in the **spinal cord** — sometimes directly onto a motor neuron (a *monosynaptic* reflex, like the knee-jerk), more often via one or two **interneurons** (a *polysynaptic* reflex, like pulling away from pain).
3. A **motor neuron** fires the muscle.

The brain is informed *afterwards* — which is why the conscious feeling ("ow!") arrives just after the movement. The point of the shortcut is **speed**: fewer synapses and a shorter path mean a faster response, and for danger that latency is survival.

The signal itself travels as an **action potential** — a self-propagating wave of voltage down the axon, the mechanism Hodgkin & Huxley worked out (and won a Nobel for).

## Why it matters for the build

Reflexes are **stateless**: the same input always produces the same output, with no memory of the past. That maps perfectly onto Astro's Stage 1 — a lookup table and a one-line `perceive()`. The biology and the code agree: at this layer, there is nowhere for a thought to live.

## Honest caveats

- Real reflexes can be **modulated** (sensitised or habituated) — they're not perfectly fixed.
- Even a 302-neuron worm shows simple **learning** (habituation to a repeated harmless stimulus). Astro's version is the idealised textbook reflex; we add modulation later.

## Sources

- **Axon conduction (how the signal travels):** Hodgkin, A. L., & Huxley, A. F. (1952). *A quantitative description of membrane current and its application to conduction and excitation in nerve.* *J. Physiol., 117*(4), 500–544. https://pubmed.ncbi.nlm.nih.gov/12991237/
- **The spinal cord, reflex arcs, the wiring in general (textbook):** Kandel, Schwartz, Jessell, et al., *Principles of Neural Science* (6th ed.). The reflex concept traces to Sherrington, *The Integrative Action of the Nervous System* (1906).
- **A whole nervous system mapped — *C. elegans* (302 neurons):** White, J. G., et al. (1986). *Phil. Trans. R. Soc. Lond. B.* https://pubmed.ncbi.nlm.nih.gov/3965635/ — and the modern complete version: Cook, S. J., et al. (2019). *Nature.* https://pubmed.ncbi.nlm.nih.gov/31270481/

*Citations verified via PubMed.*
