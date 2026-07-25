import { useRef } from "react";
import gsap from "gsap";
import useChunkReveal from "../hooks/useChunkReveal";
import { featuredProject } from "../data/profile";
import { FiExternalLink, FiGithub } from "react-icons/fi";

export default function Projects() {
  const ref = useChunkReveal();
  const cardRef = useRef(null);

  function handleMove(e) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateY: x * 8,
      rotateX: -y * 8,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 900,
    });
  }

  function handleLeave() {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
  }

  return (
    <section id="projects" className="py-28 px-6 bg-obsidian">
      <div ref={ref} className="max-w-5xl mx-auto">
        <p className="eyebrow mb-4">FEATURED PROJECT</p>
        <h2 className="text-xl md:text-3xl font-semibold text-bone leading-relaxed mb-14 tracking-tight">
          Chest #01 — {featuredProject.name}
        </h2>

        <div
          ref={cardRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          data-cursor-hover
          data-chunk-item
          className="glass pixel-border rounded-3xl p-8 md:p-12 shadow-panel [transform-style:preserve-3d]"
        >
          <div className="grid md:grid-cols-[1.1fr_1fr] gap-10 items-start">
            <div style={{ transform: "translateZ(30px)" }}>
              <p className="text-bone-dim leading-relaxed font-body mb-6">
                {featuredProject.description}
              </p>

              <ul className="grid grid-cols-2 gap-2 mb-6">
                {featuredProject.features.map((f) => (
                  <li key={f} className="text-sm text-bone flex items-center gap-2 font-body">
                    <span className="w-1.5 h-1.5 rounded-[2px] bg-diamond shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2 mb-8">
                {featuredProject.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs text-emerald-glow border border-emerald-glow/30 rounded-full px-3 py-1 font-body"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
  <a
    href={featuredProject.live}
    target="_blank"
    rel="noreferrer"
    data-cursor-hover
    className="mc-btn flex items-center gap-2 bg-emerald-glow text-obsidian font-medium px-5 py-2.5"
  >
    Live Demo <FiExternalLink />
  </a>

  <a
    href={featuredProject.repo}
    target="_blank"
    rel="noreferrer"
    data-cursor-hover
    className="mc-btn glass flex items-center gap-2 text-bone px-5 py-2.5"
  >
    <FiGithub />
    GitHub
  </a>
</div>
            </div>

            <div
              style={{ transform: "translateZ(50px)" }}
              className="aspect-video rounded-2xl bg-gradient-to-br from-obsidian-alt to-obsidian-panel border border-obsidian-line flex items-center justify-center overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-grid-glow bg-[size:24px_24px] opacity-30" />
              <p className="relative eyebrow text-diamond/70">NEXA AI</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}