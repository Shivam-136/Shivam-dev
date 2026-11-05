import { SITE_CONFIG } from "../config/site";

/**
 * Flag to show or hide cards/sections with [ADD ...] placeholders.
 * Set to false for production deployments so nothing unfinished renders.
 * Set to true when you want to view placeholder reminders while editing.
 */
export const showPlaceholders = false;

// Check if resume.pdf is available for download
export const resumeAvailable = true;

const rawProfile = {
  name: SITE_CONFIG.name,
  role: SITE_CONFIG.role,
  tagline:
    "I build high-performance, full-stack web applications and AI-powered tools for modern startups and teams.",
  aboutLines: [
    "I am a Full Stack Developer specializing in the MERN stack (MongoDB, Express.js, React, Node.js) with a passion for clean UI engineering and robust backend systems.",
    "I engineer web applications end-to-end — from database modeling and secure RESTful API architecture to responsive, accessible client interfaces.",
    "Driven by modern technology, I also integrate real-time AI and speech recognition models into practical user-facing applications.",
    "My focus is on writing maintainable code that scales, delivers measurable impact, and respects the end user's attention.",
  ],
  photoUrl: "/avatar-placeholder.webp", // Replace with /photo.jpg or your headshot
  github: SITE_CONFIG.github,
  githubUsername: SITE_CONFIG.githubUsername,
  email: SITE_CONFIG.email,
  linkedin: SITE_CONFIG.linkedin,
  instagram: SITE_CONFIG.instagram,
  resumeUrl: SITE_CONFIG.resumeUrl,
};

const rawProjects = [
  {
    id: "nexa",
    title: "Nexa AI Voice Assistant",
    problemStatement:
      "Traditional web applications lack hands-free accessibility and natural conversational voice feedback.",
    role: "Full Stack Developer",
    tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "GSAP"],
    keyResult: showPlaceholders
      ? "Engineered real-time speech recognition with conversational AI responses and secure authentication [ADD REAL RESULT HERE: e.g. tested with 200+ speech queries, sub-1.2s round-trip response]."
      : "Engineered real-time speech recognition with conversational AI responses, secure JWT authentication, and interactive audio visualization.",
    live: "https://nexa-voice-assistant-by-shivam.vercel.app/",
    repo: "https://github.com/Shivam-136",
    screenshot: "/projects/nexa.webp",
    featured: true,
  },
  {
    id: "soundscapes",
    title: "Soundscapes Audio Platform",
    problemStatement:
      "Creators and remote workers need a lightweight, responsive audio studio to mix ambient rooms and stream custom audio live.",
    role: "Frontend Engineer",
    tech: ["HTML5", "CSS3", "JavaScript", "Web Audio API"],
    keyResult: showPlaceholders
      ? "Engineered an interactive soundboard and room mixer with zero-dependency low-latency audio playback [ADD REAL RESULT HERE: e.g. sub-50ms playback latency across 12 simultaneous audio tracks]."
      : "Engineered an interactive soundboard and multi-channel room mixer with zero-dependency low-latency audio playback.",
    live: "https://soundscape-landing-page-navy.vercel.app/",
    repo: "https://github.com/Shivam-136/soundscape-landing-page",
    screenshot: "/projects/soundscapes.webp",
    featured: true,
  },
  {
    id: "project-three",
    title: "[ADD PROJECT 3 TITLE: e.g., DevTask SaaS / Full Stack MERN App]",
    problemStatement:
      "[ADD ONE-LINE PROBLEM STATEMENT: e.g., Developers and teams struggle to manage sprint tasks across distributed workspaces.]",
    role: "Full Stack Developer",
    tech: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
    keyResult:
      "[ADD REAL RESULT HERE: e.g., Built end-to-end CRUD with JWT auth, reducing task update sync latency by 40%].",
    live: "",
    repo: "https://github.com/Shivam-136",
    screenshot: "/projects/placeholder.webp",
    isPlaceholder: true,
  },
];

