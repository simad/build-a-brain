/**
 * Episode 1 wiring schematic — an SVG "engineering diagram" of Astro's nervous
 * system: STIMULUS → NERVE RING (the reflex table) → RESPONSE. The brain box
 * returns 404 because C. elegans has none — just a nerve ring — so its pin is
 * left N.C (not connected). A cyan "current" pulse fires once per stimulus.
 *
 * Extensibility seam: `pathFor()` returns the SVG path the pulse runs. Episode 1
 * runs the same straight bus for every stimulus — that IS the lesson (same
 * circuit, every time). Later episodes add brain-module nodes and branch the
 * path through them here; the rest of the diagram stays as-is.
 */

// ponytail: ep1 ignores the stimulus — one path for all. Add cases when the
// brain modules light up (ep2+), no rewrite needed elsewhere.
function pathFor(_stimulus?: string): string {
  return "M162,306 L508,306";
}

const SVG = `
<svg viewBox="0 0 680 372" xmlns="http://www.w3.org/2000/svg" role="img" class="wire-svg">
  <title>Astro's reflex schematic (Episode 1)</title>
  <desc>A stimulus connects through the nerve ring's reflex table straight to the response. The brain returns 404 — C. elegans has none — and its pin is not connected.</desc>
  <defs>
    <pattern id="wgrid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M20,0 L0,0 0,20" fill="none" stroke="var(--muted)" stroke-width="0.5" opacity="0.18"/>
    </pattern>
    <filter id="wspark" x="-300%" y="-300%" width="700%" height="700%">
      <feGaussianBlur stdDeviation="2.6" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect x="0" y="0" width="680" height="372" fill="url(#wgrid)"/>

  <!-- title block -->
  <rect class="wbox" x="22" y="22" width="172" height="48" rx="2"/>
  <line x1="22" y1="46" x2="194" y2="46" stroke="var(--muted)" stroke-width="1"/>
  <text class="wt" x="32" y="40" font-size="16" letter-spacing="1.5">ASTRO · REV 1</text>
  <text class="ws" x="32" y="63" font-size="13" letter-spacing="1">EP.01 — REFLEX ARC</text>

  <!-- brain: 404 not found -->
  <rect class="wbox" x="252" y="30" width="206" height="86" rx="2" stroke-dasharray="6 5"/>
  <text class="wt" x="355" y="76" text-anchor="middle" font-size="30" letter-spacing="2">404</text>
  <text class="ws" x="355" y="100" text-anchor="middle" font-size="13" letter-spacing="2.5">BRAIN NOT FOUND</text>
  <line x1="355" y1="116" x2="355" y2="160" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="3 4"/>
  <circle cx="355" cy="164" r="5" fill="var(--bg)" stroke="var(--muted)" stroke-width="1.5"/>
  <text class="ws" x="370" y="168" font-size="12" letter-spacing="1">N.C — no brain to connect</text>

  <!-- stimulus -->
  <rect class="wbox" x="24" y="266" width="122" height="80" rx="2"/>
  <text class="wt" x="85" y="294" text-anchor="middle" font-size="16" letter-spacing="2">STIMULUS</text>
  <text class="wt" x="85" y="323" text-anchor="middle" font-size="18">💡 🔥 👆 🧁</text>
  <line x1="146" y1="306" x2="162" y2="306" stroke="var(--muted)" stroke-width="1.5"/>

  <!-- nerve ring -->
  <rect class="wbox" x="278" y="273" width="150" height="66" rx="2"/>
  <text class="wt" x="353" y="301" text-anchor="middle" font-size="16" letter-spacing="1.5">NERVE RING</text>
  <text class="ws" x="353" y="322" text-anchor="middle" font-size="13">reflex table · LUT</text>
  <line x1="262" y1="306" x2="278" y2="306" stroke="var(--muted)" stroke-width="1.5"/>
  <line x1="428" y1="306" x2="444" y2="306" stroke="var(--muted)" stroke-width="1.5"/>

  <!-- response -->
  <rect class="wbox" x="524" y="266" width="130" height="80" rx="2"/>
  <text class="wt" x="589" y="293" text-anchor="middle" font-size="16" letter-spacing="2">RESPONSE</text>
  <text class="ws" x="589" y="315" text-anchor="middle" font-size="13">retreat · recoil</text>
  <text class="ws" x="589" y="332" text-anchor="middle" font-size="13">flinch · ingest</text>
  <line x1="508" y1="306" x2="524" y2="306" stroke="var(--muted)" stroke-width="1.5"/>

  <!-- the live net (always drawn); current only flows on a press -->
  <line class="wwire" x1="162" y1="306" x2="262" y2="306"/>
  <line class="wwire" x1="444" y1="306" x2="508" y2="306"/>
  <rect x="159" y="303" width="6" height="6" fill="#0891b2"/>
  <rect x="259" y="303" width="6" height="6" fill="#0891b2"/>
  <rect x="441" y="303" width="6" height="6" fill="#0891b2"/>
  <rect x="505" y="303" width="6" height="6" fill="#0891b2"/>

  <!-- flowing current (hidden until a press) -->
  <line class="wflow" x1="162" y1="306" x2="262" y2="306" stroke-dasharray="2 7">
    <animate attributeName="opacity" begin="sparkMove.begin" dur="1s" values="0;1;1;0" keyTimes="0;0.1;0.8;1" fill="remove"/>
    <animate attributeName="stroke-dashoffset" begin="sparkMove.begin" dur="1s" values="0;-27" fill="remove"/>
  </line>
  <line class="wflow" x1="444" y1="306" x2="508" y2="306" stroke-dasharray="2 7">
    <animate attributeName="opacity" begin="sparkMove.begin" dur="1s" values="0;1;1;0" keyTimes="0;0.1;0.8;1" fill="remove"/>
    <animate attributeName="stroke-dashoffset" begin="sparkMove.begin" dur="1s" values="0;-27" fill="remove"/>
  </line>

  <!-- electric charge: a flickering zigzag bolt that crackles along the bus -->
  <g filter="url(#wspark)" opacity="0">
    <path fill="none" stroke="#22d3ee" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"
          d="M-11,0 L-6,-5 L-2,4 L2,-4 L6,5 L11,0">
      <animate attributeName="d" begin="sparkMove.begin" dur="0.1s" repeatCount="10" fill="remove"
               values="M-11,0 L-6,-5 L-2,4 L2,-4 L6,5 L11,0;
                       M-11,1 L-7,5 L-2,-5 L3,4 L7,-4 L11,-1;
                       M-11,-1 L-6,-4 L-1,5 L3,-5 L7,4 L11,1;
                       M-11,0 L-6,-5 L-2,4 L2,-4 L6,5 L11,0"/>
    </path>
    <path fill="none" stroke="#ecfeff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
          d="M-11,0 L-6,-5 L-2,4 L2,-4 L6,5 L11,0">
      <animate attributeName="d" begin="sparkMove.begin" dur="0.1s" repeatCount="10" fill="remove"
               values="M-11,0 L-6,-5 L-2,4 L2,-4 L6,5 L11,0;
                       M-11,1 L-7,5 L-2,-5 L3,4 L7,-4 L11,-1;
                       M-11,-1 L-6,-4 L-1,5 L3,-5 L7,4 L11,1;
                       M-11,0 L-6,-5 L-2,4 L2,-4 L6,5 L11,0"/>
    </path>
    <animateMotion id="sparkMove" begin="indefinite" dur="1s" rotate="auto" path="M162,306 L508,306" keyPoints="0;0.42;0.55;0.95;1" keyTimes="0;0.38;0.58;0.92;1" calcMode="linear" fill="remove"/>
    <animate attributeName="opacity" begin="sparkMove.begin" dur="1s" values="0;1;1;1;0" keyTimes="0;0.06;0.6;0.9;1" fill="remove"/>
  </g>
</svg>`;

/** Render the schematic into `host`; returns a `pulse(stimulus)` to fire current. */
export function mountWiring(host: HTMLElement): (stimulus?: string) => void {
  host.innerHTML = SVG;
  const move = host.querySelector<SVGElement>("#sparkMove");
  return (stimulus?: string) => {
    if (!move) return;
    move.setAttribute("path", pathFor(stimulus));
    (move as unknown as { beginElement: () => void }).beginElement();
  };
}
