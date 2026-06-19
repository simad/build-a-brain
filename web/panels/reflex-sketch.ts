/**
 * The Episode 1 creature sketch (C. elegans) — pure p5 rendering with NO DOM or theme imports,
 * so it can be unit-tested with a mock p5. The creature LOGIC lives in
 * `src/astro.ts`; this only animates whatever action it returns.
 */

import { type Action } from "../../src/astro.ts";

export interface SketchEnv {
  isDark: () => boolean;
  width: () => number;
  height: () => number;
}

/** Animation duration per action (ms). */
const ANIM: Record<Action, number> = {
  retreat: 1070,
  recoil: 730,
  flinch: 495,
  ingest: 1170,
  flee: 1500, // long enough to run off one side and reappear on the other
  hide: 950,
  sated: 1050,
  habituate: 560,
  ignore: 440,
};

interface Palette {
  bg: number[];
  body: number[];
  hi: number[];
  organ: number[];
  cilia: number[];
  eye: number[];
  pupil: number[];
}

function palette(dark: boolean): Palette {
  return dark
    ? {
        bg: [22, 22, 30],
        body: [150, 120, 226],
        hi: [178, 152, 242],
        organ: [110, 86, 196],
        cilia: [150, 120, 226],
        eye: [248, 248, 255],
        pupil: [28, 22, 52],
      }
    : {
        bg: [243, 246, 255],
        body: [171, 133, 230],
        hi: [200, 172, 244],
        organ: [138, 95, 208],
        cilia: [171, 133, 230],
        eye: [255, 255, 255],
        pupil: [46, 33, 80],
      };
}

/** Smoothed expressive channels (concrete keys so arithmetic stays `number`). */
interface Expr {
  offX: number;
  offY: number;
  squash: number;
  lookX: number;
  lookY: number;
  blink: number;
  mouth: number;
  distress: number;
}
const EXPR_KEYS = ["offX", "offY", "squash", "lookX", "lookY", "blink", "mouth", "distress"] as const;

