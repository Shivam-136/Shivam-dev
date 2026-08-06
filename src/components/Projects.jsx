import { useRef } from "react";
import gsap from "gsap";
import useChunkReveal from "../hooks/useChunkReveal";
import { projects } from "../data/profile";
import { FiExternalLink, FiGithub, FiPlusSquare } from "react-icons/fi";

export default function Projects() {
  const ref = useChunkReveal();

  const liveProjects = projects.filter((p) => !p.isPlaceholder);

  return (
    <section id="projects" className="py-28 px-6 bg-obsidian/90">
      <div ref={ref} className="max-w-6xl mx-auto">
        <p className="eyebrow mb-4">FEATURED PROJECTS</p>
        <h2 className="text-xl md:text-3xl font-semibold text-bone leading-relaxed mb-14 tracking-tight">
          Chests I've opened
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {liveProjects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}

          {/* Placeholder slot rendered as an honest "more coming" card
              instead of hiding it or showing fake content. */}
          <ComingSoonCard index={liveProjects.length} />
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
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
  }

  const hasLinks = Boolean(project.live || project.repo);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor-hover
      data-chunk-item
      className="glass pixel-border rounded-2xl p-5 shadow-panel [transform-style:preserve-3d] flex flex-col"
    >
      <div style={{ transform: "translateZ(20px)" }} className="flex items-center gap-2 mb-3">
        <span className="eyebrow !text-emerald-glow/60 !text-[9px] shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="h-px flex-1 bg-obsidian-line" />
      </div>

      <div style={{ transform: "translateZ(20px)" }} className="flex-1 flex flex-col">
        <h3 className="font-display text-base text-bone font-semibold mb-2">{project.name}</h3>

        <p className="text-bone-dim leading-relaxed font-body mb-3 text-xs line-clamp-2">
          {project.description}
        </p>

        {project.tech?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech.slice(0, 5).map((t) => (
              <span
                key={t}
                className="text-[10px] text-emerald-glow border border-emerald-glow/30 rounded-full px-2 py-0.5 font-body"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex gap-2">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="mc-btn flex items-center gap-1.5 bg-emerald-glow text-obsidian font-medium px-3.5 py-2 text-xs"
            >
              Live Demo <FiExternalLink size={14} />
            </a>
          )}

          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="mc-btn glass flex items-center gap-1.5 text-bone px-3.5 py-2 text-xs"
            >
              <FiGithub size={14} />
              GitHub
            </a>
          )}

          {!hasLinks && (
            <p className="text-xs text-bone-dim/60 font-body italic">
              Links coming soon
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Honest "more on the way" slot — dashed border, muted tone, no fake
// project name/description. Reads as intentional, not unfinished.
function ComingSoonCard({ index }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col items-center justify-center text-center min-h-[200px] border-2 border-dashed border-obsidian-line bg-obsidian-alt/20"
      style={{ borderRadius: "3px" }}
    >
      <FiPlusSquare size={22} className="text-bone-dim/50 mb-3" />
      <p className="eyebrow !text-bone-dim/50 !text-[9px] mb-2">
        {String(index + 1).padStart(2, "0")}
      </p>
      <p className="text-bone-dim/70 text-sm font-body font-medium mb-1">
        New project incoming
      </p>
      <p className="text-bone-dim/40 text-xs font-body">
        Currently building something worth showing.
      </p>
    </div>
  );
}