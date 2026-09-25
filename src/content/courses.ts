// Course catalogue. Everything below is carried over from the course pages on
// sybildigitallearning.com (descriptions, learning outcomes, module lists,
// durations, instructors) plus the ratings and student counts shown on its
// homepage tiles. Card blurbs for the five subjects in the reviewed homepage
// copy are that copy; the other three are drafted from each course's own
// outcomes and marked for Karen to confirm.
import { withBase } from "../lib/base";

export type CourseInfo = {
  slug: string;
  title: string;
  tag: string;
  blurb: string;
  image?: string;
  url: string;
  enrollUrl: string;
  rating?: string;
  students?: number;
  description: string[];
  learn: string[];
  modules: string[];
  features: string[];
  duration?: string;
  requirements: string[];
  instructors: { name: string; bio: string }[];
};

export const courseList: CourseInfo[] = [
  {
    slug: "radiography-physics",
    title: "Radiography Physics",
    tag: "Course",
    blurb: "Build your understanding of radiography concepts as part of your radiology board preparation.",
    image: withBase("/images/courses/radiography.png"),
    url: "https://sybildigitallearning.com/radiography-physics/",
    // TODO: point at the platform's own checkout once Phase 2 ships; for now the current course page.
    enrollUrl: "https://sybildigitallearning.com/radiography-physics/",
    rating: "4.8",
    students: 166,
    description: ["This course was designed for Radiology residents and other medical professionals such as x-ray technologists, medical students, and physicists studying Radiography Physics. The course is also a great refresher for physicians who want to brush up on radiographic imaging principles."],
    learn: ["Principles of image formation","Factors that affect image quality","Common Artifacts","Effective and Safe Use of Equipment."],
    modules: ["Introduction","Module 1: Making X-rays","Module 2: Focal Spot Size & Anode Angle","Module 3: Magnification & Geometric Blur","Module 4: X-ray Beam Quality","Module 5: X-ray Beam Quantity","Module 6: Image Formation","Module 7: Scattered Radiation","Module 8: Managing Scatter","Module 9: Automatic Exposure Control","Module 10: Radiographic Detectors","Module 11: Image Quality","Module 12: Artifacts","Module 13: Radiation Dose & Safety."],
    features: ["Short, focused topical videos","State of the art video animations","Access to course instructor","On-demand content","Engaging questions","Clinically relevant examples."],
    duration: "3 hours total · 10–15 minutes per module",
    requirements: ["A desire to learn","A quiet spot or headphones."],
    instructors: [{"name":"Karen Brown","bio":"Ms. Brown is a Diagnostic Imaging Physicist for Penn State College of Medicine. She is Certified in Radiological Physics by the American Board of Radiology (ABR) and in Health Physics by the American Board of Health Physics (ABHP)."}],
  },
  {
    slug: "ultrasound-physics",
    title: "Ultrasound Physics",
    tag: "Course",
    blurb: "How transducers work, B-mode, M-mode and Doppler imaging, the factors that shape image quality, and bioeffects and safety.",
    image: withBase("/images/courses/ultrasound.png"),
    url: "https://sybildigitallearning.com/ultrasound-physics/",
    // TODO: point at the platform's own checkout once Phase 2 ships; for now the current course page.
    enrollUrl: "https://sybildigitallearning.com/ultrasound-physics/",
    rating: "4.8",
    students: 176,
    description: ["This course was designed for Radiology residents and other medical professionals such as x-ray technologists, medical students, and physicists studying Ultrasound Physics. The course is also a great refresher for physicians who want to brush up on Ultrasound imaging principles."],
    learn: ["How an Ultrasound transducer works","Basic principles of B-mode, M-mode, and Doppler Imaging","Factors that affect Image Quality","Bioeffects and Safety."],
    modules: ["Module 1 – Transducers","Module 2 – Basics of Real Time B-Mode Imaging","Module 3 – Reflection and Scattering","Module 4 – Spatial Resolution in Ultrasound","Module 5 – Temporal Resolution in US","Module 6 – Contrast Resolution in US","Module 7 – M-Mode","Module 8 – Doppler Ultrasound","Module 9 – Ultrasound Bioeffects and Safety","Artifact Library."],
    features: ["Short, focused topical videos","State of the art video animations","Access to course instructor","On-demand content","Engaging questions","Clinically relevant examples."],
    duration: "3 hours total · 10–15 minutes per module",
    requirements: ["A desire to learn","A quiet spot or headphones."],
    instructors: [{"name":"Karen Brown","bio":"Ms. Brown is a Diagnostic Imaging Physicist for Penn State College of Medicine. She is Certified in Radiological Physics by the American Board of Radiology (ABR) and in Health Physics by the American Board of Health Physics (ABHP)."}],
  },
  {
    slug: "nuclear-medicine",
    title: "Nuclear Medicine Physics",
    tag: "Course",
    blurb: "Study nuclear medicine concepts through on-demand course lessons.",
    image: withBase("/images/courses/nuclear-medicine.png"),
    url: "https://sybildigitallearning.com/nuclear-medicine/",
    // TODO: point at the platform's own checkout once Phase 2 ships; for now the current course page.
    enrollUrl: "https://sybildigitallearning.com/nuclear-medicine/",
    rating: "4.7",
    students: 48,
    description: ["This course was designed for Radiology residents and other medical professionals such as x-ray technologists, medical students, and physicists studying NM Physics. The course is also a great refresher for physicians who want to brush up on NM imaging principles."],
    learn: ["Principles of radioactive decay and measurements","Factors that affect image quality","Common Artifacts."],
    modules: ["Module 1: Nuclides","Module 2: Nuclear Stability","Module 3: Alpha Decay","Module 4: Beta Minus Decay","Module 5: Beta Plus Decay","Module 6: Electron Capture","Module 7: Isomeric Transition","Module 8: Activity and Half Life","Module 9: Radionuclide Production","Module 10: Radionuclide generators","Module 11: Instrumentation","Module 12: Ionization Chambers","Module 13: Dose calibrator QC","Module 14: Geiger Counters","Module 15: Scintillation Detectors","Module 16: The Gamma Camera","Module 17: The Photomultiplier Tube Array","Module 18: The Collimator","Module 19: SPECT Imaging","Module 20: Gamma Camera Quality Control","Module 21: SPECT Quality Control","Module 22: PET Imaging","Module 23: Time of Flight & 3D PET","Module 24: PET Spatial Resolution","Module 25: Image Reconstruction","Module 26: PET CT Artifacts","Module 27: Quantitative PET."],
    features: ["Short, focused topical video lectures","State of the art video graphics","Access to course instructor","On-demand content","Engaging questions","Clinically relevant examples."],
    duration: "6 hours total · 10–15 minutes per module",
    requirements: ["A desire to learn","A quiet spot or headphones."],
    instructors: [{"name":"Karen Brown","bio":"Ms. Brown is a Diagnostic Imaging Physicist for Penn State College of Medicine. She is Certified in Radiological Physics by the American Board of Radiology (ABR) and in Health Physics by the American Board of Health Physics (ABHP)."}],
  },
  {
    slug: "mri-basic-physics",
    title: "MRI Physics",
    tag: "Course",
    blurb: "From putting the patient in the magnet to k-space, pulse sequences, tissue suppression and image quality.",
    image: withBase("/images/courses/mri.png"),
    url: "https://sybildigitallearning.com/mri-basic-physics/",
    // TODO: point at the platform's own checkout once Phase 2 ships; for now the current course page.
    enrollUrl: "https://sybildigitallearning.com/mri-basic-physics/",
    rating: "4.7",
    students: 67,
    description: ["This course was designed for Radiology residents and other medical professionals such as x-ray technologists, medical students, and physicists studying MRI Physics. The course is also a great refresher for physicians who want to brush up on MRI imaging principles."],
    learn: ["Principles of image formation","Factors that affect image quality","Common Artifacts","Effective and Safe Use of Equipment."],
    modules: ["Module 1: Basics","Module 2: Putting the Patient in the MRI","Module 3: What Happens When RF Energy Is Applied","Module 4: Loss of Transverse Signal","Module 5: T1 Relaxation","Module 6: Pulse Sequence Basics and Selecting Slices","Module 7: Frequency Encoding","Module 8: Phase Encoding","Module 9: k-Space and Fourier Transform","Module 10: Spin Echo Sequences","Module 11: Fast Spin Echo Sequences","Module 12: GRE Imaging Sequences","Module 13: Tissue Suppression","Module 14: Image Quality","Module 15: Speeding Things Up!","Artifact Library."],
    features: ["Short, focused topical videos","State of the art video animations","Access to course instructor","On-demand content","Engaging questions","Clinically relevant examples."],
    duration: "5 hours total · 10–15 minutes per module",
    requirements: ["A desire to learn","A quiet spot or headphones."],
    instructors: [{"name":"Karen Brown","bio":"Ms. Brown is a Diagnostic Imaging Physicist for Penn State College of Medicine. She is Certified in Radiological Physics by the American Board of Radiology (ABR) and in Health Physics by the American Board of Health Physics (ABHP)."},{"name":"Sam Einstein","bio":"Dr. Einstein is an Assistant Professor of Radiology at Penn State College of Medicine in Hershey, Pennsylvania. He is certified in Diagnostic Medical Physics by the American Board of Radiology and as an MR Safety Expert by the American Board of MR Safety."}],
  },
  {
    slug: "ct-physics",
    title: "Computed Tomography Physics",
    tag: "Course",
    blurb: "Study CT concepts through on-demand lessons that fit around your clinical responsibilities.",
    image: withBase("/images/courses/ct.png"),
    url: "https://sybildigitallearning.com/ct-physics/",
    // TODO: point at the platform's own checkout once Phase 2 ships; for now the current course page.
    enrollUrl: "https://sybildigitallearning.com/ct-physics/",
    rating: "4.6",
    students: 47,
    description: ["This course was designed for Radiology residents and other medical professionals such as x-ray technologists, medical students, and physicists studying CT Physics. The course is also a great refresher for physicians who want to brush up on CT imaging principles."],
    learn: ["Principles of image formation","Factors that affect image quality","Common Artifacts","Effective and Safe Use of Equipment."],
    modules: ["Module 1: CT System Overview","Module 2: The Xray Tube and Filtration","Module 3: The Detector Array and Collimation","Module 4: Image Formation and CT Number","Module 5: Helical and Axial Acquisiiton Modes","Module 6: Tube Current Modulation","Module 7: CT Acquisition Parameters","Module 8: CT Reconstruction Parameters","Module 9: CT Dose","Module 10: CT Artifacts","Module 11: Dual Energy CT","Module 12: CT Fluoroscopy."],
    features: ["Short, focused topical video lectures","State of the art graphics","Access to course instructor","On-demand content","Engaging questions","Clinically relevant examples."],
    duration: "4 hours total · 10–15 minutes per module",
    requirements: ["A desire to learn","A quiet spot or headphones."],
    instructors: [{"name":"Karen Brown","bio":"Ms. Brown is a Diagnostic Imaging Physicist for Penn State College of Medicine. She is Certified in Radiological Physics by the American Board of Radiology (ABR) and in Health Physics by the American Board of Health Physics (ABHP)."}],
  },
  {
    slug: "fluoroscopy-physics",
    title: "Fluoroscopy Physics",
    tag: "Course",
    blurb: "Develop your understanding of fluoroscopy with lessons organized for focused study and review.",
    image: withBase("/images/courses/fluoroscopy.png"),
    url: "https://sybildigitallearning.com/fluoroscopy-physics/",
    // TODO: point at the platform's own checkout once Phase 2 ships; for now the current course page.
    enrollUrl: "https://sybildigitallearning.com/fluoroscopy-physics/",
    rating: "4.6",
    students: 62,
    description: ["This course was designed for Radiology residents and other medical professionals such as x-ray technologists, medical students, and physicists studying Fluoroscopy Physics. The course is also a great refresher for physicians who want to brush up on Fluoroscopy imaging principles."],
    learn: ["Principles of image formation","Factors that affect image quality","Common Artifacts","Effective and Safe Use of Equipment."],
    modules: ["Module 1: Intro to Fluoroscopy","Module 2: Fluoroscopy Imaging Systems","Module 3: Flat Panel Detectors","Module 4: Image Intensifiers","Module 5: Automatic Exposure Rate Control","Module 6: Electronic Magnification","Module 7: Fluoroscopic Modes of Operation","Module 8: Fluorography Modes of Operation","Module 9: Patient Dose Monitoring","Module 10: Patient Dose Management","Module 11: Operator Dose Management."],
    features: ["Short, focused topical video lectures","State of the art graphics","Access to course instructor","On-demand content","Engaging questions","Clinically relevant examples."],
    duration: "3 hours total · 10–15 minutes per module",
    requirements: ["A desire to learn","A quiet spot or headphones."],
    instructors: [{"name":"Karen Brown","bio":"Ms. Brown is a Diagnostic Imaging Physicist for Penn State College of Medicine. She is Certified in Radiological Physics by the American Board of Radiology (ABR) and in Health Physics by the American Board of Health Physics (ABHP)."}],
  },
  {
    slug: "mammography-physics",
    title: "Mammography Physics",
    tag: "Course",
    blurb: "Work through mammography concepts with focused lessons you can revisit as you study.",
    image: withBase("/images/courses/mammography.png"),
    url: "https://sybildigitallearning.com/mammography-physics/",
    // TODO: point at the platform's own checkout once Phase 2 ships; for now the current course page.
    enrollUrl: "https://sybildigitallearning.com/mammography-physics/",
    rating: "4.7",
    students: 62,
    description: ["This course was designed for Radiology residents and other medical professionals such as x-ray technologists, medical students, and physicists studying Mammography Physics. The course is also a great refresher for physicians who want to brush up on mammographic imaging principles."],
    learn: ["Principles of image formation","Factors that affect image quality","Common Artifacts","Effective and Safe Use of Equipment."],
    modules: ["Module 1: Intro to Mammography","Module 2: Target Filter Combinations","Module 3: The Mammography Xray Tube","Module 4: Collimation and Compression","Module 5: The Grid Detector & AEC","Module 6: Magnification Mammography","Module 7: Average Glandular Dose","Module 8: Introduction to Digital Breast Tomosynthesis","Module 9: DBT Imaging Principles","Module 10: DBT vs 2D","Module 11: Quality Control","Module 12: Artifacts."],
    features: ["Short, focused topical video lectures","State of the art graphics","Access to course instructor","On-demand content","Engaging questions","Clinically relevant examples."],
    duration: "3 hours total · 10–15 minutes per module",
    requirements: ["A desire to learn","A quiet spot or headphones."],
    instructors: [{"name":"Karen Brown","bio":"Ms. Brown is a Diagnostic Imaging Physicist for Penn State College of Medicine. She is Certified in Radiological Physics by the American Board of Radiology (ABR) and in Health Physics by the American Board of Health Physics (ABHP)."}],
  },
  {
    slug: "radiation-biology-safety-dose",
    title: "Radiation Biology, Safety, & Dose",
    tag: "Course",
    blurb: "Mechanisms of biological damage, types of effects, radiation protection principles, and dose metrics and units.",
    image: withBase("/images/courses/radiation-biology.png"),
    url: "https://sybildigitallearning.com/radiation-biology-safety-dose/",
    // TODO: point at the platform's own checkout once Phase 2 ships; for now the current course page.
    enrollUrl: "https://sybildigitallearning.com/radiation-biology-safety-dose/",
    rating: "4.8",
    students: 35,
    description: ["This course was designed for Radiology residents and other medical professionals such as x-ray technologists, medical students, and physicists studying Radiation Physics. The course is also a great refresher for physicians who want to brush up on basic principles."],
    learn: ["Mechanisms of Biological Damage","Types of Biological Effects","Radiation Protection Principles","Radiation Dose Metrics & Units."],
    modules: ["Module 1 - Cellular Interactions","Module 2 - Tissue Effects","Module 3 - Stochastic Effect","Module 4 - Teratogenic Effect","Module 1 - Background Radiation","Module 2 - Members of the Public","Module 3 - Occupational Workers","Module 4 - Protection from External & Internal Exposure","Module 1 - Air Kerma","Module 2 - Absorbed & Equivalent Dose","Module 3 - Effective Dose","Module 4 - Diagnostic Reference Levels."],
    features: ["Short, focused topical video lectures","State of the art video graphics","Access to course instructor","On-demand content","Engaging questions","Clinically relevant examples."],
    duration: "3 hours total · 10–15 minutes per module",
    requirements: ["A desire to learn","A quiet spot or headphones."],
    instructors: [{"name":"Karen Brown","bio":"Ms. Brown is a Diagnostic Imaging Physicist for Penn State College of Medicine. She is Certified in Radiological Physics by the American Board of Radiology (ABR) and in Health Physics by the American Board of Health Physics (ABHP)."}],
  },
  {
    slug: "board-review",
    title: "Board Review Questions",
    tag: "Question bank",
    blurb: "Review what you have learned with a question bank for radiology board preparation.",
    url: "https://sybildigitallearning.com/",
    // TODO: point at the platform once Board Review Questions is sold there.
    enrollUrl: "https://sybildigitallearning.com/",
    description: ["Over 300 exam-style questions for radiology board preparation. Practice beyond the lessons, review the questions you missed, and return to them as you study."],
    learn: [],
    modules: [],
    features: ["300+ exam-style questions", "Included with the full course bundle", "Available on its own."],
    requirements: [],
    instructors: [],
  },
];