export function reflexSketch(p: any, envv: SketchEnv): void {
  const W = envv.width;
  const H = envv.height;
  const R = 56;

  let action: Action | null = null;
  let start = 0;

  const st: Expr = {
    offX: 0, offY: 0, squash: 0, lookX: 0, lookY: 0, blink: 0, mouth: 0, distress: 0,
  };
  let blinkTimer = 0;
  let nextBlink = 2.5 + Math.random() * 3;
  let loggedErr = false;

  // Cupcakes Astro is too full to eat, piling chaotically on the floor (fade out).
  const floorCupcakes: { x: number; y: number; born: number; rot: number }[] = [];
  const CUPCAKE_LIFE = 3200;

  p.setup = () => {
    p.createCanvas(W(), H());
    p.frameRate(60);
  };
  p.windowResized = () => p.resizeCanvas(W(), H());
  p.trigger = (a: Action) => {
    action = a;
    start = p.millis();
    // Sated = too full to eat: the thrown cupcake lands on the floor and piles up.
    if (a === "sated" && floorCupcakes.length < 16) {
      const w = W();
      const h = H();
      floorCupcakes.push({
        x: w / 2 + 36 + Math.random() * (w / 2 - 56),
        y: h - 20 - Math.random() * 10,
        born: p.millis(),
        rot: (Math.random() - 0.5) * 0.7,
      });
    }
  };

  // Draw an emoji prop, fading via SIZE (no raw drawingContext / globalAlpha,
  // which could wedge canvas state). p5's push/pop keeps style balanced.
  const drawProp = (glyph: string, x: number, y: number, size: number, rot = 0): void => {
    if (size < 1) return;
    p.push();
    p.noStroke();
    p.fill(0, 0, 0, 255); // ponytail: opaque fill — else the spotlight's faded-out fill leaks in and the emoji draws invisible
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(size);
    p.translate(x, y);
    if (rot) p.rotate(rot);
    p.text(glyph, 0, 0);
    p.pop();
  };

  const drawSpotlight = (x: number, y: number, a: number): void => {
    p.noStroke();
    p.fill(255, 170, 60, 38 * a);
    p.circle(x, y, 190);
    p.fill(255, 188, 92, 64 * a);
    p.circle(x, y, 118);
    p.fill(255, 216, 142, 104 * a);
    p.circle(x, y, 62);
  };

  const drawFace = (C: Palette): void => {
    const eyeDX = 19;
    const eyeY = -7;
    const open = 1 - Math.min(1, st.blink);
    const lookX = st.lookX * 4;
    const lookY = st.lookY * 4;

    p.noStroke();
    p.fill(C.eye[0], C.eye[1], C.eye[2]);
    const ry = Math.max(1.4, 11 * open);
    p.ellipse(-eyeDX, eyeY, 18, ry * 2);
    p.ellipse(eyeDX, eyeY, 18, ry * 2);

    if (open > 0.28) {
      const pr = 5 * open;
      p.fill(C.pupil[0], C.pupil[1], C.pupil[2]);
      p.circle(-eyeDX + lookX, eyeY + lookY, pr * 2);
      p.circle(eyeDX + lookX, eyeY + lookY, pr * 2);
      p.fill(255, 255, 255);
      p.circle(-eyeDX + lookX - 2, eyeY + lookY - 3, 2.4);
      p.circle(eyeDX + lookX - 2, eyeY + lookY - 3, 2.4);
    } else {
      p.stroke(C.pupil[0], C.pupil[1], C.pupil[2]);
      p.strokeWeight(2.6);
      p.strokeCap(p.ROUND);
      p.noFill();
      p.line(-eyeDX - 6, eyeY, -eyeDX + 6, eyeY);
      p.line(eyeDX - 6, eyeY, eyeDX + 6, eyeY);
      p.noStroke();
    }

    if (st.distress > 0.35) {
      // Worried zigzag mouth.
      p.noFill();
      p.stroke(C.pupil[0], C.pupil[1], C.pupil[2]);
      p.strokeWeight(2.6);
      p.strokeCap(p.ROUND);
      p.strokeJoin(p.ROUND);
      p.beginShape();
      const zz: number[][] = [[-12, 13], [-7, 17], [-2, 12], [3, 17], [8, 12], [12, 16]];
      for (const pt of zz) p.vertex(pt[0]!, pt[1]!);
      p.endShape();
      p.noStroke();
    } else if (st.mouth > 0.4) {
      // Open mouth (eating).
      p.noStroke();
      p.fill(C.pupil[0], C.pupil[1], C.pupil[2]);
      p.ellipse(0, 15, 8 + 12 * st.mouth, 6 + 12 * st.mouth);
    } else {
      // Smile.
      p.noFill();
      p.stroke(C.pupil[0], C.pupil[1], C.pupil[2]);
      p.strokeWeight(3);
      p.strokeCap(p.ROUND);
      p.arc(0, 12, 22, 9 + st.mouth * 10, 0, p.PI);
      p.noStroke();
    }
  };

  p.draw = () => {
    try {
      const C = palette(envv.isDark());
      p.background(C.bg[0], C.bg[1], C.bg[2]);
      const t = p.millis() / 1000;

      // Targets — rest unless an action is in flight.
      const tg: Expr = {
        offX: 0, offY: 0, squash: 0, lookX: 0, lookY: 0, blink: 0, mouth: 0, distress: 0,
      };
      let curE = 0;
      let curEnv = 0;
      let fleeX: number | null = null; // flee bypasses the spring to wrap off-screen
      if (action) {
        const dur = ANIM[action];
        curE = Math.min(1, (p.millis() - start) / dur);
        curEnv = Math.sin(Math.PI * curE);
        if (action === "retreat") {
          // Light sits to the right; Astro eases away from it (calm, not a flinch).
          tg.offX = -48 * curEnv;
          tg.offY = -4 * curEnv;
          tg.lookX = -0.6 * curEnv;
        } else if (action === "recoil") {
          tg.offX = -60 * curEnv;
          tg.squash = -0.3 * curEnv;
          tg.blink = 0.5 * curEnv;
          tg.lookX = -0.6 * curEnv;
          tg.distress = curEnv;
        } else if (action === "flinch") {
          tg.squash = -0.26 * curEnv;
          tg.blink = curEnv;
          tg.offX = 4 * Math.sin(16 * Math.PI * curE) * curEnv;
        } else if (action === "ingest") {
          tg.offX = 40 * curEnv;
          tg.offY = 4 * curEnv;
          tg.lookY = 0.4 * curEnv;
          tg.mouth = Math.abs(Math.sin(curE * Math.PI * 3)) * curEnv;
          tg.squash = 0.1 * curEnv;
        } else if (action === "flee") {
          // Bolt clean off one side and reappear on the other — "I'm out of here."
          const W2 = W() / 2;
          const leftOff = -(R + 36);
          const rightOff = W() + R + 36;
          fleeX =
            curE < 0.5
              ? W2 + (leftOff - W2) * (curE / 0.5) // centre → off the left edge
              : rightOff + (W2 - rightOff) * ((curE - 0.5) / 0.5); // off the right → centre
          tg.lookX = -0.6 * curEnv;
        } else if (action === "hide") {
          // "This light again?" — edges away and puts up an umbrella against it.
          tg.offX = -16 * curEnv;
          tg.lookX = 0.45 * curEnv;
        } else if (action === "sated") {
          // Too full to eat — leans away from the cupcake it won't touch.
          tg.offX = -6 * curEnv;
        } else if (action === "habituate") {
          // Unbothered — barely a twitch, half-lidded "yeah, yeah".
          tg.offX = 3 * Math.sin(6 * Math.PI * curE) * curEnv;
          tg.blink = 0.45 * curEnv;
        } else if (action === "ignore") {
          tg.offX = 3 * Math.sin(5 * Math.PI * curE) * curEnv;
        }
      }

      // While cupcakes pile on the floor, Astro keeps fretting about the mess.
      if (floorCupcakes.length > 0) {
        const worry = Math.min(1, floorCupcakes.length / 4);
        tg.distress = Math.max(tg.distress, worry);
        tg.lookX = 0.5 * worry;
        tg.lookY = 0.28 * worry;
      }

      // Idle blinking.
      blinkTimer += p.deltaTime / 1000;
      if (blinkTimer > nextBlink) {
        blinkTimer = 0;
        nextBlink = 2.4 + Math.random() * 3.2;
      }
      const idleBlink = blinkTimer < 0.12 ? Math.sin((blinkTimer / 0.12) * Math.PI) : 0;
      tg.blink = Math.max(tg.blink, idleBlink * 0.9);

      // Ease every channel toward its target — this is what kills the snap.
      const k = 0.2;
      for (const key of EXPR_KEYS) st[key] += (tg[key] - st[key]) * k;

      // Gentle idle life.
      const breathe = 1 + 0.035 * Math.sin(t * 1.8);
      const bob = 5 * Math.sin(t * 1.1);
      const driftX = 6 * Math.sin(t * 0.6);
      const lean = 0.05 * Math.sin(t * 0.9);

      const midX = W() / 2;
      const midY = H() / 2;
      const cx = fleeX !== null ? fleeX : midX + st.offX + driftX;
      const cy = midY + st.offY + bob;

      // Spotlight glow sits to the right (retreat eases away; hide shields against it).
      if (action === "retreat" || action === "hide") {
        drawSpotlight(midX + 96, midY - 12, curEnv);
      }

      p.push();
      p.translate(cx, cy);
      p.scale((1 - st.squash * 0.45) * breathe, (1 + st.squash * 0.45) * breathe);

      // Cilia (behind the body), gently waving.
      p.stroke(C.cilia[0], C.cilia[1], C.cilia[2], 150);
      p.strokeWeight(3.2);
      p.strokeCap(p.ROUND);
      const NC = 14;
      for (let c = 0; c < NC; c++) {
        const a = (p.TWO_PI * c) / NC + lean;
        const wob = 1 + 0.05 * Math.sin(a * 2 + t * 0.8) + 0.04 * Math.sin(a * 3 - t * 0.6);
        const r1 = R * wob;
        const len = 10 + 4 * Math.sin(t * 2.2 + c * 1.3);
        p.line(Math.cos(a) * r1, Math.sin(a) * r1, Math.cos(a) * (r1 + len), Math.sin(a) * (r1 + len));
      }
      p.noStroke();

      // Body — a smooth low-lobe blob via a closed Catmull-Rom curve.
      const n = 16;
      const pts: Array<[number, number]> = [];
      for (let i = 0; i < n; i++) {
        const a = (p.TWO_PI * i) / n + lean;
        const wob = 1 + 0.06 * Math.sin(a * 2 + t * 0.8) + 0.05 * Math.sin(a * 3 - t * 0.6);
        pts.push([Math.cos(a) * R * wob, Math.sin(a) * R * wob]);
      }
      p.fill(C.body[0], C.body[1], C.body[2]);
      p.beginShape();
      p.curveVertex(pts[n - 1]![0], pts[n - 1]![1]);
      for (let i = 0; i < n; i++) p.curveVertex(pts[i]![0], pts[i]![1]);
      p.curveVertex(pts[0]![0], pts[0]![1]);
      p.curveVertex(pts[1]![0], pts[1]![1]);
      p.endShape();

      // Soft highlight + a couple of drifting organelles (read as little cheeks).
      p.fill(C.hi[0], C.hi[1], C.hi[2], 150);
      p.ellipse(-18, -20, 46, 32);
      p.fill(C.organ[0], C.organ[1], C.organ[2], 150);
      p.circle(20 + 6 * Math.sin(t * 0.7), 24 + 5 * Math.cos(t * 0.9), 13);
      p.circle(-26 + 5 * Math.cos(t * 0.6), 16 + 4 * Math.sin(t * 0.8), 9);

      drawFace(C);
      p.pop();

      // Props in front, in screen space (no squash distortion). They fade via size.
      if (action === "recoil") {
        const flick = 1 + 0.14 * Math.sin(t * 26);
        drawProp("🔥", midX + 90 + 3 * Math.sin(t * 18), midY + 2, 46 * curEnv * flick);
      } else if (action === "ingest") {
        const bite = Math.max(0, 1 - curE * 0.9);
        const popIn = Math.min(1, curE * 6);
        drawProp("🧁", midX + 74, midY + 8, 42 * bite * popIn);
      } else if (action === "flee") {
        // A dust puff at the spot it bolted from (fades fast as it leaves).
        drawProp("💨", midX, midY + 8, 32 * Math.max(0, 1 - curE * 2.4));
      } else if (action === "hide") {
        // An umbrella held up between Astro and the glare on the right.
        drawProp("☂️", midX + 46, midY - 10, 44 * curEnv, 0.35);
      }

      // Floor cupcakes pile up on the right and fade after a few seconds.
      const now = p.millis();
      for (let i = floorCupcakes.length - 1; i >= 0; i--) {
        const c = floorCupcakes[i]!;
        const age = now - c.born;
        if (age > CUPCAKE_LIFE) {
          floorCupcakes.splice(i, 1);
          continue;
        }
        const dropIn = Math.min(1, age / 260);
        const drop = (1 - dropIn) * (1 - dropIn); // ease-out fall onto the floor
        const fade = age > CUPCAKE_LIFE - 600 ? Math.max(0, (CUPCAKE_LIFE - age) / 600) : 1;
        drawProp("🧁", c.x, c.y - 36 * drop, 28 * fade, c.rot);
      }

      // Retire a finished action only after everything has rendered this frame.
      if (action && curE >= 1) action = null;
    } catch (err) {
      if (!loggedErr) {
        loggedErr = true;
        console.error("Astro draw error:", err);
      }
    }
  };
}
