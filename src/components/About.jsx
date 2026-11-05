import { useState } from "react";
import useChunkReveal from "../hooks/useChunkReveal";
import useSlideReveal from "../hooks/useSlideReveal";
import { profile, stats, showPlaceholders } from "../data/profile";
import MiniVoxel3D from "./MiniVoxel3D";
import { FiCamera, FiExternalLink } from "react-icons/fi";

export default function About() {
  const ref = useChunkReveal();
  const cardsRef = useSlideReveal();
  const [imgError, setImgError] = useState(false);

  return (
    <section id="about" className="relative py-28 px-6 bg-obsidian/95 border-t border-obsidian-line/40">
      <div ref={ref} className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between gap-6 mb-4">
          <p className="eyebrow">ABOUT ME</p>
          <MiniVoxel3D
            className="w-12 h-12 shrink-0 opacity-90"
            top="#5EEAD4"
            side="#2b8f80"
            spin="slow"
          />
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-bone leading-tight mb-10 tracking-tight">
          Engineering scalable web apps block by block.
        </h2>

        {/* Grid: Photo placeholder + 3-4 genuine bio lines */}
        <div className="grid md:grid-cols-12 gap-8 items-start mb-14">
          {/* Photo Slot */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="relative group w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden glass pixel-border border-2 border-emerald-glow/40 shadow-panel">
              {!imgError ? (
                <img
                  src={profile.photoUrl}
                  alt="Shivam Chhanchhan — Full Stack Developer"
                  width="224"
                  height="224"
                  loading="lazy"
                  decoding="async"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-obsidian-alt">
                  <FiCamera className="text-3xl text-emerald-glow mb-2" />
                  <p className="text-xs text-bone font-medium">[ADD PHOTO HERE]</p>
                  <p className="text-[10px] text-bone-dim mt-1">/public/photo.jpg</p>
                </div>
              )}

              {/* Photo badge overlay */}
              <div className="absolute bottom-2 inset-x-2 bg-obsidian/85 backdrop-blur-sm py-1 px-2 rounded text-center border border-obsidian-line">
                <span className="text-[10px] text-emerald-glow font-body font-medium">
                  {profile.name}
                </span>
              </div>
            </div>

            {showPlaceholders && (
              <p className="text-[11px] text-bone-dim/70 text-center mt-3 max-w-[200px]">
                Drop photo in <code className="text-emerald-glow">/public/photo.jpg</code>
              </p>
            )}
          </div>

          {/* 3-4 Genuine Lines */}
          <div className="md:col-span-8 flex flex-col justify-center space-y-4">
            {profile.aboutLines.map((line, idx) => (
              <p
                key={idx}
                className="text-bone-dim text-base sm:text-lg leading-relaxed font-body"
              >
                {line}
              </p>
            ))}

            <div className="pt-2 flex flex-wrap items-center gap-4 text-sm font-body">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="inline-flex items-center gap-1.5 text-emerald-glow hover:text-diamond transition-colors font-medium underline underline-offset-4"
              >
                GitHub Profile <FiExternalLink size={14} />
              </a>
              <span className="text-bone-dim/40">•</span>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="inline-flex items-center gap-1.5 text-emerald-glow hover:text-diamond transition-colors font-medium underline underline-offset-4"
              >
                LinkedIn Profile <FiExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Recruiter impact stats directly in About */}
        <div ref={cardsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              data-slide-item
              className="glass pixel-border rounded-xl p-5 text-center hover:border-emerald-glow/50 transition-colors"
            >
              <p className="font-display text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-glow to-diamond">
                {s.value}
                {s.suffix}
              </p>
              <p className="text-bone-dim text-xs mt-1.5 font-body leading-tight">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}