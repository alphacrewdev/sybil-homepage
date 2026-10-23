// Illustrative anterior whole-body bone scan (Tc-99m MDP), built from code.
//
// This is NOT patient data and must always be labelled as an illustrative
// reconstruction. It is built the way a planar image actually forms, so the
// same model can drive the "counts accumulate" scene later:
//   1. an expected-activity map (soft tissue + skeleton + renal/bladder),
//   2. blurred by the system's spatial resolution,
//   3. sampled as Poisson counts at a realistic whole-body count total,
//   4. displayed the conventional way: inverted greyscale, high counts dark.
//
// Geometry is in centimetres on a 64 × 192 cm field, viewed from the front:
// the patient's right is on the viewer's left (+x is the patient's left).
// Every number below is a stylised average adult, not a measured person.

export const FIELD_CM = { w: 64, h: 192 };
export const PX_PER_CM = 4; // 2.5 mm pixels, a typical whole-body matrix pitch

// Relative uptake per unit area. Ratios are illustrative; bladder is meant
// to saturate the display, as it does clinically.
const U = {
  soft: 0.42,
  kidney: 1.5,
  bladder: 30,
  skull: 4.4,
  face: 2.6,
  spineC: 4.2,
  spineT: 4,
  spineL: 6,
  sternum: 3,
  rib: 2.1,
  ribPost: 1.4,
  clavicle: 3.6,
  scapula: 1.5,
  shaft: 2.7,
  joint: 4.6,
  pelvis: 3.6,
  pelvisRim: 4.8,
  si: 6.5,
};

// Right half of the body outline (patient's left, +x), head top to crotch.
// Mirrored for the other side. Shared with the 3D patient volume.
export const OUTLINE_HALF: [number, number][] = (() => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 10; i++) {
    const a = -Math.PI / 2 + (i / 10) * (Math.PI / 2 + 0.95);
    pts.push([Math.cos(a) * 8, 19 + Math.sin(a) * 11]);
  }
  pts.push(
    [5.6, 31], [5.8, 36], [11, 39], [17, 40.6], [20.6, 43.6],
    [22, 52], [22.8, 62], [23.4, 73], [24.4, 85], [25, 98],
    [26, 106], [25.2, 115.5], [23.6, 118], [21.9, 112.5], [21.5, 100],
    [20.4, 86], [19.3, 74], [18.3, 62], [16.9, 50.5],
    [16.2, 58], [15, 68], [14.2, 76], [16.4, 86], [17.4, 93],
    [16.8, 105], [14.6, 120], [12.3, 133], [12, 145], [10.6, 160],
    [9.1, 175], [10.2, 181], [8.6, 184.2], [5.2, 184.2], [4.6, 178],
    [4.8, 172], [4.2, 158], [3.6, 145], [3.6, 133], [2.7, 115],
    [0.9, 101], [0, 100.6],
  );
  return pts;
})();

export function outlinePath(): [number, number][] {
  const right = OUTLINE_HALF;
  const left = right.slice(1, -1).reverse().map(([x, y]) => [-x, y] as [number, number]);
  return [...right, ...left];
}

// Small seeded PRNG so the "random" counts are identical on every load and
// in every render of the poster frames.
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function poisson(lambda: number, rnd: () => number) {
  if (lambda <= 0) return 0;
  if (lambda > 40) {
    // Normal approximation; exact enough at these means and much faster.
    const u = Math.max(1e-12, rnd());
    const v = rnd();
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * z));
  }
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= rnd();
  } while (p > L);
  return k - 1;
}

