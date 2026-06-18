/**
 * Episode 2 panel — Working Memory.
 *
 * Logic comes from this episode's frozen creature (`episodes/02/astro.ts`):
 * each press lands on a 4-slot buffer, and a second heat in the buffer makes
 * Astro `flee` instead of recoiling. The creature RENDER is the shared
 * `reflexSketch`; the buffer + schematic make the new faculty visible.
 */

import { Astro, type Action } from "../../episodes/02-working-memory/astro.ts";
import { isDark } from "../theme.ts";
import { reflexSketch } from "./reflex-sketch.ts";
import { mountWmWiring } from "./working-memory-wiring.ts";

declare const p5: any;

const SENSE_ICON: Record<string, string> = {
  light: "💡",
  heat: "🔥",
  poke: "👆",
  food: "🧁",
};

const SLOTS = 4;

export function mountWorkingMemory(host: HTMLElement): () => void {
  const astro = new Astro();

  host.innerHTML = `
    <div class="kicker">Episode 2 · Prefrontal cortex</div>
    <h2>Astro remembers</h2>
    <p class="muted">A tiny scratchpad — the last ${SLOTS} things it sensed. For the first time, the recent past can change what it does.</p>
    <div class="stage" id="astro-canvas"><div class="fallback">🦠</div></div>
    <div class="stim-row"></div>
    <div class="wm-buffer">
      <div class="wm-label">Working memory · ${SLOTS} slots <span class="wm-hint">oldest → newest</span></div>
      <div class="wm-cells"></div>
    </div>
    <div class="wiring" id="astro-wiring"></div>
    <div class="trace">
      <div class="code">wm.push(x); if (wm.length > ${SLOTS}) wm.shift()   # ~4 slots, then forget
heat seen twice in wm → flee</div>
      <div class="log"></div>
    </div>
    <p class="muted small">↑ Feel <b>heat twice</b> and Astro flees — it can finally tell "this again." Feed it ${SLOTS + 1} things and the oldest falls out the back. <b>Next episode: long-term memory.</b></p>
  `;

  const holder = host.querySelector<HTMLElement>("#astro-canvas")!;
  const stimRow = host.querySelector<HTMLElement>(".stim-row")!;
  const cellsEl = host.querySelector<HTMLElement>(".wm-cells")!;
  const logEl = host.querySelector<HTMLElement>(".trace .log")!;
  const pulse = mountWmWiring(host.querySelector<HTMLElement>("#astro-wiring")!);
  const trace: string[] = [];

  const renderBuffer = (): void => {
    const mem = astro.memory;
    let html = "";
    for (let i = 0; i < SLOTS; i++) {
      const item = mem[i];
      html += item
        ? `<div class="wm-cell filled">${SENSE_ICON[item] ?? "·"}</div>`
        : `<div class="wm-cell"></div>`;
    }
    cellsEl.innerHTML = html;
  };
  renderBuffer();

  let sketch: any = null;
  const trigger = (action: Action): void => {
    if (sketch && sketch.trigger) sketch.trigger(action);
  };

  for (const sense of astro.senses) {
    const btn = document.createElement("button");
    btn.className = "stim";
    btn.innerHTML = `<span class="ic">${SENSE_ICON[sense] ?? "•"}</span><span class="lbl">${sense}</span>`;
    btn.addEventListener("click", () => {
      const action = astro.perceive(sense);
      trigger(action);
      pulse(action);
      renderBuffer();

      const tag = action === "flee" ? "  ⚡ heat again — fled" : "";
      trace.push(`perceive("${sense}") → ${action}()${tag}`);
      if (trace.length > 6) trace.shift();
      logEl.innerHTML = trace.map((l) => `<div>${l}</div>`).join("");
    });
    stimRow.appendChild(btn);
  }

  if (typeof p5 !== "undefined") {
    holder.innerHTML = "";
    sketch = new p5(
      (p: any) =>
        reflexSketch(p, {
          isDark,
          width: () => holder.clientWidth || 320,
          height: () => holder.clientHeight || 190,
        }),
      holder,
    );
  }

  return () => {
    if (sketch) {
      sketch.remove();
      sketch = null;
    }
  };
}
