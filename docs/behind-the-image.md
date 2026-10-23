# Behind the image: storyboard, science notes and asset plan

Status (2026-10-23): **review build, scenes A and B only.** Scenes C to E are
planned below and not built yet. Nothing here has been reviewed by Karen or
another subject-matter expert.

Replaces the homepage "How Sybil teaches" scroll section
(`src/components/ScanSequence.astro`, kept in the repo, unused, until this is
approved).

## 1. Choice of modality

**Nuclear medicine, planar gamma camera imaging, shown with an anterior
whole-body bone scan (Tc-99m MDP).**

Why:

- The section already points to Nuclear Medicine Physics, and the course has
  four consecutive modules on exactly this chain: Module 15 Scintillation
  Detectors, Module 16 The Gamma Camera, Module 17 The Photomultiplier Tube
  Array, Module 18 The Collimator (from `src/content/courses.ts`).
- The mechanism is spatial and sequential (source, collimation, detection,
  positioning, counting), which is what animation is good at.
- It has a natural cause-and-effect beat: one detected photon adds one count
  to one pixel, and the image is the accumulation of very many of them.
- No other modality has stronger approved media in the repo. There are no
  approved teaching images or lesson clips anywhere in the repo; the course
  card images are stock photos, and the sample lesson embed has not been
  supplied (`sample.videoUrl` is empty).
- It does not repeat the hero, which cycles four modalities as finished
  images; this section goes inside one machine.

The modality-specific CTA ("View Nuclear Medicine") is unchanged.

## 2. The mechanism being illustrated

Anterior planar acquisition with a parallel-hole collimator:

1. **Source.** Tc-99m MDP adsorbs to bone mineral, more where bone turnover
   and blood flow are higher; unbound tracer is cleared by the kidneys into
   the bladder. Tc-99m decays by isomeric transition, emitting a 140 keV gamma
   ray (half-life about 6 h). Emission is isotropic.
2. **Collimation.** Lead septa absorb photons that are not travelling nearly
   parallel to the holes. Only a very small fraction of emitted photons
   (order of 1 in 10,000) pass. This is what gives the image its spatial
   meaning: a count at a point maps to activity along the line below it.
3. **Detection.** A photon that passes is absorbed in a NaI(Tl) crystal
   (typically about 9.5 mm thick; most 140 keV photons are stopped). The
   absorbed energy produces a brief flash of scintillation light (peak near
   415 nm, so blue).
4. **Light sharing and conversion.** The light spreads through the crystal
   and light guide and reaches several photomultiplier tubes. Each PMT's
   photocathode converts light to electrons, and the dynode chain multiplies
   them into an electrical pulse. Tubes nearer the flash give larger signals.
5. **Positioning and energy.** The event position is estimated from the
   relative PMT signals (Anger logic, a weighted centroid; modern systems
   digitise each tube and apply energy, linearity and uniformity
   corrections). The summed signal is proportional to the energy deposited;
   events outside an energy window around 140 keV (commonly 15 to 20%) are
   rejected, which removes many, but not all, photons that scattered in the
   patient.
6. **Counting.** Each accepted event adds one count to the pixel at its
   position. The image is a map of counts. A whole-body bone image has on the
   order of a million or more counts; a camera head covers roughly 54 x 40 cm,
   so the whole body is acquired by moving the table through the field.

Sources (standard references; I could not open them from the build
environment, so numbers need checking against them):

- Cherry, Sorenson, Phelps. *Physics in Nuclear Medicine*, 4th ed., 2012,
  chapters on scintillation detectors and the gamma camera.
- Bushberg, Seibert, Leidholdt, Boone. *The Essential Physics of Medical
  Imaging*, nuclear imaging chapters (gamma camera, collimators).
- IAEA. *Nuclear Medicine Physics: A Handbook for Teachers and Students*,
  2014, gamma camera chapter.
- SNMMI and EANM procedure guidelines for bone scintigraphy (tracer
  behaviour, imaging time, typical counts).
- Sybil Nuclear Medicine Physics, Modules 15 to 18 (titles verified from the
  course listing; lesson content not reviewed).

## 3. Simplifications, and what is style vs physics

