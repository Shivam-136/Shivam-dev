import { useRef } from "react";
import gsap from "gsap";
import useChunkReveal from "../hooks/useChunkReveal";
import { projects } from "../data/profile";
import { FiExternalLink, FiGithub, FiUser, FiTrendingUp } from "react-icons/fi";

export default function Projects() {
  const ref = useChunkReveal();

  return (
    <section id="projects" className="py-28 px-6 bg-obsidian/90 border-t border-obsidian-line/40">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <p className="eyebrow mb-3">FEATURED PROJECTS</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-bone leading-tight tracking-tight">
              Selected Engineering Work
            </h2>
          </div>
          <p className="text-bone-dim text-sm max-w-md font-body">
            Production-ready applications demonstrating full-stack architecture, clean UI engineering, and AI integration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id || project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);

  function handleMove(e) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateY: x * 4,
      rotateX: -y * 4,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 900,
    });
  }

  function handleLeave() {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  }

  const isPlaceholder = project.isPlaceholder;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor-hover
      data-chunk-item
      className={`glass pixel-border rounded-2xl flex flex-col overflow-hidden shadow-panel [transform-style:preserve-3d] transition-all ${
        isPlaceholder ? "border-dashed border-obsidian-line opacity-90" : "hover:border-emerald-glow/40"
      }`}
    >
      {/* 8. Screenshot container with aspect ratio to avoid layout shift */}
      <div className="relative w-full aspect-video bg-obsidian-alt overflow-hidden border-b border-obsidian-line">
        <img
          src={project.screenshot}
          alt={`${project.title} screenshot`}
          width="800"
          height="450"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-obsidian/80 backdrop-blur-md px-2.5 py-1 rounded border border-obsidian-line text-[10px] font-pixel text-emerald-glow">
          0{index + 1}
        </div>
        {/* 3. My Role Badge */}
        <div className="absolute top-3 right-3 bg-obsidian/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-glow/30 flex items-center gap-1.5 text-[11px] text-bone font-medium">
          <FiUser className="text-emerald-glow text-xs" />
          <span>{project.role}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between" style={{ transform: "translateZ(10px)" }}>
        <div>
          {/* 1. Title */}
          <h3 className="font-display text-lg text-bone font-semibold mb-2 leading-snug">
            {project.title}
          </h3>

          {/* 2. One-line problem statement */}
          <div className="mb-4">
            <span className="text-[10px] font-pixel uppercase text-emerald-glow/80 block mb-1">
              PROBLEM STATEMENT
            </span>
            <p className="text-bone-dim text-xs sm:text-sm font-body leading-relaxed">
              {project.problemStatement}
            </p>
          </div>

          {/* 5. Key result / impact */}
          <div className="mb-5 p-3 rounded-lg bg-obsidian-alt/70 border border-obsidian-line">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-pixel text-diamond mb-1">
              <FiTrendingUp className="text-xs" />
              <span>KEY RESULT &amp; IMPACT</span>
            </div>
            <p className="text-bone text-xs font-body leading-relaxed">
              {project.keyResult}
            </p>
          </div>

          {/* 4. Tech stack tags */}
          {project.tech?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-[11px] text-emerald-glow/90 bg-emerald-glow/10 border border-emerald-glow/20 rounded-md px-2.5 py-0.5 font-body"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 6. Live Demo button & 7. GitHub button */}
        <div className="mt-auto pt-3 border-t border-obsidian-line flex flex-wrap items-center gap-3">
          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              aria-label={`Open live demo for ${project.title}`}
              className="mc-btn flex-1 flex items-center justify-center gap-1.5 bg-emerald-glow text-obsidian font-semibold px-3 py-2 text-xs rounded hover:bg-diamond transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow"
            >
              <span>Live Demo</span>
              <FiExternalLink size={13} />
            </a>
          ) : (
            <span className="flex-1 py-2 text-center text-xs text-bone-dim/50 border border-dashed border-obsidian-line rounded">
              Demo Coming Soon
            </span>
          )}

          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              aria-label={`Open GitHub repository for ${project.title}`}
              className="mc-btn glass flex items-center justify-center gap-1.5 text-bone px-3.5 py-2 text-xs rounded hover:text-emerald-glow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow"
            >
              <FiGithub size={14} />
              <span>GitHub</span>
            </a>
          ) : isPlaceholder ? (
            <span className="py-2 px-3 text-xs text-bone-dim/50 border border-dashed border-obsidian-line rounded">
              Repo
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}