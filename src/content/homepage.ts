// Central content file for the homepage and shared nav/footer.
// Positioning follows Karen's questionnaire answers (Oct 2026): radiology
// physics education and ABR Core Exam review, for residents and residency
// programs, taught by a medical physicist. Items still pending are marked
// TODO(karen).
import { withBase } from "../lib/base";

export const site = {
  name: "Sybil Digital Learning",
  // TODO(karen): confirm production domain (currently sybildigitallearning.com)
  url: "https://sybildigitallearning.com",
  // TODO(karen): confirm the auth app's URL once it's on its own subdomain
  appUrl: "https://app.sybildigitallearning.com",
  description:
    "On-demand radiology physics courses for residents and residency programs, covering the physics on the ABR Core Exam.",
};

export const nav = {
  links: [
    { label: "Courses", href: withBase("/#courses") },
    { label: "For Residency Programs", href: withBase("/program-directors") },
    { label: "About", href: withBase("/about") },
    { label: "Contact", href: withBase("/contact") },
  ],
  account: { label: "Log in", href: site.appUrl },
  primary: { label: "Browse courses", href: withBase("/#courses") },
};

export const hero = {
  eyebrow: "Radiology physics for residents and residency programs",
  // Recommended headline — Karen didn't love the earlier options and asked
  // for a recommendation. Drawn from her own account of what Sybil solves.
  headline: "Radiology physics, taught for radiologists.",
  sub:
    "Short, animated lessons on the physics the ABR Core Exam tests, taught for how you’ll use it in practice. Built by medical physicist Karen Brown for residents and residency programs.",
  primaryCta: { label: "Browse courses", href: withBase("/#courses") },
  secondaryCta: { label: "Watch a sample lesson", href: withBase("/#sample") },
  programLine: { text: "Running a residency program?", label: "Schedule a consult", href: withBase("/contact") },
  mediaCaption: "ONE CHEST · FOUR MODALITIES · THE PHYSICS BEHIND EACH",
};

export const outreach = {
  // Average and total across the eight courses as shown on the current site.
  averageRating: "4.7",
  courseCount: 8,
  students: 663,
  partners: [
    // TODO(karen): real partner logo files — placeholders are typeset wordmarks
    { name: "RAD-AID", blurb: "Providing radiology education to international residency programs through RAD-AID." },
    { name: "WinSPIRE", blurb: "Supporting WinSPIRE’s work to expand access to STEM education." },
  ],
};

export const scan = {
  stages: [
    {
      kicker: "Behind the image",
      line: "Every image starts with a process worth understanding.",
      sub: "Explore the physics behind the imaging methods you encounter during residency.",
    },
    {
      kicker: "See it explained",
      line: "Follow complex ideas one step at a time.",
      sub: "Animation brings movement and sequence into the explanation, helping you follow how a process works.",
    },
    {
      kicker: "Explore nuclear medicine",
      line: "Take a closer look at Nuclear Medicine Physics.",
      sub: "Explore the course and see the lessons currently available.",
      cta: { label: "View Nuclear Medicine", open: "nuclear-medicine" },
    },
  ],
};

export const why = {
  heading: "Physics, taught for how you’ll use it.",
  items: [
    {
      icon: "lead",
      title: "Taught for radiologists",
      body:
        "Most physics is taught the way physicists understand it. Sybil teaches the physics that matters to radiologists and puts it in the context of how you’ll use it.",
    },
    {
      icon: "time",
      title: "Built for residency schedules",
      body:
        "Modules of 10–15 minutes, available 24/7, so complicated material becomes digestible and fits around clinical work.",
    },
    {
      icon: "program",
      title: "Simple for programs",
      body:
        "Flexible billing and a schedule built around your residents, with live review sessions with Karen. Most programs come to us by referral.",
    },
  ],
};

// Verbatim from the reviews shown on the current site's course pages.
export const testimonials = [
  { text: "Fastest way to learn a modality out there.", author: "Resident, Geisinger", rating: 5 },
  {
    text: "Great course, very helpful. The animations contribute substantially to the final product.",
    author: "Resident, Penn State College of Medicine",
    rating: 5,
  },
];

export const sample = {
  eyebrow: "Sample lesson",
  heading: "See how a module works.",
  body: "Each module is a short animated lesson of 10–15 minutes, followed by questions. Watch one before you enroll.",
  caption: "SAMPLE LESSON · PREVIEW",
  // TODO(karen): embed URL for the sample lesson (VdoCipher or YouTube)
  videoUrl: "",
};