function blur(src: Float32Array, w: number, h: number, sigmaPx: number) {
  const r = Math.ceil(sigmaPx * 3);
  const k: number[] = [];
  let sum = 0;
  for (let i = -r; i <= r; i++) {
    const v = Math.exp(-(i * i) / (2 * sigmaPx * sigmaPx));
    k.push(v);
    sum += v;
  }
  for (let i = 0; i < k.length; i++) k[i] /= sum;
  const tmp = new Float32Array(src.length);
  const out = new Float32Array(src.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let i = -r; i <= r; i++) {
        const xx = Math.min(w - 1, Math.max(0, x + i));
        acc += src[y * w + xx] * k[i + r];
      }
      tmp[y * w + x] = acc;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let i = -r; i <= r; i++) {
        const yy = Math.min(h - 1, Math.max(0, y + i));
        acc += tmp[yy * w + x] * k[i + r];
      }
      out[y * w + x] = acc;
    }
  }
  return out;
}

type Ctx = CanvasRenderingContext2D;

// Drawing helpers. The canvas is in cm (scaled), and every shape is added
// with "lighter" compositing, so overlapping structures sum like activity.
function level(ctx: Ctx, v: number) {
  // Encode uptake in the red channel; 255 == 10 units. Bladder is added
  // separately because it would clip here.
  const c = Math.min(255, Math.round((v / 10) * 255));
  ctx.fillStyle = `rgb(${c},0,0)`;
  ctx.strokeStyle = `rgb(${c},0,0)`;
}

function ellipse(ctx: Ctx, x: number, y: number, rx: number, ry: number, v: number, rot = 0) {
  level(ctx, v);
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
  ctx.fill();
}

function bone(ctx: Ctx, pts: [number, number][], width: number, v: number) {
  level(ctx, v);
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
}

function bilateral(fn: (s: 1 | -1) => void) {
  fn(1);
  fn(-1);
}

