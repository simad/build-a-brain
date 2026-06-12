/**
 * Episode 1 panel — the Reflex Arc.
 *
 * The LOGIC comes from the shared creature (`src/astro.ts`): a button press calls
 * `astro.perceive(stimulus)` and the returned action drives the animation. The p5
 * RENDERING lives in `reflex-sketch.ts` (pure, so it can be unit-tested).
 */

import { Astro, type Action } from "../../src/astro.ts";
import { isDark } from "../theme.ts";
import { reflexSketch } from "./reflex-sketch.ts";

declare const p5: any;

const SENSE_ICON: Record<string, string> = {
  light: "💡",
  heat: "🔥",
  poke: "👆",
  food: "🧁",
};

export function mountReflexArc(host: HTMLElement): () => void {
  const astro = new Astro();

  host.innerHTML = `
    <div class="kicker">Episode 1 · Amoeba</div>
    <h2>Meet Astro</h2>
    <p class="muted">No brain yet — just hardwired reflexes. Same input, same action, every time.</p>
    <div class="stage" id="astro-canvas"><div class="fallback">🦠</div></div>
    <div class="stim-row"></div>
    <div class="trace">
      <div class="code">REFLEX = { light: approach, heat: recoil, poke: flinch, food: eat }
# no state · no memory · perceive → act</div>
      <div class="log"></div>
    </div>
    <p class="muted small">↑ Press the same input twice — identical reflex, every time. Astro can't tell this is the 5th poke. <b>Next episode: working memory.</b></p>
  `;

  const holder = host.querySelector<HTMLElement>("#astro-canvas")!;
  const stimRow = host.querySelector<HTMLElement>(".stim-row")!;
  const logEl = host.querySelector<HTMLElement>(".trace .log")!;
  const trace: string[] = [];

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
      trace.push(`perceive("${sense}") → ${action}()`);
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