export const tools = {
  eyebrow: "Built around the way you study",
  heading: "Watch. Test your understanding. Return to what matters.",
  intro:
    "Pair clear teaching with tools for active study. Work through lessons, check your understanding, and keep the topics you need to revisit within reach.",
  items: [
    {
      kind: "quiz",
      title: "Check your understanding",
      body:
        "Follow lessons with quizzes that help you identify what needs another look. Review your answers after submission and return to the material as you study.",
    },
    {
      kind: "bank",
      title: "Practice with Core Physics Practice Questions",
      body:
        "Use the question bank to prepare for the ABR Core Exam. Repeated practice gives you another opportunity to work through questions you previously missed.",
    },
    {
      kind: "search",
      title: "Find the explanation again",
      body:
        "Search video transcripts for a term to find relevant moments. When reviewing a video you have completed, use chapter markers to return to a specific section.",
    },
    {
      kind: "notes",
      title: "Keep your own study notes",
      body:
        "Save notes alongside a video and bookmark moments you want to revisit. Build a personal set of reference points as you work through the course.",
    },
    {
      kind: "resume",
      title: "Pick up where you left off",
      body:
        "Resume a video from your saved position, see your course progress, and review previous quiz attempts as you plan your next study session.",
    },
    {
      kind: "dicom",
      title: "Explore course images",
      body:
        "Work with DICOM images provided in course resources. Zoom, adjust the image display, and use measurement tools to examine the teaching material more closely.",
    },
  ],
  availability: "Study tools and resources vary by course and access option. See course details for what is included.",
};

export const path = {
  heading: "A learning path that fits your training.",
  body:
    "Residents begin coursework at different times. Explore courses by subject, with on-demand study to support your learning throughout residency.",
  subjects: ["Radiography", "Mammography", "Fluoroscopy", "CT", "Nuclear Medicine", "Radiation Biology", "Ultrasound", "MRI"],
};

export const courses = {
  heading: "Find the subject you need to understand next.",
  intro:
    "Eight physics courses, a Core Exam question bank, and a bundle of everything — for radiology residents and other medical professionals.",
  cta: { label: "Browse all courses", href: withBase("/courses") },
  bundle: {
    title: "Radiology Physics Course Bundle",
    body:
      "All eight courses plus Core Physics Practice Questions, for radiology residents and other medical professionals preparing for the ABR Core Exam.",
    // TODO: point at the platform's own checkout once Phase 2 ships
    cta: { label: "View the bundle", href: "https://sybildigitallearning.com/" },
  },
};

export const ways = {
  heading: "Study independently. Or learn with your program.",
  items: [
    {
      title: "For individual residents",
      body:
        "Choose a single course or the full bundle for your own Core Exam preparation. Study on demand, with email support when you have questions.",
      cta: { label: "Browse courses", href: withBase("/#courses") },
    },
    {
      title: "For residency programs",
      body:
        "Bring Sybil to your program with on-demand coursework and live review sessions with Karen. Flexible billing and a schedule built around your residents — most programs come to us by referral.",
      cta: { label: "Schedule a consult", href: withBase("/contact") },
    },
  ],
};

export const team = {
  eyebrow: "Meet the teaching team",
  heading: "Led by Karen Brown",
  bio:
    "Karen Brown is a Diagnostic Imaging Physicist at Penn State College of Medicine, certified by the American Board of Radiology and the American Board of Health Physics, and the founder and lead instructor of Sybil Digital Learning. She works alongside fellow instructors to teach radiology residents the physics they need for the ABR Core Exam and for practice.",
  credentials: ["Diagnostic Imaging Physicist", "ABR and ABHP certified", "Founder and Lead Instructor"],
  // TODO(karen): headshot — see questionnaire C1
  photoAlt: "Portrait of Karen Brown",
  link: { label: "Meet our instructors", href: withBase("/about") },
};

export const closing = {
  heading: "Find your next course.",
  body:
    "Explore the subjects you need for your own study, or schedule a consult about bringing Sybil to your residency program.",
  primary: { label: "Browse courses", href: withBase("/#courses") },
  secondary: { label: "Schedule a consult", href: withBase("/contact") },
};

export const footer = {
  // Used by the Contact Support page.
  contactEmail: "contact@sybildigitallearning.com",
  blurb:
    "On-demand radiology physics courses for residents, with animated explanations for ABR Core Exam preparation and live review sessions for participating residency programs.",
  columns: [
    {
      title: "Learn",
      links: [
        { label: "Courses", href: withBase("/#courses") },
        { label: "Core Physics Practice Questions", href: withBase("/#courses") },
        { label: "For Residency Programs", href: withBase("/program-directors") },
      ],
    },
    {
      title: "About",
      links: [
        { label: "About Sybil", href: withBase("/about") },
        { label: "Our Instructors", href: withBase("/about") },
        { label: "Contact", href: withBase("/contact") },
      ],
    },
    {
      title: "Account",
      links: [{ label: "Log in", href: site.appUrl }],
    },
  ],
  // Same slugs as the previous site — the platform links out to these.
  legal: [
    { label: "Privacy Policy", href: withBase("/privacy-policy") },
    { label: "Terms & Conditions", href: withBase("/terms-conditions") },
    { label: "Disclaimer", href: withBase("/disclaimer") },
    { label: "Technical Support", href: withBase("/contact-support") },
  ],
};