export const skillCategories = [
  {
    title: "Frontend",
    categoryKey: "frontend",
    skills: [
      "React",
      "JavaScript (ES6+)",
      "TypeScript",
      "Tailwind CSS",
      "Redux Toolkit",
      "Context API",
      "HTML5",
      "CSS3",
      "GSAP",
      "Vite",
    ],
  },
  {
    title: "Backend",
    categoryKey: "backend",
    skills: [
      "Node.js",
      "Express.js",
      "RESTful APIs",
      "JWT Authentication",
      "OAuth 2.0 / Google Auth",
      "Protected Routes & RBAC",
      "CRUD Architecture",
    ],
  },
  {
    title: "Database",
    categoryKey: "database",
    skills: [
      "MongoDB",
      "Mongoose ODM",
      "Database Schema Design",
      "Query Optimization",
      "Data Indexing",
    ],
  },
  {
    title: "Tools / DevOps",
    categoryKey: "tools",
    skills: [
      "Git",
      "GitHub",
      "Vercel",
      "Postman",
      "VS Code",
      "npm",
      "Figma",
      "Performance Tuning",
    ],
  },
  {
    title: "AI & Voice",
    categoryKey: "ai",
    skills: [
      "Speech Recognition API",
      "Text-to-Speech (TTS)",
      "LLM / Conversational AI",
      "Prompt Engineering",
      "AI Interface Design",
    ],
  },
];

export const allSkillsList = skillCategories.flatMap((c) => c.skills);

const rawExperienceEducation = [
  {
    period: "2024 — Present",
    type: "Experience & Projects",
    title: "Full Stack & AI Application Development",
    subtitle: "Independent & Open Source Development",
    details:
      "Architected full-stack applications with React, Node.js, Express, and MongoDB. Built and deployed Nexa AI Voice Assistant integrating speech recognition, text-to-speech, and responsive interfaces to Vercel.",
    highlights: [
      "Full MERN stack implementation with secure authentication",
      "Real-time voice & speech recognition integration",
      "Production-ready deployment & performance tuning",
    ],
  },
  {
    period: "2023 — 2024",
    type: "Journey Milestone",
    title: "Backend Engineering & API Design",
    subtitle: "Node.js, Express, MongoDB & Authentication Systems",
    details:
      "Deep-dived into backend architecture, building scalable RESTful APIs, implementing JWT auth, Google OAuth 2.0, role-based access control, and robust database schemas.",
    highlights: [
      "Designed CRUD endpoints and relational document schemas",
      "Secure credential handling and protected route middleware",
      "API testing and documentation with Postman",
    ],
  },
  {
    period: "[ADD YOUR GRADUATION YEAR: e.g., 2021 — 2025]",
    type: "Education",
    title: "[ADD DEGREE: e.g., Bachelor of Technology / Computer Science]",
    subtitle: "[ADD INSTITUTION / UNIVERSITY NAME HERE]",
    details:
      "[ADD DETAILS: e.g., Relevant Coursework: Data Structures & Algorithms, Database Management Systems, Computer Networks, Operating Systems, Web Technologies.]",
    highlights: [
      "[ADD GPA OR KEY ACADEMIC HIGHLIGHT HERE]",
      "Strong foundation in core computer science principles and software engineering",
    ],
    isPlaceholder: true,
  },
];

export const stats = [
  { value: 20, suffix: "+", label: "Technologies Mastered" },
  { value: 15, suffix: "+", label: "Projects Completed" },
  { value: 1000, suffix: "+", label: "Hours of Code" },
  { value: 2, suffix: "+", label: "Years Experience & Learning" },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

function hasPlaceholder(str) {
  return typeof str === "string" && str.includes("[ADD ");
}

// Exported filtered data honoring showPlaceholders
export const profile = rawProfile;

export const projects = showPlaceholders
  ? rawProjects
  : rawProjects.filter(
      (p) => !p.isPlaceholder && !hasPlaceholder(p.title) && !hasPlaceholder(p.problemStatement)
    );

export const experienceEducation = showPlaceholders
  ? rawExperienceEducation
  : rawExperienceEducation.filter(
      (e) => !e.isPlaceholder && !hasPlaceholder(e.title) && !hasPlaceholder(e.period)
    );