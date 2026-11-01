// Product catalogue: the eight physics courses, the question bank and the
// bundle. One source for the homepage cards, the /courses/ catalogue, the
// quick-preview dialogs and every permanent course page.
//
// Copy follows Claude-Sybil-Complete-Website-Brief.md (Nov 1, 2026), section 16.
// Deliberately NOT carried over from the previous site: star ratings and
// student counts, module counts, "3 hours total", the 27-module Nuclear
// Medicine list, and the six-month access assumption. Topic outlines describe
// coverage, not a promised module count or sequence.
import { withBase } from "../lib/base";

export type Instructor = { name: string; role: string; bio?: string };

export type ProductKind = "course" | "bank" | "bundle";

export type Product = {
  /** Route segment under /courses/. */
  slug: string;
  /** Key CourseVignette uses to pick an illustration when there is no photo. */
  vignette: string;
  title: string;
  kind: ProductKind;
  tag: "Course" | "Question bank" | "Bundle";
  /** One sentence for catalogue cards and meta descriptions. */
  summary: string;
  /** Short intro at the top of the page. */
  hero: string;
  outcomes: string[];
  /** Expandable outline; one unnamed group, or several named groups. */
  topics: { group?: string; items: string[] }[];
  instructors: Instructor[];
  image?: string;
  /** Address on the previous site; kept so old links and bookmarks still land. */
  legacyPath?: string;
};

const karen: Instructor = {
  name: "Karen Brown",
  role: "Medical physicist, founder, and lead instructor of Sybil Digital Learning",
};

const sam: Instructor = {
  name: "Sam Einstein",
  role: "Basic MRI Physics instructor",
  bio: "Contributes to Basic MRI Physics, bringing expertise in diagnostic medical physics and MR safety.",
};