function drawSkeleton(ctx: Ctx) {
  // Skull: calvarium reads as a ring, face and mandible slightly lower.
  ctx.save();
  level(ctx, U.skull);
  ctx.lineWidth = 2.1;
  ctx.beginPath();
  ctx.ellipse(0, 18, 7, 8.8, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  ellipse(ctx, 0, 21.5, 4.6, 4.4, 1.6);
  bone(ctx, [[-5.2, 24.5], [-4.4, 28.6], [0, 30], [4.4, 28.6], [5.2, 24.5]], 1.3, U.face);
  ellipse(ctx, 0, 23.5, 1.6, 2, 2.2); // nasal / maxillary region

  // Spine. Vertebral bodies as discrete blobs so the column has texture.
  bone(ctx, [[0, 31], [0, 82]], 1.6, 1.4);
  for (let i = 0; i < 7; i++) ellipse(ctx, 0, 31.5 + i * 1.25, 1.2, 0.5, U.spineC - 1.4);
  for (let i = 0; i < 12; i++) ellipse(ctx, 0, 40.5 + i * 2.3, 1.45 + i * 0.04, 1.25, U.spineT - 1.4);
  for (let i = 0; i < 5; i++) ellipse(ctx, 0, 69.4 + i * 3.05, 2.1, 1.75, U.spineL - 1.4);

  // Sternum: manubrium, body, xiphoid.
  ellipse(ctx, 0, 44.2, 2.1, 1.7, U.sternum);
  bone(ctx, [[0, 46], [0, 59]], 2.1, U.sternum * 0.85);
  ellipse(ctx, 0, 47, 1.2, 0.8, 1.6); // sternomanubrial joint

  bilateral((s) => {
    // Clavicle, gently S-shaped, ending at the acromion.
    bone(ctx, [[s * 1.8, 42.2], [s * 7, 41.1], [s * 12.5, 41.6], [s * 16.6, 40.9]], 1.2, U.clavicle);
    // Scapula seen through the chest, faint.
    level(ctx, U.scapula);
    ctx.beginPath();
    ctx.moveTo(s * 16.5, 43);
    ctx.lineTo(s * 9.2, 45);
    ctx.lineTo(s * 12.6, 59);
    ctx.closePath();
    ctx.fill();
    // Posterior ribs show through faintly, flatter than the anterior arcs.
    for (let i = 0; i < 11; i++) {
      const y0 = 41.5 + i * 2.45;
      bone(ctx, [[s * 1.8, y0], [s * 7.5, y0 - 0.3 + i * 0.05], [s * (12.5 + Math.min(i, 5) * 0.4), y0 + 1.6]], 0.75, U.ribPost);
    }
    // Ribs: anterior arcs fanning down and out from the spine.
    for (let i = 0; i < 10; i++) {
      const y0 = 42 + i * 2.55;
      const reach = 8.5 + Math.min(i, 6) * 1.05 - Math.max(0, i - 7) * 0.8;
      bone(
        ctx,
        [
          [s * 1.6, y0],
          [s * (reach * 0.55), y0 - 0.6],
          [s * reach, y0 + 1.6 + i * 0.12],
          [s * (reach * 0.82), y0 + 5.2 + i * 0.25],
          [s * (2.6 + i * 0.25), y0 + 7.4 + i * 0.32],
        ],
        0.7,
        U.rib,
      );
    }
    // Shoulder, arm, elbow, forearm, wrist, hand.
    ellipse(ctx, s * 17.3, 42.3, 2.2, 2.2, U.joint * 0.9);
    ellipse(ctx, s * 18.8, 44.6, 2, 1.5, U.joint * 0.6);
    bone(ctx, [[s * 19, 45], [s * 20, 58], [s * 21, 71.5]], 2, U.shaft);
    ellipse(ctx, s * 21.3, 73, 2.1, 1.5, U.joint * 0.85);
    bone(ctx, [[s * 20.8, 74.5], [s * 21.6, 86], [s * 22.2, 97]], 1.2, U.shaft * 0.9);
    bone(ctx, [[s * 22.3, 74.5], [s * 23.3, 86], [s * 23.9, 97]], 1.2, U.shaft * 0.9);
    ellipse(ctx, s * 23.1, 99.5, 2, 1.6, U.joint);
    for (let f = 0; f < 4; f++) {
      bone(ctx, [[s * (22.2 + f * 0.65), 102], [s * (22.4 + f * 0.6), 109 + f * 0.4], [s * (22.6 + f * 0.55), 114.5 - Math.abs(f - 1.5) * 0.9]], 0.55, U.shaft * 0.95);
    }
    bone(ctx, [[s * 21.6, 101.5], [s * 21.1, 106]], 0.6, U.shaft);

    // Kidneys sit behind; on an anterior view they are faint.
    ellipse(ctx, s * 5.8, 66, 2.6, 5, U.kidney, s * 0.18);

    // Pelvis: iliac wings, SI joints, acetabula, pubic rami.
    level(ctx, U.pelvis);
    ctx.beginPath();
    ctx.moveTo(s * 3.6, 81);
    ctx.quadraticCurveTo(s * 9, 75.5, s * 14.2, 79);
    ctx.quadraticCurveTo(s * 14.6, 86, s * 11, 90.5);
    ctx.quadraticCurveTo(s * 7, 88.5, s * 4.2, 90);
    ctx.closePath();
    ctx.fill();
    bone(ctx, [[s * 3.8, 80.6], [s * 9, 76.6], [s * 13.8, 79.4], [s * 13.6, 85]], 0.9, U.pelvisRim - U.pelvis);
    ellipse(ctx, s * 4.3, 85.5, 1.1, 3.6, U.si, s * -0.25);
    ellipse(ctx, s * 9.2, 92.6, 2.5, 2.4, U.joint * 0.8);
    bone(ctx, [[s * 8.2, 95], [s * 4.6, 97.5], [s * 1.2, 98.2]], 1.4, U.pelvis * 0.85);
    bone(ctx, [[s * 9.4, 96.2], [s * 7, 100.2], [s * 1.4, 99.6]], 1.1, U.pelvis * 0.75);

    // Femur, knee, tibia/fibula, ankle, foot.
    ellipse(ctx, s * 13.7, 94, 1.9, 2.3, U.joint * 0.75);
    bone(ctx, [[s * 10.6, 94.4], [s * 12.2, 96.5]], 1.6, U.shaft * 1.2);
    bone(ctx, [[s * 12.5, 97], [s * 10.6, 115], [s * 8.6, 129.5]], 2.7, U.shaft);
    ellipse(ctx, s * 8.4, 132.8, 3.3, 2.6, U.joint * 0.9);
    ellipse(ctx, s * 8.3, 131.8, 1.4, 1.5, U.joint * 0.6); // patella
    bone(ctx, [[s * 7.7, 136], [s * 7.2, 155], [s * 6.9, 173]], 2.3, U.shaft);
    bone(ctx, [[s * 10.3, 136.5], [s * 9.6, 155], [s * 8.7, 172.5]], 0.9, U.shaft * 0.7);
    ellipse(ctx, s * 7.4, 175.3, 2.6, 1.6, U.joint * 0.95);
    ellipse(ctx, s * 7.4, 180.4, 2.8, 3.2, U.joint * 0.62);
  });

  // Sacrum and pubic symphysis.
  level(ctx, U.pelvis * 0.9);
  ctx.beginPath();
  ctx.moveTo(-3.6, 82.5);
  ctx.lineTo(3.6, 82.5);
  ctx.lineTo(1.2, 95.5);
  ctx.lineTo(-1.2, 95.5);
  ctx.closePath();
  ctx.fill();
  ellipse(ctx, 0, 99.1, 1.2, 1.5, U.joint * 0.7);
}

export type BoneScan = {
  w: number;
  h: number;
  /** Expected counts per pixel after resolution blur (noise-free). */
  expected: Float32Array;
  /** The activity itself, lightly smoothed: where the tracer is (same scale). */
  activity: Float32Array;
  /** One Poisson realisation of `expected`. */
  counts: Uint16Array;
  /** Display window ceiling (counts), bladder deliberately saturates. */
  windowMax: number;
  /** Mask of the body outline (0..1), for the 3D volume and soft-tissue glow. */
  body: Float32Array;
  totalCounts: number;
};

/**
 * Builds the activity map and one count realisation. `totalCounts` defaults
 * to 1.6 million, typical of an anterior whole-body bone image.
 */
export function buildBoneScan(totalCounts = 1.6e6, seed = 11): BoneScan {
  const w = FIELD_CM.w * PX_PER_CM;
  const h = FIELD_CM.h * PX_PER_CM;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.setTransform(PX_PER_CM, 0, 0, PX_PER_CM, (w / 2), 0);
  ctx.globalCompositeOperation = "lighter";

  // Body mask first (full value), read back, then cleared: soft tissue is
  // added numerically below with a softer edge, since tissue thins at the
  // body margin rather than stopping at a line.
  const outline = outlinePath();
  level(ctx, 10);
  ctx.beginPath();
  outline.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fill();
  const bodyData = ctx.getImageData(0, 0, w, h).data;
  const body = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) body[i] = bodyData[i * 4] > 0 ? 1 : 0;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  drawSkeleton(ctx);

  const data = ctx.getImageData(0, 0, w, h).data;
  const soft = blur(body, w, h, 2.2 * PX_PER_CM);
  // Smooth multiplicative variation (±~15%) so bone uptake isn't uniform
  // like a vector drawing. Value noise, seeded.
  const vr = mulberry32(5);
  const gw = 17;
  const gh = 49;
  const grid = Array.from({ length: gw * gh }, () => 0.85 + vr() * 0.3);
  const act = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const gx = (x / w) * (gw - 1);
      const gy = (y / h) * (gh - 1);
      const x0 = Math.floor(gx);
      const y0 = Math.floor(gy);
      const fx = gx - x0;
      const fy = gy - y0;
      const g = (a: number, b: number) => grid[Math.min(gh - 1, b) * gw + Math.min(gw - 1, a)];
      const v = (g(x0, y0) * (1 - fx) + g(x0 + 1, y0) * fx) * (1 - fy) + (g(x0, y0 + 1) * (1 - fx) + g(x0 + 1, y0 + 1) * fx) * fy;
      const i = y * w + x;
      act[i] = (data[i * 4] / 255) * 10 * v + soft[i] * body[i] * U.soft + soft[i] * 0.06;
    }
  }

  // Bladder, added numerically so it can exceed the canvas range.
  const bx = w / 2;
  const by = 95.2 * PX_PER_CM;
  const brx = 3.9 * PX_PER_CM;
  const bry = 3.1 * PX_PER_CM;
  for (let y = Math.floor(by - bry); y <= by + bry; y++) {
    for (let x = Math.floor(bx - brx); x <= bx + brx; x++) {
      const d = ((x - bx) / brx) ** 2 + ((y - by) / bry) ** 2;
      if (d <= 1) act[y * w + x] += U.bladder * (1 - d * 0.25);
    }
  }

  // System resolution: ~9 mm FWHM at a typical depth (sigma ≈ 3.8 mm).
  const expectedShape = blur(act, w, h, 3.8 / 2.5);
  let sum = 0;
  for (let i = 0; i < expectedShape.length; i++) sum += expectedShape[i];
  const scale = totalCounts / sum;
  const expected = new Float32Array(expectedShape.length);
  for (let i = 0; i < expected.length; i++) expected[i] = expectedShape[i] * scale;
  const activity = blur(act, w, h, 0.8);
  for (let i = 0; i < activity.length; i++) activity[i] *= scale;

  const rnd = mulberry32(seed);
  const counts = new Uint16Array(expected.length);
  let total = 0;
  for (let i = 0; i < expected.length; i++) {
    counts[i] = poisson(expected[i], rnd);
    total += counts[i];
  }

  // Window: a high percentile of in-body pixels, excluding the bladder.
  const vals: number[] = [];
  for (let i = 0; i < expected.length; i++) {
    const y = Math.floor(i / w);
    if (body[i] && Math.abs(y - by) > bry * 1.6) vals.push(expected[i]);
  }
  vals.sort((a, b) => a - b);
  const windowMax = vals[Math.floor(vals.length * 0.985)];

  return { w, h, expected, activity, counts, windowMax, body, totalCounts: total };
}

