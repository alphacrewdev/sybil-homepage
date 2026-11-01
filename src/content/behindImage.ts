// Copy for the "Behind the image" section. The scene is an illustrative
// animation (not a course excerpt, not patient data); the copy carries two
// audience-focused messages, one visible at every point of the scroll.
// Science notes and simplifications: docs/behind-the-image.md.

export const behindImage = {
  label: "Behind the image",

  // Exactly two messages, keyed to the timeline in scripts/behind-image/config.ts.
  // The first shows immediately; the second takes over as the view tilts.
  beats: [
    {
      kicker: "Physics in context",
      headline: "Understand the physics you need as a radiologist.",
      body: "Visual explanations connect complex physics to your work in radiology.",
    },
    {
      kicker: "Built around residency",
      headline: "Build understanding one focused lesson at a time.",
      body: "Short videos, lesson quizzes, and dedicated practice questions fit study around residency.",
    },
  ],

  caption: "Illustrative animation · not a course excerpt",
  note: "Simplified illustration · not patient data",

  // Text alternative for the whole sequence (screen readers, no-WebGL).
  description:
    "An illustrative animation: a whole-body bone scan, then the gamma camera beneath it, from the patient up through the collimator, crystal and photomultiplier tubes to the image.",
};
