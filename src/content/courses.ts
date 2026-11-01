// Product catalogue: the single source for the homepage cards and dialogs,
// the /courses/ catalog, and every product detail page.
//
// Copy follows the complete-website brief (Nov 1, 2026), adapted from the
// course pages on sybildigitallearning.com. Topic outlines describe coverage,
// not a module count or sequence: the current LMS inventory hasn't been
// reconciled, so no module counts or total hours are published.
//
// Enrollment: no purchase flow has been verified yet, so every product uses
// the contact inquiry mode. Switch a product to `checkout` only once its SKU,
// price, access term, payment and entitlement have been tested end to end.
import { withBase } from "../lib/base";

export type InstructorId = "karen-brown" | "sam-einstein";

export type Enrollment =
  | { mode: "inquiry" }
  | { mode: "checkout"; url: string; price: string; access: string };

type ProductBase = {
  slug: string;
  title: string;
  // Card summary; also the start of the page's meta description.
  summary: string;
  hero: string;
  sourceUrl: string;
  enrollment: Enrollment;
};

export type Course = ProductBase & {
  kind: "course";
  image: string;
  outcomes: string[];
  topics: string[];
  instructors: InstructorId[];
};

export type QuestionBank = ProductBase & { kind: "bank" };
export type Bundle = ProductBase & { kind: "bundle" };
export type Product = Course | QuestionBank | Bundle;

const inquiry: Enrollment = { mode: "inquiry" };

