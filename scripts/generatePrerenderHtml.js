import {
  profile,
  projects,
  skillCategories,
  experienceEducation,
  showPlaceholders,
} from "../src/data/profile.js";

export function generatePrerenderHtml() {
  const visibleProjects = showPlaceholders
    ? projects
    : projects.filter((p) => !p.isPlaceholder);

  const visibleExp = showPlaceholders
    ? experienceEducation
    : experienceEducation.filter((e) => !e.isPlaceholder);

  const projectsHtml = visibleProjects
    .map(
      (p) => `
        <article style="margin-bottom: 2rem; border-bottom: 1px solid rgba(236,243,236,0.1); padding-bottom: 1.5rem;">
          <h3 style="font-size: 1.3rem; color: #34D399; margin-bottom: 0.25rem;">${p.title}</h3>
          <p style="color: #9BAA9C; font-size: 0.9rem; margin-bottom: 0.5rem;">Role: ${p.role}</p>
          <p style="color: #ECF3EC; margin: 0.5rem 0; line-height: 1.5;">${p.problemStatement}</p>
          <p style="color: #5EEAD4; font-size: 0.9rem; margin: 0.5rem 0;">Key Impact: ${p.keyResult}</p>
          <p style="color: #9BAA9C; font-size: 0.85rem;">Tech Stack: ${p.tech.join(", ")}</p>
          <div style="margin-top: 0.75rem;">
            ${p.live ? `<a href="${p.live}" style="color: #34D399; margin-right: 1rem; text-decoration: underline;">Live Demo</a>` : ""}
            ${p.repo ? `<a href="${p.repo}" style="color: #ECF3EC; text-decoration: underline;">GitHub Repository</a>` : ""}
          </div>
        </article>`
    )
    .join("\n");

  const skillsHtml = skillCategories
    .map(
      (c) =>
        `<li style="margin-bottom: 0.5rem;"><strong style="color: #34D399;">${c.title}:</strong> <span style="color: #9BAA9C;">${c.skills.join(", ")}</span></li>`
    )
    .join("\n");

  const expHtml = visibleExp
    .map(
      (e) => `
        <div style="margin-bottom: 1.5rem;">
          <span style="color: #34D399; font-size: 0.85rem;">${e.period} (${e.type})</span>
          <h3 style="font-size: 1.15rem; color: #ECF3EC; margin: 0.25rem 0;">${e.title}</h3>
          <p style="color: #5EEAD4; font-size: 0.9rem; margin-bottom: 0.5rem;">${e.subtitle}</p>
          <p style="color: #9BAA9C; font-size: 0.95rem; line-height: 1.5;">${e.details}</p>
        </div>`
    )
    .join("\n");

  const aboutLinesHtml = profile.aboutLines
    .map(
      (line) =>
        `<p style="color: #9BAA9C; line-height: 1.6; margin-bottom: 1rem;">${line}</p>`
    )
    .join("\n");

  return `      <header style="padding: 20px; text-align: center;">
        <span style="font-weight: 700; font-size: 1.25rem; color: #ECF3EC;">${profile.name.split(" ")[0]}<span style="color: #34D399;">.dev</span></span>
      </header>
      <main style="max-width: 900px; margin: 0 auto; padding: 2rem 1.5rem;">
        <section id="hero" style="text-align: center; padding: 4rem 0;">
          <p style="text-transform: uppercase; color: #34D399; letter-spacing: 2px; font-size: 0.9rem;">${profile.role}</p>
          <h1 style="font-size: 2.75rem; margin: 1rem 0; color: #ECF3EC;">${profile.name}</h1>
          <p style="font-size: 1.2rem; color: #9BAA9C; max-width: 650px; margin: 0 auto 2rem; line-height: 1.6;">
            ${profile.tagline}
          </p>
          <div>
            <a href="#projects" style="display: inline-block; background: #34D399; color: #0A0D0B; padding: 12px 24px; text-decoration: none; font-weight: 600; margin-right: 12px; border-radius: 4px;">View Projects</a>
            <a href="/resume.pdf" style="display: inline-block; border: 1px solid #34D399; color: #34D399; padding: 12px 24px; text-decoration: none; font-weight: 600; border-radius: 4px;">Download Resume</a>
          </div>
        </section>

        <section id="about" style="padding: 3rem 0; border-top: 1px solid rgba(236,243,236,0.1);">
          <h2 style="font-size: 1.8rem; color: #ECF3EC; margin-bottom: 1.5rem;">About Shivam</h2>
          ${aboutLinesHtml}
        </section>

        <section id="projects" style="padding: 3rem 0; border-top: 1px solid rgba(236,243,236,0.1);">
          <h2 style="font-size: 1.8rem; color: #ECF3EC; margin-bottom: 2rem;">Featured Projects</h2>
          ${projectsHtml}
        </section>

        <section id="skills" style="padding: 3rem 0; border-top: 1px solid rgba(236,243,236,0.1);">
          <h2 style="font-size: 1.8rem; color: #ECF3EC; margin-bottom: 1.5rem;">Technical Inventory &amp; Skills</h2>
          <ul style="list-style: none; padding: 0;">
            ${skillsHtml}
          </ul>
        </section>

        <section id="experience" style="padding: 3rem 0; border-top: 1px solid rgba(236,243,236,0.1);">
          <h2 style="font-size: 1.8rem; color: #ECF3EC; margin-bottom: 2rem;">Experience &amp; Education</h2>
          ${expHtml}
        </section>

        <section id="contact" style="padding: 3rem 0; border-top: 1px solid rgba(236,243,236,0.1);">
          <h2 style="font-size: 1.8rem; color: #ECF3EC; margin-bottom: 1rem;">Contact &amp; Connect</h2>
          <p style="color: #9BAA9C; margin-bottom: 0.5rem;">
            Email: <a href="mailto:${profile.email}" style="color: #34D399;">${profile.email}</a>
          </p>
          <p style="color: #9BAA9C; margin-bottom: 0.5rem;">
            GitHub: <a href="${profile.github}" style="color: #34D399;">${profile.github}</a>
          </p>
          <p style="color: #9BAA9C;">
            LinkedIn: <a href="${profile.linkedin}" style="color: #34D399;">${profile.linkedin}</a>
          </p>
        </section>
      </main>
      <footer style="text-align: center; padding: 2rem; border-top: 1px solid rgba(236,243,236,0.1); color: #9BAA9C; font-size: 0.85rem;">
        &copy; ${new Date().getFullYear()} ${profile.name}. All rights reserved.
      </footer>`;
}