| Shown | Real | Kind |
|---|---|---|
| Layers separated by tens of centimetres | Stacked within a few cm in one shielded head | Simplification, labelled on screen |
| Collimator holes about 2 cm across, a few hundred | About 1 to 2 mm, tens of thousands | Simplification (scale) |
| Crystal drawn about 14 mm thick | About 9.5 mm typical | Simplification (scale) |
| About 40 PMTs, each about 6 cm | Typically 37 to 100 or so, 5 to 7.5 cm | Close |
| Detector over chest and abdomen only | Correct for one table position | Physics; caption says so |
| Rest of whole-body image fades out when the stack appears | It is built from other table positions | Physics, explained in caption (scene C) |
| Tracer glows amber | Gamma rays are invisible | Style |
| Gentle pulse in the tracer glow | Decay is flat on this time scale | Style; code comment says so |
| Scintillation light blue | NaI(Tl) emission peak about 415 nm | Physics (colour approximates) |
| Image as inverted greyscale (dark = more counts) | Common clinical display | Physics/convention |
| Illustrative bone scan | Built from a modelled activity map, blurred by about 9 mm FWHM, then Poisson counts at 1.6 million | Illustration, labelled "not patient data" |
| Patient as a translucent outline | No anatomy beyond skeleton uptake | Style |

The synthetic image (`src/scripts/behind-image/bonescan.ts`) is not a
clinical image. Uptake ratios, bone shapes and the bladder are illustrative,
and it is always labelled "Illustrative reconstruction, not patient data".

## 4. Items for Karen's review

Mark each as approved, change, or remove.

1. The choice of a bone scan as the opening image, and whether the synthetic
   image is acceptable as illustration or should be replaced by an authorized
   de-identified image or a phantom image.
2. Anatomy and uptake in the synthetic image (anterior view, patient's right
   on the viewer's left, bladder saturated, faint kidneys, rib and spine
   appearance).
3. Caption: "A bone scan records where a tracer collected in the skeleton."
4. Caption: "Gamma rays from the tracer pass a collimator, light up a
   crystal, and are located by photomultiplier tubes."
5. Labels: Image matrix, Photomultiplier tubes, NaI(Tl) crystal, Collimator,
   Tracer in the patient. (The light guide is drawn but not labelled.)
6. The order and roles of the stages in section 2, and the numbers: 140 keV,
   6 h, 1 in 10,000, 9.5 mm, 415 nm, 15 to 20% window, about a million
   counts, 54 x 40 cm.
7. Planned scene C and D content below, especially the scattered-photon case
   (some small-angle scatter is accepted by the window; the animation must
   not suggest the window removes all scatter).
8. Whether to show Anger logic as a centroid, or simply "the PMT signals
   locate the flash" given modern digital positioning.

No expert approval has been given yet.

## 5. Storyboard

Scroll-driven, one canvas, one coordinated scene. Timings are fractions of
the section's scroll length (`TIMELINE` in `config.ts`).

**Scene A, the image (built).** Camera looks straight down at the
illustrative whole-body bone scan, lit like a display, framed by Sybil's
corner brackets. Copy: label, headline, intro. Then "The image" caption and
the question "What produced what we see here?" The camera pushes in and a
teal frame marks one detector position over the chest and abdomen; the rest
of the image dims.

**Transition A to B (built).** The camera tilts down to the patient's side.
Outside the detector's field the image lifts away; the remaining tile
becomes the image matrix. Beneath it the detector separates into its layers
(PMT array, light guide, crystal, collimator), and below them the patient
appears, with tracer in the skeleton directly under the matching part of the
image. The camera movement shows the vertical relationship: what is in the
image is directly above where it came from.

**Scene B, the mechanism (built).** Hold on the exploded stack with five
labels and "Simplified: layers separated and scaled for clarity."

**Scene C, cause and effect (planned).** Follow one photon from a lumbar
vertebra: it travels up (slowed enormously), passes one collimator hole,
stops in the crystal, makes a blue flash that spreads to the nearest PMTs
(tubes glow in proportion), a crosshair marks the computed position on the
matrix, and one pixel gains one count. Then events speed up: the tile fills
with counts (1 thousand, 10 thousand, 100 thousand, about 1 million, with a
counter), noisy at first and clearer as counts accumulate. The noise is
genuine Poisson thinning of the same model, not a filter. Caption: one event
adds one count; the image is many events.

**Scene D, explore (planned).** One interaction: "Follow a photon", three
buttons that replay the annotated event with a different, correctly modelled
outcome:

- Along a hole: passes, absorbed, flash, located, counted.
- At an angle: absorbed by a lead septum, never reaches the crystal, not
  counted. (Why the collimator gives position, and why so few photons count.)