// Karen's catalogue order.
export const courseList: Course[] = [
  {
    kind: "course",
    slug: "radiography-physics",
    title: "Radiography Physics",
    summary: "Understand how X-rays become images—and what influences image quality and radiation dose.",
    hero: "Build your understanding of X-ray production, image formation, detectors, and radiation safety through focused radiography physics lessons.",
    image: withBase("/images/courses/radiography.png"),
    sourceUrl: "https://sybildigitallearning.com/radiography-physics/",
    outcomes: [
      "Explain how X-rays are produced and how beam quality and quantity are controlled.",
      "Connect geometry, scatter, and detector performance to image quality.",
      "Recognize the physical causes of common radiographic artifacts.",
      "Review exposure control and the principles of radiation dose and safety.",
    ],
    topics: [
      "X-ray production, focal spot size, and anode angle",
      "Magnification, geometric blur, and beam quality and quantity",
      "Image formation, scattered radiation, and scatter management",
      "Automatic exposure control and radiographic detectors",
      "Image quality, artifacts, radiation dose, and safety",
    ],
    instructors: ["karen-brown"],
    enrollment: inquiry,
  },
  {
    kind: "course",
    slug: "mammography-physics",
    title: "Mammography Physics",
    summary: "Understand mammographic image formation, tomosynthesis, image quality, and dose.",
    hero: "Explore the physics of mammography and digital breast tomosynthesis, from X-ray production and compression to image quality, quality control, and radiation dose.",
    image: withBase("/images/courses/mammography.png"),
    sourceUrl: "https://sybildigitallearning.com/mammography-physics/",
    outcomes: [
      "Explain the roles of target/filter combinations and the mammography X-ray tube.",
      "Describe compression, collimation, detectors, grids, and exposure control.",
      "Review magnification and the basic principles of digital breast tomosynthesis.",
      "Connect average glandular dose, quality control, and artifacts to mammographic imaging.",
    ],
    topics: [
      "Introduction, target/filter combinations, and the mammography X-ray tube",
      "Collimation, compression, grid, detector, and automatic exposure control",
      "Magnification mammography and average glandular dose",
      "Digital breast tomosynthesis: introduction, principles, and comparison with 2D imaging",
      "Quality control and artifacts",
    ],
    instructors: ["karen-brown"],
    enrollment: inquiry,
  },
  {
    kind: "course",
    slug: "fluoroscopy-physics",
    title: "Fluoroscopy Physics",
    summary: "Connect fluoroscopic image formation with exposure control and dose management.",
    hero: "Understand fluoroscopy systems and operating modes, with focused coverage of image formation, exposure-rate control, and radiation dose for patients and operators.",
    image: withBase("/images/courses/fluoroscopy.png"),
    sourceUrl: "https://sybildigitallearning.com/fluoroscopy-physics/",
    outcomes: [
      "Describe fluoroscopic systems, flat-panel detectors, and image intensifiers.",
      "Explain automatic exposure-rate control and electronic magnification.",
      "Compare fluoroscopic and fluorographic modes of operation.",
      "Review patient dose monitoring and dose management for patients and operators.",
    ],
    topics: [
      "Introduction and fluoroscopic imaging systems",
      "Flat-panel detectors and image intensifiers",
      "Automatic exposure-rate control and electronic magnification",
      "Fluoroscopy and fluorography operating modes",
      "Patient dose monitoring, patient dose management, and operator dose management",
    ],
    instructors: ["karen-brown"],
    enrollment: inquiry,
  },
  {
    kind: "course",
    slug: "ct-physics",
    title: "CT Physics",
    summary: "Understand how CT acquisition and reconstruction shape images, artifacts, and dose.",
    hero: "Explore the CT imaging chain, from the X-ray tube and detector array to reconstruction, image quality, radiation dose, and common artifacts.",
    image: withBase("/images/courses/ct.png"),
    sourceUrl: "https://sybildigitallearning.com/ct-physics/",
    outcomes: [
      "Describe the main components of a CT system and their roles.",
      "Explain image formation, CT numbers, and acquisition modes.",
      "Connect acquisition and reconstruction parameters to the resulting image.",
      "Review dose, artifacts, dual-energy CT, and CT fluoroscopy concepts.",
    ],
    topics: [
      "System overview, X-ray tube, filtration, detectors, and collimation",
      "Image formation, CT numbers, and helical and axial acquisition",
      "Tube current modulation and acquisition parameters",
      "Reconstruction parameters, CT dose, and artifacts",
      "Dual-energy CT and CT fluoroscopy",
    ],
    instructors: ["karen-brown"],
    enrollment: inquiry,
  },
  {
    kind: "course",
    slug: "nuclear-medicine",
    title: "Nuclear Medicine Physics",
    summary: "Explore radioactive decay, imaging instrumentation, and the physics of SPECT and PET.",
    hero: "Follow nuclear medicine physics from radionuclides and radiation measurement to image formation, image quality, and common artifacts.",
    image: withBase("/images/courses/nuclear-medicine.png"),
    sourceUrl: "https://sybildigitallearning.com/nuclear-medicine/",
    outcomes: [
      "Explain principles of radioactive decay, activity, and half-life.",
      "Describe the roles of radiation measurement and imaging instrumentation.",
      "Connect SPECT and PET imaging principles to image quality.",
      "Review quality-control concepts and common imaging artifacts.",
    ],
    // Broad coverage only until the current LMS inventory is reconciled.
    topics: [
      "Nuclides, nuclear stability, decay processes, activity, and half-life",
      "Radionuclide production and generators",
      "Radiation instrumentation, ionization chambers, and scintillation detectors",
      "Gamma cameras, collimation, and SPECT imaging",
      "Quality control, PET, reconstruction, artifacts, and quantitative imaging",
    ],
    instructors: ["karen-brown"],
    enrollment: inquiry,
  },
  {
    kind: "course",
    slug: "radiation-biology-safety-dose",
    title: "Radiation Biology, Safety, and Dose",
    summary: "Understand biological effects, radiation protection, and the dose quantities used in imaging.",
    hero: "Connect the biological effects of radiation with protection principles and the dose quantities used to describe exposure in medical imaging.",
    image: withBase("/images/courses/radiation-biology.png"),
    sourceUrl: "https://sybildigitallearning.com/radiation-biology-safety-dose/",
    outcomes: [
      "Describe mechanisms of cellular damage and biological effects.",
      "Distinguish tissue effects, stochastic effects, and effects on development.",
      "Review radiation protection for the public and occupational workers.",
      "Explain air kerma, absorbed dose, equivalent dose, effective dose, and diagnostic reference levels.",
    ],
    // Three groups, as on the source page.
    topics: [
      "Radiation biology: cellular interactions, tissue effects, stochastic effects, and teratogenic effects",
      "Radiation protection: background radiation, the public, occupational workers, and protection from external and internal exposure",
      "Radiation dose: air kerma, absorbed and equivalent dose, effective dose, and diagnostic reference levels",
    ],
    instructors: ["karen-brown"],
    enrollment: inquiry,
  },
  {
    kind: "course",
    slug: "ultrasound-physics",
    title: "Ultrasound Physics",
    summary: "Connect transducers, imaging modes, and image quality to the physics behind ultrasound.",
    hero: "Explore how ultrasound images are formed, how B-mode, M-mode, and Doppler imaging work, and how physical factors affect image quality and safety.",
    image: withBase("/images/courses/ultrasound.png"),
    sourceUrl: "https://sybildigitallearning.com/ultrasound-physics/",
    outcomes: [
      "Explain the role of the transducer in ultrasound imaging.",
      "Describe the basic principles of B-mode, M-mode, and Doppler imaging.",
      "Relate spatial, temporal, and contrast resolution to image quality.",
      "Review common artifacts, bioeffects, and ultrasound safety.",
    ],
    topics: [
      "Transducers and real-time B-mode imaging",
      "Reflection and scattering",
      "Spatial, temporal, and contrast resolution",
      "M-mode and Doppler ultrasound",
      "Bioeffects, safety, and the artifact library",
    ],
    instructors: ["karen-brown"],
    enrollment: inquiry,
  },
  {
    kind: "course",
    slug: "mri-basic-physics",
    title: "Basic MRI Physics",
    summary: "Make sense of MR signal, spatial encoding, pulse sequences, and image quality.",
    hero: "Build a foundation in MRI physics, from RF excitation and relaxation to spatial encoding, pulse sequences, and the factors that shape an MR image.",
    image: withBase("/images/courses/mri.png"),
    sourceUrl: "https://sybildigitallearning.com/mri-basic-physics/",
    outcomes: [
      "Explain the basic processes of signal generation and relaxation.",
      "Follow slice selection, frequency encoding, phase encoding, and k-space.",
      "Compare the principles of spin echo and gradient echo imaging.",
      "Review tissue suppression, image quality, acceleration, and common artifacts.",
    ],
    topics: [
      "Basic MRI concepts, the patient in the magnetic field, and RF excitation",
      "Transverse signal loss and T1 relaxation",
      "Pulse sequences, slice selection, and spatial encoding",
      "k-space and Fourier transform",
      "Spin echo, fast spin echo, gradient echo, and tissue suppression",
      "Image quality, faster imaging, and the artifact library",
    ],
    instructors: ["karen-brown", "sam-einstein"],
    enrollment: inquiry,
  },
];