/**
 * Paints counts in the conventional display: white background, high counts
 * dark. `fraction` (0..1) shows a partial acquisition by thinning counts,
 * which is statistically what stopping an acquisition early looks like.
 */
export function paintBoneScan(
  scan: BoneScan,
  target: HTMLCanvasElement,
  opts: { fraction?: number; gamma?: number; paper?: [number, number, number]; ink?: [number, number, number] } = {},
) {
  const { w, h, counts, windowMax } = scan;
  const fraction = opts.fraction ?? 1;
  const gamma = opts.gamma ?? 0.78;
  const paper = opts.paper ?? [246, 248, 249];
  const ink = opts.ink ?? [6, 14, 26];
  target.width = w;
  target.height = h;
  const ctx = target.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const rnd = mulberry32(97);
  const max = windowMax * fraction;
  for (let i = 0; i < w * h; i++) {
    let c = counts[i];
    if (fraction < 1) {
      let kept = 0;
      for (let k = 0; k < c; k++) if (rnd() < fraction) kept++;
      c = kept;
    }
    const t = Math.pow(Math.min(1, c / Math.max(1, max)), gamma);
    img.data[i * 4] = paper[0] + (ink[0] - paper[0]) * t;
    img.data[i * 4 + 1] = paper[1] + (ink[1] - paper[1]) * t;
    img.data[i * 4 + 2] = paper[2] + (ink[2] - paper[2]) * t;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return target;
}
