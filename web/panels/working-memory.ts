/**
 * Episode 2 panel — Working Memory.
 *
 * Logic comes from this episode's frozen creature (`episodes/02/astro.ts`):
 * each press lands on a 4-slot buffer, and the recent past can override the
 * raw reflex (heat→flee, light→hide, food→sated, poke→habituate). The creature
 * RENDER is the shared `reflexSketch`; the schematic's live slots make the
 * buffer visible.
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

// What to append in the trace when the recent past overrode the reflex.
const REPEAT_NOTE: Partial<Record<Action, string>> = {
  flee: "⚡ heat again — fled",
  hide: "⚡ light again — hid",
  sated: "⚡ just ate — ignored",
  habituate: "⚡ used to it — stopped flinching",
};

export function mountWorkingMemory(host: HTMLElement): () => void {
  const astro = new Astro();

  host.innerHTML = `
    <div class="kicker">Episode 2 · Prefrontal cortex</div>
    <h2>Astro remembers</h2>
    <p class="muted">A tiny scratchpad — the last 4 things it sensed. For the first time the recent past can change what it does: hit the same sense twice and watch it react differently.</p>
    <div class="stage" id="astro-canvas"><div class="fallback">🦠</div></div>
    <div class="stim-row"></div>
    <div class="wiring" id="astro-wiring"></div>
    <div class="trace">
      <div class="code">wm.push(x); if (wm.length > 4) wm.shift()   # ~4 slots, then forget
heat×2 → flee · light×2 → hide · food×2 → sated · poke×3 → habituate</div>
      <div class="log"></div>
    </div>
    <p class="muted small">↑ The 4 slots above <b>are</b> working memory — watch them fill, then the oldest fall out the back. Repeat a sense and the charge detours up through the brain. <b>Next episode: long-term memory.</b></p>
  `;

  const holder = host.querySelector<HTMLElement>("#astro-canvas")!;
  const stimRow = host.querySelector<HTMLElement>(".stim-row")!;
  const logEl = host.querySelector<HTMLElement>(".trace .log")!;
  const wiring = mountWmWiring(host.querySelector<HTMLElement>("#astro-wiring")!);
  const trace: string[] = [];

  const refreshSlots = (): void =>
    wiring.setSlots(astro.memory.map((s) => SENSE_ICON[s] ?? "·"));
  refreshSlots();

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
      wiring.pulse(action);
      refreshSlots();

      const note = REPEAT_NOTE[action];
      trace.push(`perceive("${sense}") → ${action}()${note ? "  " + note : ""}`);
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