export const questionBank: QuestionBank = {
  kind: "bank",
  slug: "core-physics-practice-questions",
  title: "Core Physics Practice Questions",
  summary: "A dedicated question bank for focused review of the physics on the ABR Core Exam.",
  hero: "Focus your review on the physics tested on the ABR Core Exam with a dedicated question bank, separate from the quizzes within Sybil’s courses.",
  sourceUrl: "https://sybildigitallearning.com/",
  enrollment: inquiry,
};

export const bundle: Bundle = {
  kind: "bundle",
  slug: "radiology-physics-course-bundle",
  title: "Radiology Physics Course Bundle",
  summary: "All eight radiology physics courses, with Core Physics Practice Questions included.",
  hero: "Build your understanding across eight radiology physics subjects, with Core Physics Practice Questions included for focused exam review.",
  sourceUrl: "https://sybildigitallearning.com/",
  enrollment: inquiry,
};

export const products: Product[] = [...courseList, questionBank, bundle];

export const productLabel = { course: "Course", bank: "Question bank", bundle: "Bundle" } as const;

export const productHref = (p: Pick<Product, "slug">) => withBase(`/courses/${p.slug}/`);

// Contact link that opens the form in the right mode. Only known slugs are
// accepted by the form, so the parameter can't inject arbitrary text.
export const enrollInquiryHref = (p: Pick<Product, "slug">) =>
  withBase(`/contact/?intent=individual&course=${p.slug}#contact-form`);
