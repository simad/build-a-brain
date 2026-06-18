/**
 * The webapp shell: a left rail of episodes (live ones selectable, later ones
 * faded + locked) and a main panel that shows the selected episode. Panels are
 * looked up by id, so each released episode just registers one here.
 */

import { EPISODES, isLive, type EpisodeMeta } from "./episodes.ts";
import { mountReflexArc } from "./panels/reflex-arc.ts";
import { mountWorkingMemory } from "./panels/working-memory.ts";

/** A panel mounts itself into `host` and optionally returns a cleanup fn. */
type PanelMount = (host: HTMLElement) => (() => void) | void;

const PANELS: Record<string, PanelMount> = {
  "reflex-arc": mountReflexArc,
  "working-memory": mountWorkingMemory,
};

/** How many locked episodes to show before collapsing the rest into a hint. */
const LOCKED_PREVIEW = 2;

export function mountShell(root: HTMLElement): void {
  root.innerHTML = `<nav class="rail"></nav><main class="panel"></main>`;
  const rail = root.querySelector<HTMLElement>(".rail")!;
  const panel = root.querySelector<HTMLElement>(".panel")!;

  let cleanup: (() => void) | void;

  const select = (ep: EpisodeMeta): void => {
    if (cleanup) {
      cleanup();
      cleanup = undefined;
    }
    rail.querySelectorAll(".ep-item").forEach((el) =>
      el.classList.toggle("active", el.getAttribute("data-id") === ep.id),
    );
    panel.innerHTML = "";
    const mount = PANELS[ep.id];
    if (isLive(ep) && mount) {
      cleanup = mount(panel);
    } else {
      renderTeaser(panel, ep);
    }
  };

  // Rail: every live episode, then up to LOCKED_PREVIEW locked ones, then a hint.
  rail.innerHTML = `<div class="rail-title">Episodes</div>`;
  const shown: EpisodeMeta[] = [];
  let lockedShown = 0;
  for (const ep of EPISODES) {
    if (isLive(ep)) shown.push(ep);
    else if (lockedShown < LOCKED_PREVIEW) {
      shown.push(ep);
      lockedShown++;
    }
  }

  shown.forEach((ep, i) => {
    const locked = !isLive(ep);
    const item = document.createElement("button");
    item.className = "ep-item" + (locked ? " locked" : "");
    item.setAttribute("data-id", ep.id);
    if (locked) item.style.opacity = i === shown.length - 1 ? "0.4" : "0.6";
    item.innerHTML =
      `<span class="badge">${ep.n}</span>` +
      `<span class="ep-title">${ep.title}</span>` +
      (locked ? `<span class="lock" aria-label="locked">🔒</span>` : "");
    item.addEventListener("click", () => select(ep));
    rail.appendChild(item);
  });

  const remaining = EPISODES.length - shown.length;
  const hint = document.createElement("div");
  hint.className = "rail-more";
  hint.textContent = remaining > 0 ? `+${remaining} more, then season 2` : "then season 2";
  rail.appendChild(hint);

  const firstLive = EPISODES.find((e) => isLive(e)) ?? EPISODES[0]!;
  select(firstLive);
}

function renderTeaser(panel: HTMLElement, ep: EpisodeMeta): void {
  const when = new Date(ep.releaseAt).toLocaleDateString(undefined, { month: "long", day: "numeric" });
  panel.innerHTML =
    `<div class="teaser">` +
    `<div class="kicker">Episode ${ep.n}</div>` +
    `<h2>${ep.title}</h2>` +
    `<p class="muted">${ep.gains}</p>` +
    `<div class="locked-pill">🔒 Unlocks ${when}</div>` +
    `</div>`;
}
