/**
 * Episode 2 wiring schematic — the brain is no longer 404. It now holds its
 * first module: WORKING MEMORY (the prefrontal cortex), wired to the nerve ring
 * (the pin that was "N.C" in Episode 1 is now connected). On an ordinary
 * stimulus the charge runs straight stimulus → nerve ring → response; on a
 * *repeat* (heat seen twice) it detours up through working memory, which
 * changes the output to `flee`.
 *
 * Same extensibility seam as ep1: `pathFor(action)` picks the route. Each future
 * episode bolts another module into the brain and adds a case here.
 */

const STRAIGHT = "M162,306 L508,306";
// stimulus → nerve ring → up into working memory → back down → response
const VIA_WM = "M162,306 L353,306 L353,118 L353,306 L508,306";

function pathFor(action: string): string {
  return action === "flee" ? VIA_WM : STRAIGHT;
}

const SVG = `
<svg viewBox="0 0 680 390" xmlns="http://www.w3.org/2000/svg" role="img" class="wire-svg">
  <title>Astro's schematic with working memory (Episode 2)</title>
  <desc>A stimulus runs through the nerve ring to the response; the brain now holds a working-memory module wired to the nerve ring, and a repeated stimulus detours up through it to change the output to flee.</desc>
  <defs>
    <pattern id="wgrid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M20,0 L0,0 0,20" fill="none" stroke="var(--muted)" stroke-width="0.5" opacity="0.18"/>
    </pattern>
    <filter id="wspark" x="-300%" y="-300%" width="700%" height="700%">
      <feGaussianBlur stdDeviation="2.6" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect x="0" y="0" width="680" height="390" fill="url(#wgrid)"/>

  <!-- title block -->
  <rect class="wbox" x="22" y="22" width="200" height="48" rx="2"/>
  <line x1="22" y1="46" x2="222" y2="46" stroke="var(--muted)" stroke-width="1"/>
  <text class="wt" x="32" y="40" font-size="16" letter-spacing="1.5">ASTRO · REV 2</text>
  <text class="ws" x="32" y="63" font-size="11" letter-spacing="1">EP.02 — WORKING MEMORY</text>

  <!-- brain: now populated with its first module -->
  <rect class="wbox" x="248" y="26" width="216" height="112" rx="2"/>
  <text class="wt" x="356" y="44" text-anchor="middle" font-size="11" letter-spacing="3">BRAIN</text>
  <rect class="wbox" x="266" y="52" width="180" height="74" rx="2"/>
  <text class="wt" x="356" y="72" text-anchor="middle" font-size="13" letter-spacing="1">WORKING MEMORY</text>
  <text class="ws" x="356" y="88" text-anchor="middle" font-size="10">prefrontal cortex · 4 slots</text>
  <rect class="wm-slot" x="304" y="100" width="20" height="15" rx="2"/>
  <rect class="wm-slot" x="332" y="100" width="20" height="15" rx="2"/>
  <rect class="wm-slot" x="360" y="100" width="20" height="15" rx="2"/>
  <rect class="wm-slot" x="388" y="100" width="20" height="15" rx="2"/>

  <!-- nerve ring ⇆ working memory: the pin that was N.C in ep1 is now wired -->
  <line class="wwire" x1="353" y1="138" x2="353" y2="273"/>
  <text class="ws" x="362" y="208" font-size="9" letter-spacing="1">writes + reads</text>

  <!-- stimulus -->
  <rect class="wbox" x="24" y="266" width="122" height="80" rx="2"/>
  <text class="wt" x="85" y="294" text-anchor="middle" font-size="16" letter-spacing="2">STIMULUS</text>
  <text class="wt" x="85" y="323" text-anchor="middle" font-size="18">💡 🔥 👆 🧁</text>
  <line x1="146" y1="306" x2="162" y2="306" stroke="var(--muted)" stroke-width="1.5"/>

  <!-- nerve ring -->
  <rect class="wbox" x="278" y="273" width="150" height="66" rx="2"/>
  <text class="wt" x="353" y="300" text-anchor="middle" font-size="16" letter-spacing="1.5">NERVE RING</text>
  <text class="ws" x="353" y="320" text-anchor="middle" font-size="11">reflex table · LUT</text>
  <line x1="262" y1="306" x2="278" y2="306" stroke="var(--muted)" stroke-width="1.5"/>
  <line x1="428" y1="306" x2="444" y2="306" stroke="var(--muted)" stroke-width="1.5"/>

  <!-- response -->
  <rect class="wbox" x="524" y="266" width="130" height="80" rx="2"/>
  <text class="wt" x="589" y="290" text-anchor="middle" font-size="16" letter-spacing="2">RESPONSE</text>
  <text class="ws" x="589" y="312" text-anchor="middle" font-size="9.5">retreat · recoil · flinch</text>
  <text class="ws" x="589" y="327" text-anchor="middle" font-size="9.5">ingest · flee</text>
  <line x1="508" y1="306" x2="524" y2="306" stroke="var(--muted)" stroke-width="1.5"/>

  <!-- live net -->
  <line class="wwire" x1="162" y1="306" x2="262" y2="306"/>
  <line class="wwire" x1="444" y1="306" x2="508" y2="306"/>
  <rect x="159" y="303" width="6" height="6" fill="#0891b2"/>
  <rect x="259" y="303" width="6" height="6" fill="#0891b2"/>
  <rect x="441" y="303" width="6" height="6" fill="#0891b2"/>
  <rect x="505" y="303" width="6" height="6" fill="#0891b2"/>
  <rect x="350" y="135" width="6" height="6" fill="#0891b2"/>
  <rect x="350" y="270" width="6" height="6" fill="#0891b2"/>

  <!-- electric charge: a flickering zigzag bolt that runs the active route -->
  <g filter="url(#wspark)" opacity="0">
    <path fill="none" stroke="#22d3ee" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"
          d="M-11,0 L-6,-5 L-2,4 L2,-4 L6,5 L11,0">
      <animate attributeName="d" begin="sparkMove.begin" dur="0.1s" repeatCount="11" fill="remove"
               values="M-11,0 L-6,-5 L-2,4 L2,-4 L6,5 L11,0;
                       M-11,1 L-7,5 L-2,-5 L3,4 L7,-4 L11,-1;
                       M-11,-1 L-6,-4 L-1,5 L3,-5 L7,4 L11,1;
                       M-11,0 L-6,-5 L-2,4 L2,-4 L6,5 L11,0"/>
    </path>
    <path fill="none" stroke="#ecfeff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
          d="M-11,0 L-6,-5 L-2,4 L2,-4 L6,5 L11,0">
      <animate attributeName="d" begin="sparkMove.begin" dur="0.1s" repeatCount="11" fill="remove"
               values="M-11,0 L-6,-5 L-2,4 L2,-4 L6,5 L11,0;
                       M-11,1 L-7,5 L-2,-5 L3,4 L7,-4 L11,-1;
                       M-11,-1 L-6,-4 L-1,5 L3,-5 L7,4 L11,1;
                       M-11,0 L-6,-5 L-2,4 L2,-4 L6,5 L11,0"/>
    </path>
    <animateMotion id="sparkMove" begin="indefinite" dur="1.1s" rotate="auto" path="M162,306 L508,306" calcMode="linear" fill="remove"/>
    <animate attributeName="opacity" begin="sparkMove.begin" dur="1.1s" values="0;1;1;1;0" keyTimes="0;0.06;0.6;0.9;1" fill="remove"/>
  </g>
</svg>`;

/** Render the schematic into `host`; returns a `pulse(action)` to fire current. */
export function mountWmWiring(host: HTMLElement): (action?: string) => void {
  host.innerHTML = SVG;
  const move = host.querySelector<SVGElement>("#sparkMove");
  return (action?: string) => {
    if (!move) return;
    move.setAttribute("path", pathFor(action ?? ""));
    (move as unknown as { beginElement: () => void }).beginElement();
  };
}
