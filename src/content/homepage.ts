// Central content file for the homepage and shared nav/footer.
// Swap TODO(karen) values once she answers Sybil-Homepage-Questionnaire.html —
// nothing else in the codebase should need to change when copy/assets land.

export const site = {
  name: "Sybil Digital Learning",
  // TODO(karen): confirm production domain (currently sybildigitallearning.com)
  url: "https://sybildigitallearning.com",
  // TODO(karen): confirm the auth app's URL once it's on its own subdomain
  appUrl: "https://app.sybildigitallearning.com",
  description:
    "Animated radiology board-review courses for residents and residency programs, written and reviewed by a practicing radiologist.",
};

export const nav = [
  { label: "About", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "For Programs", href: "/program-directors" },
  { label: "Contact", href: "/contact" },
];

export const hero = {
  // TODO(karen): replace with her preferred headline — see questionnaire A1-A4
  headline: "Radiology board review, animated by the radiologist who wrote it.",
  sub:
    "Short, on-demand video courses covering the material residents are tested on — written, storyboarded, and reviewed personally by Dr. Karen Brown before a single frame ships.",
  primaryCta: { label: "Browse courses", href: "/courses" },
  secondaryCta: { label: "Bringing this to your program?", href: "/program-directors" },
  mediaCaption: "NUCLEAR MEDICINE · MOD 12 / 29",
  // TODO(karen/amanda): swap for a real course clip or hero image — see questionnaire A3
};

export const trust = {
  // Star rating renders only when >= 4, per developer spec — wire to real Firestore average later
  averageRating: 4.6,
  ratingCount: 120,
  partners: [
    {
      name: "RadAID",
      // TODO(karen): approved one-line description — see questionnaire C3
      blurb: "Course access for radiology residency programs RadAID supports internationally.",
    },
    {
      name: "WinSPIRE",
      blurb: "Supporting STEM access for students considering undergraduate programs.",
    },
  ],
  // TODO(karen): real numbers — see questionnaire C4
  stats: [
    { value: "—", label: "years teaching residents" },
    { value: "—", label: "residents trained" },
    { value: "—", label: "residency programs" },
  ],
};

export const differentiators = [
  {
    title: "Animated, not recorded",
    body:
      "Every course is built from a storyboard and audio script, then animated — not a PowerPoint recorded on a webcam, and not generic AI-generated video.",
  },
  {
    title: "Built for the boards",
    body:
      "Content is scoped to what's actually tested, delivered in short sessions residents can finish between cases.",
  },
  {
    title: "Reviewed by a working radiologist",
    body:
      "Dr. Karen Brown writes and checks every module herself before it ships — the knowledge is confirmed, not assembled.",
  },
];

export const modalityPath = [
  {
    order: 1,
    modality: "Radiography",
    status: "available",
  },
  {
    order: 2,
    modality: "Mammography",
    status: "available",
  },
  {
    order: 3,
    modality: "Fluoroscopy",
    status: "available",
  },
  {
    order: 4,
    modality: "CT",
    status: "available",
  },
  {
    order: 5,
    modality: "Nuclear Medicine",
    status: "in-production",
    // TODO(karen): confirm live module count as course build progresses (29 total, ~19 built as of Sept 2026)
    note: "New animated course in production — modules going live on a rolling basis.",
  },
];
// TODO(karen): confirm modality order/status above is accurate — see questionnaire D1

export const courses = [
  {
    slug: "nuclear-medicine",
    title: "Nuclear Medicine",
    modality: "Nuclear Medicine",
    description: "29 modules covering the nuclear medicine material residents are tested on.",
    status: "in-production" as const,
  },
  {
    slug: "radiography",
    title: "Radiography",
    modality: "Radiography",
    description: "Foundational radiography course.",
    status: "coming-soon" as const,
  },
  {
    slug: "mammography",
    title: "Mammography",
    modality: "Mammography",
    description: "Mammography course.",
    status: "coming-soon" as const,
  },
  {
    slug: "fluoroscopy",
    title: "Fluoroscopy",
    modality: "Fluoroscopy",
    description: "Fluoroscopy course.",
    status: "coming-soon" as const,
  },
  {
    slug: "ct",
    title: "CT",
    modality: "CT",
    description: "CT course.",
    status: "coming-soon" as const,
  },
  {
    slug: "board-review",
    title: "Board Review Questions",
    modality: "Board Review",
    description: "Standalone question bank, or included with a full course bundle.",
    status: "available" as const,
  },
];
// TODO(karen): confirm which courses should actually show on the homepage preview
// vs. only on /courses — see questionnaire D1/D2. Descriptions above are placeholders.

export const audiences = [
  {
    title: "For residency programs",
    body:
      "Priced per resident, up to 12 — the price doesn't increase past that. Includes live Q&A sessions with Dr. Brown and full progress reporting for your program.",
    cta: { label: "Talk to us about your program", href: "/program-directors" },
  },
  {
    title: "For individual residents",
    body:
      "Buy a single course or the full bundle, six months of access. Support by email — the same content, without live sessions with Dr. Brown.",
    cta: { label: "Browse courses", href: "/courses" },
  },
];

export const instructor = {
  name: "Dr. Karen Brown",
  // TODO(karen): real bio + credentials — see questionnaire C1
  bio:
    "Practicing radiologist teaching radiology residents and residency programs nationwide, and partnering with RadAID to bring the same courses to international programs.",
  // TODO(karen): headshot — see questionnaire C1
  photoAlt: "Portrait of Dr. Karen Brown",
};

export const footer = {
  // TODO(karen): confirm public contact address — see questionnaire E3
  contactEmail: "contact@sybildigitallearning.com",
  legacyPlatform: {
    // TODO(karen): confirm this should stay live until legacy students finish (~Jan/Feb per Sept 16 meeting)
    label: "Existing student on the previous platform?",
    href: "#",
  },
};
