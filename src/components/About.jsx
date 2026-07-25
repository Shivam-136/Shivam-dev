import useChunkReveal from "../hooks/useChunkReveal";
import useSlideReveal from "../hooks/useSlideReveal";
import { profile } from "../data/profile";

export default function About() {
  const ref = useChunkReveal();
  const cardsRef = useSlideReveal();

  return (
    <section id="about" className="relative py-28 px-6 bg-obsidian">
      <div ref={ref} className="max-w-4xl mx-auto">
        <p className="eyebrow mb-4">ABOUT</p>
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