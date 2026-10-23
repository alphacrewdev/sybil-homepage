// Scene configuration for "Behind the image": dimensions, layer positions,
// camera shots and the scroll timeline. Geometry lives in scene.ts and the
// runtime in index.ts; tune the experience here.
//
// Units: 1 unit = 10 cm. The patient lies along z (head toward -z), x runs
// across the body (+x is the patient's left), y is up. A single detector
// head sits above the patient for an anterior view.

import { FIELD_CM } from "./bonescan";

export const UNIT_CM = 10;

/** The whole-body image, lying flat above the patient at 1:1 scale. */
export const IMAGE = {
  w: FIELD_CM.w / UNIT_CM, // 6.4
  h: FIELD_CM.h / UNIT_CM, // 19.2
  y: 3.45,
};

/** Image-space cm (from the top of the field) to world z. */
export const cmToZ = (cm: number) => (cm - FIELD_CM.h / 2) / UNIT_CM;

/**
 * Detector field of view. A large-field camera is roughly 54 × 40 cm; the
 * long side runs across the patient. Positioned over the chest and upper
 * abdomen: a whole-body image is built by moving the table through it.
 */
export const FOV = {
  w: 5.4,
  d: 4.0,
  z: cmToZ(64),
};

/**
 * Layer heights in the exploded view (y of each layer's centre). Real
 * spacing is millimetres to a few centimetres; the explode is for clarity.
 * `compact` is where the layers sit before the explode, tucked under the
 * image.
 */
export const LAYERS = {
  pmt: { y: 2.5, compact: 3.0, height: 0.78, radius: 0.31, pitch: 0.7 },
  guide: { y: 1.78, compact: 2.98, thickness: 0.1 },
  crystal: { y: 1.48, compact: 2.96, thickness: 0.14 },
  collimator: { y: 0.72, compact: 2.92, height: 0.36, pitch: 0.2 },
  patient: { y: -1.45, thickness: 1.9 },
  table: { y: -2.62 },
};

export type Shot = {
  pos: [number, number, number];
  target: [number, number, number];
  up: [number, number, number];
  fov: number;
};

/**
 * Camera shots. A looks straight down at the image (head at the top of the
 * frame, as it is read). A2 closes in on the region one detector position
 * covers. B drops to the patient's side so the vertical path from tracer to
 * image reads as one stack.
 */
export const SHOTS: Record<"A" | "A2" | "B", Shot> = {
  A: { pos: [0, IMAGE.y + 33, 0.1], target: [0, IMAGE.y, 0.1], up: [0, 0, -1], fov: 38 },
  A2: { pos: [0, IMAGE.y + 13.5, FOV.z + 0.2], target: [0, IMAGE.y, FOV.z + 0.2], up: [0, 0, -1], fov: 38 },
  B: { pos: [10, 5.6, FOV.z + 9.4], target: [0, 0.85, FOV.z + 0.4], up: [0, 1, 0], fov: 36 },
};

/**
 * Scroll timeline, as fractions of the section's scroll length. Copy beats
 * and scene phases share these numbers so text and picture stay in step.
 */
export const TIMELINE = {
  /** Intro copy over the full image. */
  intro: [0, 0.2] as const,
  /** Push in to the detector's field of view; image question. */
  pushIn: [0.16, 0.42] as const,
  /** Tilt to the side while the detector layers separate. */
  reveal: [0.44, 0.82] as const,
  /** Hold on the mechanism with labels. */
  hold: [0.82, 1] as const,
};

/** Sybil brand ramp plus scene-only colours. */
export const COLORS = {
  bg: 0x03142b,
  fog: 0x03142b,
  navy: 0x022b62,
  teal: 0x027682,
  tealLight: 0x3fb3c2,
  tealPale: 0x7fd3dc,
  // Stylistic: gamma rays are invisible. Amber is the site's highlight
  // colour and keeps tracer activity distinct from the teal UI.
  tracer: 0xe8a944,
  // NaI(Tl) emission peaks near 415 nm, so the scintillation light is blue.
  scint: 0x6f8cff,
};
