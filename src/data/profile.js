export const profile = {
  name: "Shivam Chhanchhan",
  role: "Full Stack Developer",
  tagline: "Crafting Modern Web Experiences with FULL Stack & AI.",
  about:
    "I am a passionate Full Stack Developer specializing in React.js, Redux Toolkit, Tailwind CSS, GSAP, Node.js, Express.js, MongoDB, REST APIs, Authentication Systems, and AI-powered applications. I love building scalable web applications with beautiful UI, smooth animations, secure backend architecture, and excellent user experience.",
  github: "https://github.com/Shivam-136",
  githubUsername: "Shivam-136",
  email: "shivam243028@gmail.com",
  linkedin: "https://www.linkedin.com/in/shivam-chhanchaan-029665362",
  instagram: "https://www.instagram.com/shivamk._13/",
  resumeUrl: "/resume.pdf", // drop your resume file into /public as resume.pdf
};

export const featuredProject = {
  name: "Nexa AI Voice Assistant",
  description:
    "An AI-powered voice assistant with real-time speech recognition, natural text-to-speech responses, and conversational AI — wrapped in a secure, authenticated, fully responsive interface.",
  features: [
    "Speech Recognition",
    "Text To Speech",
    "AI Chat",
    "Google Authentication",
    "Responsive UI",
  ],
  tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "GSAP"],
  live: "https://nexa-voice-assistant-by-shivam.vercel.app/",
  repo: "https://github.com/Shivam-136",
};

export const projects = [
  featuredProject,
  {
    name: "Add your second project",
    description:
      "Replace this with a real project description — what it does, what problem it solves, and what makes it worth looking at.",
    features: ["Feature one", "Feature two", "Feature three"],
    tech: ["React", "Node.js"],
    live: "",
    repo: "",
  },
  {
    name: "Add your third project",
    description:
      "Replace this with a real project description — what it does, what problem it solves, and what makes it worth looking at.",
    features: ["Feature one", "Feature two", "Feature three"],
    tech: ["React", "Node.js"],
    live: "",
    repo: "",
  },
];

export const skills = {
  frontend: [
    "HTML5",
    "CSS3",
    "JavaScript",
    "TypeScript",
    "React",
    "Redux Toolkit",
    "Context API",
    "Tailwind CSS",
    "GSAP",
    "Vite",
  ],
  backend: [
    "Node.js",
    "Express.js",
    "MongoDB",
    "REST API",
    "JWT",
    "Google Authentication",
    "OAuth 2.0",
    "Role Based Auth",
    "Protected Routes",
    "CRUD",
  ],
  tools: ["Git", "GitHub", "VS Code", "Postman", "npm", "Figma", "Vercel"],
};

export const services = [
  {
    title: "Frontend Development",
    desc: "Fast, accessible, pixel-precise interfaces built with React and Tailwind CSS.",
  },
  {
    title: "Backend Development",
    desc: "Scalable Node.js and Express services with clean, maintainable architecture.",
  },
  {
    title: "REST API Development",
    desc: "Well-documented, versioned APIs designed for real client consumption.",
  },
  {
    title: "Authentication Systems",
    desc: "JWT, OAuth 2.0, Google login, and role-based protected routes done securely.",
  },
  {
    title: "Responsive Websites",
    desc: "Interfaces that hold up from a 320px phone to an ultrawide monitor.",
  },
  {
    title: "Database Design",
    desc: "MongoDB schemas modeled around how your app actually queries data.",
  },
  {
    title: "Performance Optimization",
    desc: "Code splitting, lazy loading, and Lighthouse-driven tuning.",
  },
  {
    title: "Deployment",
    desc: "CI-friendly deploys to Vercel with environment-safe configuration.",
  },
];

export const timeline = [
  {
    phase: "Frontend Journey",
    detail: "Started with HTML, CSS and JavaScript fundamentals, then moved into React, component architecture, and state management with Redux Toolkit.",
  },
  {
    phase: "Backend Journey",
    detail: "Learned Node.js and Express, built REST APIs, and connected them to MongoDB with proper schema design.",
  },
  {
    phase: "Authentication",
    detail: "Implemented JWT-based auth, Google OAuth 2.0, and role-based protected routes across full-stack projects.",
  },
  {
    phase: "AI Projects",
    detail: "Built Nexa, an AI voice assistant combining speech recognition, text-to-speech, and conversational AI in a production-ready MERN app.",
  },
  {
    phase: "Deployment",
    detail: "Shipped full-stack applications to Vercel, learning environment configuration and production debugging along the way.",
  },
  {
    phase: "Future Goals",
    detail: "Deepen system design skills, ship more AI-integrated products, and contribute to larger-scale MERN codebases.",
  },
];

export const stats = [
  { value: 20, suffix: "+", label: "Technologies" },
  { value: 15, suffix: "+", label: "Projects" },
  { value: 1000, suffix: "+", label: "Coding Hours" },
  { value: 2, suffix: "+", label: "Years Learning" },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Timeline", href: "#timeline" },
  { label: "Contact", href: "#contact" },
];