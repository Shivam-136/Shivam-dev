import useChunkReveal from "../hooks/useChunkReveal";
import useSlideReveal from "../hooks/useSlideReveal";
import { profile } from "../data/profile";
import MiniVoxel3D from "./MiniVoxel3D";

export default function About() {
  const ref = useChunkReveal();
  const cardsRef = useSlideReveal();

  return (
    <section id="about" className="relative py-28 px-6 bg-obsidian/95">
      <div ref={ref} className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between gap-6 mb-4">
          <p className="eyebrow">ABOUT</p>
          {/* one quiet 3D touch per section, not a wall of them — this is
              the only voxel accent on this section, sized small and tucked
              at the edge so it reads as texture, not a centerpiece */}
          <MiniVoxel3D className="w-14 h-14 shrink-0 opacity-90" top="#5EEAD4" side="#2b8f80" spin="slow" />
        </div>

        <h2 className="text-xl md:text-3xl font-semibold text-bone leading-relaxed mb-8 tracking-tight">
          The developer behind the world
        </h2>

        <p className="text-bone-dim text-lg leading-relaxed font-body max-w-3xl">
          {profile.about}
        </p>

        <div ref={cardsRef} className="mt-12 grid sm:grid-cols-2 gap-5">
          <InfoCard data-slide-item label="Currently Learning" value="Advanced system design & AI-integrated backend architecture" />
          <InfoCard data-slide-item label="Career Goal" value="Ship production-grade full-stack products used by real people" />
          <InfoCard data-slide-item label="Philosophy" value="Clean, reusable code with UI that respects the user's attention" />
          <InfoCard data-slide-item label="Base Stack" value="React, Redux Toolkit, Node.js, Express, MongoDB" />
        </div>
      </div>
    </section>
  );
}

function InfoCard({ label, value, ...rest }) {
  return (
    <div {...rest} className="glass pixel-border rounded-2xl p-6 hover:shadow-emerald transition-shadow">
      <p className="text-xs uppercase tracking-wider text-emerald-glow mb-2 font-medium">{label}</p>
      <p className="text-bone font-body">{value}</p>
    </div>
  );
}