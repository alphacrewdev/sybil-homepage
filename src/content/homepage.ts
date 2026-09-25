// Central content file for the homepage and shared nav/footer.
// Copy is the client-reviewed homepage copy (Sept 2026). Assets still
// pending are marked TODO(karen).
import { withBase } from "../lib/base";

export const site = {
  name: "Sybil Digital Learning",
  // TODO(karen): confirm production domain (currently sybildigitallearning.com)
  url: "https://sybildigitallearning.com",
  // TODO(karen): confirm the auth app's URL once it's on its own subdomain
  appUrl: "https://app.sybildigitallearning.com",
  description:
    "On-demand radiology courses for residents, with visual explanations for board preparation and live teaching for participating residency programs.",
};

export const nav = {
  links: [
    { label: "Courses", href: withBase("/courses") },
    { label: "For Residency Programs", href: withBase("/program-directors") },
    { label: "About", href: withBase("/about") },
    { label: "Contact", href: withBase("/contact") },
  ],
  account: { label: "Log in", href: site.appUrl },
  primary: { label: "Browse courses", href: withBase("/courses") },
};

export const hero = {
  eyebrow: "For radiology residents and residency programs",
  headline: "Make sense of the science behind the image.",
  sub:
    "Support your radiology board preparation with short, on-demand lessons and animated explanations of complex concepts. Learn with a teaching team led by practicing radiologist Dr. Karen Brown.",
  primaryCta: { label: "Browse courses", href: withBase("/courses") },
  secondaryCta: { label: "Explore program access", href: withBase("/program-directors") },
  mediaCaption: "ONE CHEST · THE FOUR MODALITIES RESIDENTS TRAIN ON",
};

export const outreach = {
  // Star rating renders only when >= 4, per developer spec — wire to real Firestore average later
  averageRating: 4.6,
  ratingCount: 120,
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
      sub: "Explore the concepts behind the imaging methods you encounter during residency.",
    },
    {
      kicker: "See it explained",
      line: "Follow complex ideas one step at a time.",
      sub: "Animation brings movement and sequence into the explanation, helping you follow how a process works.",
    },
    {
      kicker: "Explore nuclear medicine",
      line: "Take a closer look at Nuclear Medicine.",
      sub: "Explore the course and see the lessons currently available.",
      cta: { label: "View Nuclear Medicine", href: withBase("/courses#nuclear-medicine") },
    },
  ],
};

export const why = {
  heading: "Clear explanations. Time to understand.",
  items: [
    {
      icon: "animation",
      title: "Concepts explained through animation",
      body:
        "See processes unfold step by step. Sybil uses animation to explain difficult concepts and give you a visual way to work through the material.",
    },
    {
      icon: "time",
      title: "Lessons that fit residency",
      body:
        "Clinical work leaves limited time for study. Short, on-demand lessons let you work through a topic when your schedule allows and revisit it during review.",
    },
    {
      icon: "lead",
      title: "A team led by experience",
      body:
        "Practicing radiologist Dr. Karen Brown leads Sybil’s teaching team. Her work developing and reviewing course content helps shape the explanations and material residents study.",
    },
  ],
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
      title: "Practice with Board Review Questions",
      body:
        "Use the question bank to test your knowledge beyond the lesson. Repeated practice gives you another opportunity to work through questions you previously missed.",
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
  subjects: ["Radiography", "Mammography", "Fluoroscopy", "Computed Tomography (CT)", "Nuclear Medicine"],
};

type Course = {
  slug: string;
  tag: string;
  title: string;
  body: string;
  link: string;
  // TODO(karen): real course stills. Set e.g. image: withBase("/courses/radiography.jpg")
  // and the drawn vignette for that card is replaced automatically.
  image?: string;
};

export const courses = {
  heading: "Find the subject you need to understand next.",
  intro: "Explore individual courses, review questions, and bundle options for your board preparation.",
  items: <Course[]>[
    {
      slug: "radiography",
      tag: "Course",
      title: "Radiography",
      body: "Build your understanding of radiography concepts as part of your radiology board preparation.",
      link: "View course",
    },
    {
      slug: "mammography",
      tag: "Course",
      title: "Mammography",
      body: "Work through mammography concepts with focused lessons you can revisit as you study.",
      link: "View course",
    },
    {
      slug: "fluoroscopy",
      tag: "Course",
      title: "Fluoroscopy",
      body: "Develop your understanding of fluoroscopy with lessons organized for focused study and review.",
      link: "View course",
    },
    {
      slug: "ct",
      tag: "Course",
      title: "Computed Tomography (CT)",
      body: "Study CT concepts through on-demand lessons that fit around your clinical responsibilities.",
      link: "View course",
    },
    {
      slug: "nuclear-medicine",
      tag: "Course",
      title: "Nuclear Medicine",
      body: "Study nuclear medicine concepts through on-demand course lessons.",
      link: "View course",
    },
    {
      slug: "board-review",
      tag: "Question bank",
      title: "Board Review Questions",
      body: "Review what you have learned with a question bank for radiology board preparation.",
      link: "Explore questions",
    },
  ],
  cta: { label: "Browse all courses", href: withBase("/courses") },
};

export const ways = {
  heading: "Study independently. Or learn with your program.",
  items: [
    {
      title: "For individual residents",
      body:
        "Choose a course or bundle for your own board preparation. Study through on-demand lessons, with email support when you have questions. Standard individual access does not include live teaching sessions.",
      cta: { label: "Explore individual courses", href: withBase("/courses") },
    },
    {
      title: "For residency programs",
      body:
        "Bring Sybil into your program with on-demand coursework and live teaching sessions to review the material and answer residents’ questions. Contact us to discuss your program’s needs.",
      cta: { label: "Request program information", href: withBase("/program-directors") },
    },
  ],
};

export const team = {
  eyebrow: "Meet the teaching team",
  heading: "Led by Dr. Karen Brown",
  bio:
    "Dr. Karen Brown is a practicing radiologist, founder, and lead instructor at Sybil Digital Learning. She works alongside fellow instructors to help radiology residents understand complex material and prepare for their boards.",
  credentials: ["Practicing radiologist", "Founder and Lead Instructor"],
  // TODO(karen): headshot — see questionnaire C1
  photoAlt: "Portrait of Dr. Karen Brown",
  link: { label: "Meet our instructors", href: withBase("/about") },
};

export const closing = {
  heading: "Find your next course.",
  body:
    "Explore the subjects you need for your own study, or talk with us about bringing Sybil to your residency program.",
  primary: { label: "Browse courses", href: withBase("/courses") },
  secondary: { label: "Request program information", href: withBase("/program-directors") },
};

export const footer = {
  // TODO(karen): confirm public contact address — see questionnaire E3
  contactEmail: "contact@sybildigitallearning.com",
  blurb:
    "On-demand radiology courses for residents, with visual explanations for board preparation and live teaching for participating residency programs. Founded by practicing radiologist Dr. Karen Brown.",
  legacyPlatform: {
    // TODO(karen): confirm this should stay live until legacy students finish (~Jan/Feb per Sept 16 meeting)
    label: "Existing student on the previous platform?",
    href: "#",
  },
  columns: [
    {
      title: "Learn",
      links: [
        { label: "Courses", href: withBase("/courses") },
        { label: "Board Review Questions", href: withBase("/courses#board-review") },
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
  legal: [
    { label: "Privacy Policy", href: withBase("/privacy") },
    { label: "Terms of Use", href: withBase("/terms") },
  ],
};
