// Copy for the "Behind the image" section. The animation explains the
// mechanism; this copy explains the learning value. Statements marked
// REVIEW(karen) need subject-matter review before launch; see
// docs/behind-the-image.md for the full list and the simplifications.

export const behindImage = {
  label: "Behind the image",
  headline: "See the physics that makes the image possible.",
  intro:
    "Follow a nuclear medicine image back through the gamma camera that recorded it, one step at a time.",

  // Scene captions, keyed to the timeline in scripts/behind-image/config.ts.
  beats: [
    {
      id: "image",
      kicker: "The image",
      // REVIEW(karen): description of a bone scan for a general resident audience.
      line: "A bone scan records where a tracer collected in the skeleton.",
      question: "What produced what we see here?",
    },
    {
      id: "mechanism",
      kicker: "The gamma camera",
      // REVIEW(karen): order and roles of the detector stages.
      line: "Gamma rays from the tracer pass a collimator, light up a crystal, and are located by photomultiplier tubes.",
    },
  ],

  // Short labels for the mechanism view. Kept to five.
  labels: {
    image: "Image matrix",
    pmt: "Photomultiplier tubes",
    crystal: "NaI(Tl) crystal",
    collimator: "Collimator",
    patient: "Tracer in the patient",
  },

  // Always visible on the image: this is not patient data.
  imageTag: "ILLUSTRATIVE RECONSTRUCTION · NOT PATIENT DATA",
  imageMeta: "ANTERIOR WHOLE BODY · Tc-99m MDP",
  fovTag: "ONE DETECTOR POSITION",
  simplified: "Simplified: layers separated and scaled for clarity.",

  // Text alternative for the whole sequence (screen readers, no-WebGL).
  description:
    "An illustrative whole-body bone scan, shown as dark uptake on a light background. The view moves to the side to reveal what sits beneath it: a gamma camera above a patient. From the patient upward: tracer concentrated in the skeleton, a lead collimator, a sodium iodide crystal, a light guide, an array of photomultiplier tubes, and the image matrix where each recorded event is counted. The detector covers one region at a time; a whole-body image is built by moving the table through its field of view.",
};