export const courseList: Product[] = [
  {
    slug: "radiography-physics",
    vignette: "radiography-physics",
    title: "Radiography Physics",
    kind: "course",
    tag: "Course",
    summary: "Understand how X-rays become images—and what influences image quality and radiation dose.",
    hero: "Build your understanding of X-ray production, image formation, detectors, and radiation safety through focused radiography physics lessons.",
    outcomes: [
      "Explain how X-rays are produced and how beam quality and quantity are controlled.",
      "Connect geometry, scatter, and detector performance to image quality.",
      "Recognize the physical causes of common radiographic artifacts.",
      "Review exposure control and the principles of radiation dose and safety.",
    ],
    topics: [
      {
        items: [
          "X-ray production, focal spot size, and anode angle",
          "Magnification, geometric blur, and beam quality and quantity",
          "Image formation, scattered radiation, and scatter management",
          "Automatic exposure control and radiographic detectors",
          "Image quality, artifacts, radiation dose, and safety",
        ],
      },
    ],
    instructors: [karen],
    image: withBase("/images/courses/radiography.png"),
    legacyPath: "/radiography-physics",
  },
  {
    slug: "mammography-physics",
    vignette: "mammography-physics",
    title: "Mammography Physics",
    kind: "course",
    tag: "Course",
    summary: "Understand mammographic image formation, tomosynthesis, image quality, and dose.",
    hero: "Explore the physics of mammography and digital breast tomosynthesis, from X-ray production and compression to image quality, quality control, and radiation dose.",
    outcomes: [
      "Explain the roles of target/filter combinations and the mammography X-ray tube.",
      "Describe compression, collimation, detectors, grids, and exposure control.",
      "Review magnification and the basic principles of digital breast tomosynthesis.",
      "Connect average glandular dose, quality control, and artifacts to mammographic imaging.",
    ],
    topics: [
      {
        items: [
          "Introduction, target/filter combinations, and the mammography X-ray tube",
          "Collimation, compression, grid, detector, and automatic exposure control",
          "Magnification mammography and average glandular dose",
          "Digital breast tomosynthesis: introduction, principles, and comparison with 2D imaging",
          "Quality control and artifacts",
        ],
      },
    ],
    instructors: [karen],
    image: withBase("/images/courses/mammography.png"),
    legacyPath: "/mammography-physics",
  },
  {
    slug: "fluoroscopy-physics",
    vignette: "fluoroscopy-physics",
    title: "Fluoroscopy Physics",
    kind: "course",
    tag: "Course",
    summary: "Connect fluoroscopic image formation with exposure control and dose management.",
    hero: "Understand fluoroscopy systems and operating modes, with focused coverage of image formation, exposure-rate control, and radiation dose for patients and operators.",
    outcomes: [
      "Describe fluoroscopic systems, flat-panel detectors, and image intensifiers.",
      "Explain automatic exposure-rate control and electronic magnification.",
      "Compare fluoroscopic and fluorographic modes of operation.",
      "Review patient dose monitoring and dose management for patients and operators.",
    ],
    topics: [
      {
        items: [
          "Introduction and fluoroscopic imaging systems",
          "Flat-panel detectors and image intensifiers",
          "Automatic exposure-rate control and electronic magnification",
          "Fluoroscopy and fluorography operating modes",
          "Patient dose monitoring, patient dose management, and operator dose management",
        ],
      },
    ],
    instructors: [karen],
    image: withBase("/images/courses/fluoroscopy.png"),
    legacyPath: "/fluoroscopy-physics",
  },
  {
    slug: "ct-physics",
    vignette: "ct-physics",
    title: "CT Physics",
    kind: "course",
    tag: "Course",
    summary: "Understand how CT acquisition and reconstruction shape images, artifacts, and dose.",
    hero: "Explore the CT imaging chain, from the X-ray tube and detector array to reconstruction, image quality, radiation dose, and common artifacts.",
    outcomes: [
      "Describe the main components of a CT system and their roles.",
      "Explain image formation, CT numbers, and acquisition modes.",
      "Connect acquisition and reconstruction parameters to the resulting image.",
      "Review dose, artifacts, dual-energy CT, and CT fluoroscopy concepts.",
    ],
    topics: [
      {
        items: [
          "System overview, X-ray tube, filtration, detectors, and collimation",
          "Image formation, CT numbers, and helical and axial acquisition",
          "Tube current modulation and acquisition parameters",
          "Reconstruction parameters, CT dose, and artifacts",
          "Dual-energy CT and CT fluoroscopy",
        ],
      },
    ],
    instructors: [karen],
    image: withBase("/images/courses/ct.png"),
    legacyPath: "/ct-physics",
  },
  {
    slug: "nuclear-medicine",
    vignette: "nuclear-medicine",
    title: "Nuclear Medicine Physics",
    kind: "course",
    tag: "Course",
    summary: "Explore radioactive decay, imaging instrumentation, and the physics of SPECT and PET.",
    hero: "Follow nuclear medicine physics from radionuclides and radiation measurement to image formation, image quality, and common artifacts.",
    outcomes: [
      "Explain principles of radioactive decay, activity, and half-life.",
      "Describe the roles of radiation measurement and imaging instrumentation.",
      "Connect SPECT and PET imaging principles to image quality.",
      "Review quality-control concepts and common imaging artifacts.",
    ],
    // Broad topics only: the course's current lesson inventory has not been reconciled.
    topics: [
      {
        items: [
          "Nuclides, nuclear stability, decay processes, activity, and half-life",
          "Radionuclide production and generators",
          "Radiation instrumentation, ionization chambers, and scintillation detectors",
          "Gamma cameras, collimation, and SPECT imaging",
          "Quality control, PET, reconstruction, artifacts, and quantitative imaging",
        ],
      },
    ],
    instructors: [karen],
    image: withBase("/images/courses/nuclear-medicine.png"),
    legacyPath: "/nuclear-medicine",
  },
  {
    slug: "radiation-biology-safety-dose",
    vignette: "radiation-biology-safety-dose",
    title: "Radiation Biology, Safety, and Dose",
    kind: "course",
    tag: "Course",
    summary: "Understand biological effects, radiation protection, and the dose quantities used in imaging.",
    hero: "Connect the biological effects of radiation with protection principles and the dose quantities used to describe exposure in medical imaging.",
    outcomes: [
      "Describe mechanisms of cellular damage and biological effects.",
      "Distinguish tissue effects, stochastic effects, and effects on development.",
      "Review radiation protection for the public and occupational workers.",
      "Explain air kerma, absorbed dose, equivalent dose, effective dose, and diagnostic reference levels.",
    ],
    // Three topic groups, kept separate as in the source course.
    topics: [
      {
        group: "Radiation biology",
        items: ["Cellular interactions", "Tissue effects", "Stochastic effects", "Teratogenic effects"],
      },
      {
        group: "Radiation protection",
        items: ["Background radiation", "The public", "Occupational workers", "Protection from external and internal exposure"],
      },
      {
        group: "Radiation dose",
        items: ["Air kerma", "Absorbed and equivalent dose", "Effective dose", "Diagnostic reference levels"],
      },
    ],
    instructors: [karen],
    image: withBase("/images/courses/radiation-biology.png"),
    legacyPath: "/radiation-biology-safety-dose",
  },
  {
    slug: "ultrasound-physics",
    vignette: "ultrasound-physics",
    title: "Ultrasound Physics",
    kind: "course",
    tag: "Course",
    summary: "Connect transducers, imaging modes, and image quality to the physics behind ultrasound.",
    hero: "Explore how ultrasound images are formed, how B-mode, M-mode, and Doppler imaging work, and how physical factors affect image quality and safety.",
    outcomes: [
      "Explain the role of the transducer in ultrasound imaging.",
      "Describe the basic principles of B-mode, M-mode, and Doppler imaging.",
      "Relate spatial, temporal, and contrast resolution to image quality.",
      "Review common artifacts, bioeffects, and ultrasound safety.",
    ],
    topics: [
      {
        items: [
          "Transducers and real-time B-mode imaging",
          "Reflection and scattering",
          "Spatial, temporal, and contrast resolution",
          "M-mode and Doppler ultrasound",
          "Bioeffects, safety, and the artifact library",
        ],
      },
    ],
    instructors: [karen],
    image: withBase("/images/courses/ultrasound.png"),
    legacyPath: "/ultrasound-physics",
  },
  {
    slug: "mri-basic-physics",
    vignette: "mri-basic-physics",
    title: "Basic MRI Physics",
    kind: "course",
    tag: "Course",
    summary: "Make sense of MR signal, spatial encoding, pulse sequences, and image quality.",
    hero: "Build a foundation in MRI physics, from RF excitation and relaxation to spatial encoding, pulse sequences, and the factors that shape an MR image.",
    outcomes: [
      "Explain the basic processes of signal generation and relaxation.",
      "Follow slice selection, frequency encoding, phase encoding, and k-space.",
      "Compare the principles of spin echo and gradient echo imaging.",
      "Review tissue suppression, image quality, acceleration, and common artifacts.",
    ],
    topics: [
      {
        items: [
          "Basic MRI concepts, the patient in the magnetic field, and RF excitation",
          "Transverse signal loss and T1 relaxation",
          "Pulse sequences, slice selection, and spatial encoding",
          "k-space and Fourier transform",
          "Spin echo, fast spin echo, gradient echo, and tissue suppression",
          "Image quality, faster imaging, and the artifact library",
        ],
      },
    ],
    instructors: [karen, sam],
    image: withBase("/images/courses/mri.png"),
    legacyPath: "/mri-basic-physics",
  },
  {
    slug: "core-physics-practice-questions",
    vignette: "board-review",
    title: "Core Physics Practice Questions",
    kind: "bank",
    tag: "Question bank",
    summary: "A dedicated question bank for focused review of the physics on the ABR Core Exam.",
    hero: "Focus your review on the physics tested on the ABR Core Exam with a dedicated question bank, separate from the quizzes within Sybil’s courses.",
    outcomes: [],
    topics: [],
    instructors: [],
  },
  {
    slug: "radiology-physics-course-bundle",
    vignette: "bundle",
    title: "Radiology Physics Course Bundle",
    kind: "bundle",
    tag: "Bundle",
    summary: "All eight radiology physics courses plus Core Physics Practice Questions, together in one bundle.",
    hero: "Build your understanding across eight radiology physics subjects, with Core Physics Practice Questions included for focused exam review.",
    outcomes: [],
    topics: [],
    instructors: [],
  },
];

export const productBySlug = (slug: string) => courseList.find((c) => c.slug === slug);

export const physicsCourses = courseList.filter((c) => c.kind === "course");
export const questionBank = courseList.find((c) => c.kind === "bank")!;
export const bundle = courseList.find((c) => c.kind === "bundle")!;

/** Canonical path of a product page, base-aware. */
export const productHref = (c: Product) => withBase(`/courses/${c.slug}/`);
