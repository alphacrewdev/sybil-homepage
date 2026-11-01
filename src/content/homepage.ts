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
  // The learning platform (sdl-platform). Its routes — /login, /dashboard,
  // /profile — were checked against the platform's router; "/" sends a
  // signed-in user to their role's home (learner, director, admin).
  appUrl: "https://app.sybildigitallearning.com",
  description:
    "On-demand radiology physics courses for residents and residency programs, covering the physics on the ABR Core Exam.",
};

// Shared destinations, so every CTA for the same action goes to one place.
export const links = {
  courses: withBase("/courses/"),
  programs: withBase("/program-directors/"),
  consult: withBase("/contact/?intent=program#contact-form"),
  contact: withBase("/contact/"),
  about: withBase("/about/"),
  instructors: withBase("/about/#instructors"),
  myCourses: withBase("/my-courses/"),
  support: withBase("/contact-support/"),
  bank: withBase("/courses/core-physics-practice-questions/"),
  bundle: withBase("/courses/radiology-physics-course-bundle/"),
  login: `${site.appUrl}/login`,
  // Role-aware landing on the platform; signed-out visitors go to its sign-in.
  dashboard: `${site.appUrl}/`,
  account: `${site.appUrl}/profile`,
  privacy: withBase("/privacy-policy/"),
  terms: withBase("/terms-conditions/"),
  disclaimer: withBase("/disclaimer/"),
};

export const nav = {
  links: [
    { label: "Courses", href: links.courses },
    { label: "For Residency Programs", href: links.programs },
    { label: "About", href: links.about },
    { label: "Contact", href: links.contact },
  ],
  // No session on the static site, so one honest entry point: the My courses
  // page, which hands off to the platform's sign-in.
  account: { label: "My courses", href: links.myCourses },
  primary: { label: "Browse courses", href: links.courses },
};

export const hero = {
  eyebrow: "Radiology physics for residents and residency programs",
  // Recommended headline — Karen didn't love the earlier options and asked
  // for a recommendation. Drawn from her own account of what Sybil solves.
  headline: "Radiology physics, taught for radiologists.",
  sub:
    "Build your understanding of radiology physics and prepare for the physics on the ABR Core Exam—with short lessons that fit around residency.",
  primaryCta: { label: "Browse courses", href: links.courses },
  // Used only once a real sample video is set (see `sample.videoUrl`).
  secondaryCta: { label: "Watch a sample lesson", href: withBase("/#sample") },
  // Until then the second button points at the differentiators section.
  fallbackCta: { label: "Explore the learning approach", href: "#learning-approach" },
  programLine: { text: "Running a residency program?", label: "Schedule a consult", href: links.consult },
};

