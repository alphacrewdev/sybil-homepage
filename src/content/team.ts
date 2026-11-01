// Instructors, as credited on the About page and course pages. Short bios
// avoid depending on current employer titles, which still need confirming.
// Add instructors only from approved names and bios.
import type { InstructorId } from "./courses";

export type Instructor = {
  id: InstructorId;
  name: string;
  role: string;
  bio: string;
  photo?: string;
};

export const instructors: Record<InstructorId, Instructor> = {
  "karen-brown": {
    id: "karen-brown",
    name: "Karen Brown",
    role: "Founder and Lead Instructor",
    bio: "Karen Brown is a medical physicist and the founder of Sybil Digital Learning. She leads Sybil’s teaching alongside fellow instructors, with a focus on physics relevant to radiologists and Core Exam preparation.",
    photo: "/images/team/karen-brown.jpg",
  },
  "sam-einstein": {
    id: "sam-einstein",
    name: "Sam Einstein",
    role: "Basic MRI Physics Instructor",
    // TODO(karen): confirm current title and full credentials before expanding.
    bio: "Sam Einstein contributes to Basic MRI Physics, bringing expertise in diagnostic medical physics and MR safety.",
  },
};

// One-line credit used on course pages.
export const courseCredit: Record<InstructorId, string> = {
  "karen-brown": "Medical physicist, founder, and lead instructor of Sybil Digital Learning.",
  "sam-einstein": "Contributes to Basic MRI Physics, bringing expertise in diagnostic medical physics and MR safety.",
};