- Scattered in the body: changes direction and loses energy, reaches the
  crystal, flash is dimmer, energy falls outside the window, rejected. Note
  on screen that some scattered photons are still accepted.

Accessible buttons, a live text description of each outcome, replay
available, no slider.

**Scene E, back to the teaching (planned).** Camera rises back to the
top-down view, the tile rejoins the whole-body image. Closing line and CTA:
"Explore the ideas behind image formation, one explanation at a time." with
"View Nuclear Medicine" (opens the existing course modal). A line naming the
four modules (Scintillation Detectors, The Gamma Camera, The Photomultiplier
Tube Array, The Collimator) as verified module titles. No sample-lesson link
until a real lesson embed exists.

## 6. Copy (draft)

- Label: Behind the image
- Headline: See the physics that makes the image possible.
- Intro: Follow a nuclear medicine image back through the gamma camera that
  recorded it, one step at a time.
- A: A bone scan records where a tracer collected in the skeleton. / What
  produced what we see here?
- B: Gamma rays from the tracer pass a collimator, light up a crystal, and
  are located by photomultiplier tubes.
- C (planned): Each detected gamma ray adds one count. The image is built
  from many of them.
- D (planned): Follow a photon. Not every gamma ray becomes a count.
- E (planned): Explore the ideas behind image formation, one explanation at
  a time. CTA: View Nuclear Medicine.

No claims about exam results, outcomes or what every lesson contains.

## 7. Art direction and assets

Palette: Sybil navy to teal ramp (`global.css`), ink-950 background, teal-300
and teal-200 for UI and labels, amber (the site's existing highlight colour)
for tracer, blue for scintillation light. Type: Archivo display, IBM Plex
Sans body, IBM Plex Mono for tags and labels, as elsewhere on the site. The
corner-bracket device frames the image, as on the hero.

| Asset | Status | Source |
|---|---|---|
| Sybil logo, palette, fonts | Existing, approved | Repo |
| Course and module list | Existing | `courses.ts` (from current site) |
| Illustrative bone scan | Created | Code (`bonescan.ts`), seeded, deterministic |
| Gamma camera head: collimator, crystal and housing, light guide, PMTs | Created | Code-built three.js geometry |
| Patient volume and table | Created | Code-built, outline shared with the image |
| Lighting | Created | Room environment (built into three.js), cool key, teal rim, warm point at the tracer, fog, light bloom |
| Fallback stills, desktop and mobile | Created | Rendered from the scene (`public/images/behind-image/`) |
| Authorized teaching image (bone scan or phantom) | **Wanted** | From Karen, de-identified |
| Still or short clip from Module 16 The Gamma Camera | **Wanted** | From Karen, for scene E |
| Sample lesson embed | **Missing** | `sample.videoUrl` is empty |

Honest limits: the 3D is code-built. It works as a clean explanatory model,
and the PMTs, collimator and crystal read correctly, but a modelled gamma
camera head (shielding, gantry) and modelled PMTs would raise realism if
wanted; that would be a Blender modelling task delivered as compressed GLB.
Frame rate was measured only in software rendering (SwiftShader), not on
real devices.

## 8. Technical notes

- `src/content/behindImage.ts`: copy, labels, text alternative.
- `src/scripts/behind-image/config.ts`: dimensions, layer heights, camera
  shots, scroll timeline, colours.
- `src/scripts/behind-image/bonescan.ts`: synthetic image model.
- `src/scripts/behind-image/scene.ts`: geometry, materials, lighting.
- `src/scripts/behind-image/index.ts`: renderer, scroll, camera, labels.
- `src/components/BehindImage.astro`: markup, styles, loader, fallback.

three.js is the only new dependency, loaded with a dynamic import when the
section is within 1.5 viewports, and only when WebGL works and reduced motion
is off (about 156 KB gzipped). GSAP is not used: the scroll mapping is a few
lines and doesn't justify a second library. Rendering runs only while the
section is on screen. Reduced motion and no-WebGL get a static version with
the same copy and two rendered stills. The canvas, labels and animated copy
are hidden from screen readers; a visually hidden heading and full text
description carry the content.

Rendering stills: run `npm run dev`, then open
`/?bi=0&poster` (scene A) or `/?bi=1&poster` (scene B) and capture the
`.bi-sticky` element at 1600 x 1000 (desktop) or 780 x 1000 (mobile), with
the nav and copy hidden. `?bi=<0..1>` without `poster` pins the timeline for
checking any moment.
