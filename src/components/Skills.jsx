import useChunkReveal from "../hooks/useChunkReveal";
import MarqueeRow from "./MarqueeRow";
import { skills } from "../data/profile";

const allSkills = [...skills.frontend, ...skills.backend, ...skills.tools];
const rowA = allSkills.filter((_, i) => i % 2 === 0);
const rowB = allSkills.filter((_, i) => i % 2 !== 0);

export default function Skills() {
  const ref = useChunkReveal();

  return (
    <section id="skills" className="relative py-28 bg-obsidian overflow-hidden">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <p className="eyebrow mb-4">INVENTORY</p>
        <h2 className="text-xl md:text-3xl font-semibold text-bone leading-relaxed mb-4 tracking-tight">
          Skills &amp; Tools
        </h2>
        <p className="text-bone-dim max-w-xl font-body">
          The stack I reach for when building full-stack, production-ready applications.
        </p>
      </div>

      <div className="mt-14 space-y-5">
        <MarqueeRow items={rowA} direction="left" speed={45} />
        <MarqueeRow items={rowB} direction="right" speed={45} />
      </div>
    </section>
  );
}