export const outreach = {
  // Average and total across the eight courses as shown on the current site.
  averageRating: "4.7",
  students: 663,
  scope: "8 physics courses · Core Exam physics review",
  partners: [
    { name: "RAD-AID", logo: "/images/partners/rad-aid.png", blurb: "Providing radiology education to international residency programs through RAD-AID." },
    { name: "WinSPIRE", logo: "/images/partners/winspire.png", blurb: "Supporting WinSPIRE’s work to expand access to STEM education." },
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
      body: "Make sense of complex physics through visual explanations connected to your work in radiology.",
    },
    {
      icon: "time",
      title: "Built for residency schedules",
      body: "Fit study between clinical responsibilities with 10–15 minute video lessons. Pick up where you left off.",
    },
    {
      icon: "program",
      title: "Simple for programs",
      body: "Coordinate physics teaching around your program’s schedule, with flexible billing and a clear view of residents’ progress.",
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
  heading: "See how Sybil teaches.",
  body: "Watch a sample of the explanations and visual teaching residents use in Sybil’s courses. Then explore the subject you want to study next.",
  cta: { label: "Browse courses", href: links.courses },
  // TODO(karen): embed URL for the sample lesson (VdoCipher or YouTube).
  // While empty, the section is hidden and the hero links to #learning-approach.
  videoUrl: "",
};

export const tools = {
  eyebrow: "From learning to review",
  heading: "A study platform built around your coursework.",
  intro: "Watch, practice, and track your progress in one place.",
  // Only features that are live on the platform (Nov 1, 2026 summary).
  items: [
    {
      kind: "quiz",
      title: "Know what to revisit",
      body: "Lesson quizzes and answer explanations help you identify concepts to review. Track your scores over time.",
    },
    {
      kind: "bank",
      title: "Core Physics Practice Questions",
      body: "A separate question bank for focused review of the physics on the ABR Core Exam.",
    },
    {
      kind: "resume",
      title: "Continue without losing your place",
      body: "Resume where you stopped. Follow lessons in sequence, then revisit completed coursework during your access period.",
    },
    {
      kind: "resources",
      title: "Keep course resources close",
      body: "Download your course’s supporting files for study and review.",
    },
    {
      kind: "live",
      title: "Learn through live review",
      body: "Learn through scheduled sessions and class recordings. Check which live sessions your access includes.",
    },
    {
      kind: "progress",
      title: "See where support is needed",
      body: "Review residents’ progress, quiz scores, and attendance to guide follow-up, with reports available to export.",
    },
  ],
  programLine: "Bring Sybil to your residency program.",
  programCta: { label: "Schedule a consult", href: links.consult },
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
    "Explore eight radiology physics courses, a dedicated Core Exam physics question bank, or the complete course bundle.",
  cta: { label: "Browse all courses", href: links.courses },
  bundle: {
    title: "Radiology Physics Course Bundle",
    body:
      "All eight radiology physics courses plus Core Physics Practice Questions, together in one bundle.",
    cta: { label: "Explore the bundle", href: links.bundle },
  },
};

export const ways = {
  heading: "Study independently. Or learn with your program.",
  items: [
    {
      title: "For individual residents",
      body:
        "Strengthen your physics understanding at your own pace. Choose a subject or the full bundle, with practice for the physics on the Core Exam.",
      cta: { label: "Browse courses", href: links.courses },
    },
    {
      title: "For residency programs",
      body:
        "Give residents a structured physics learning path with on-demand courses and live teaching. Track progress and coordinate schedules and billing around your program.",
      cta: { label: "Schedule a consult", href: links.consult },
    },
  ],
};

export const team = {
  eyebrow: "Meet the teaching team",
  heading: "Led by Karen Brown",
  bio:
    "Medical physicist, founder, and lead instructor Karen Brown works alongside fellow instructors to teach physics for radiology training and Core Exam preparation.",
  credentials: ["Diagnostic Imaging Physicist", "ABR and ABHP certified", "Founder and Lead Instructor"],
  // Headshot lives in public/images/team/; the placeholder shows if it's missing.
  photo: "/images/team/karen-brown.jpg",
  photoAlt: "Portrait of Karen Brown",
  link: { label: "Meet our instructors", href: links.instructors },
};

export const closing = {
  heading: "Find the physics education that fits your needs.",
  body:
    "Explore the subjects you need for your own study, or schedule a consult about bringing Sybil to your residency program.",
  primary: { label: "Browse courses", href: links.courses },
  secondary: { label: "Schedule a consult", href: links.consult },
};

export const footer = {
  // Used by the Contact Support page.
  contactEmail: "contact@sybildigitallearning.com",
  blurb:
    "Radiology physics education and board review for residents and residency programs. On-demand courses, practice questions, and live teaching led by medical physicist Karen Brown.",
  columns: [
    {
      title: "Learn",
      links: [
        { label: "Courses", href: links.courses },
        { label: "Core Physics Practice Questions", href: links.bank },
        { label: "Course Bundle", href: links.bundle },
        { label: "For Residency Programs", href: links.programs },
      ],
    },
    {
      title: "About",
      links: [
        { label: "About Sybil", href: links.about },
        { label: "Our Instructors", href: links.instructors },
        { label: "Contact", href: links.contact },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "My courses", href: links.myCourses },
        { label: "Log in", href: links.login },
        { label: "Technical support", href: links.support },
      ],
    },
  ],
  // Same slugs as the previous site — the platform links out to these.
  legal: [
    { label: "Privacy Policy", href: links.privacy },
    { label: "Terms & Conditions", href: links.terms },
    { label: "Disclaimer", href: links.disclaimer },
    { label: "Technical Support", href: links.support },
  ],
};
