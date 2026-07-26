import useChunkReveal from "../hooks/useChunkReveal";
import MarqueeRow from "./MarqueeRow";
import MiniVoxel3D from "./MiniVoxel3D";
import { skills } from "../data/profile";

const allSkills = [...skills.frontend, ...skills.backend, ...skills.tools];
const rowA = allSkills.filter((_, i) => i % 2 === 0);
const rowB = allSkills.filter((_, i) => i % 2 !== 0);

export default function Skills() {
  const ref = useChunkReveal();

  return (
    <section id="skills" className="relative py-28 bg-obsidian/95 overflow-hidden">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">INVENTORY</p>
            <h2 className="text-xl md:text-3xl font-semibold text-bone leading-relaxed mb-4 tracking-tight">
              Skills &amp; Tools
            </h2>
            <p className="text-bone-dim max-w-xl font-body">
              The stack I reach for when building full-stack, production-ready applications.
            </p>
          </div>
          <MiniVoxel3D className="w-14 h-14 shrink-0 opacity-90 hidden sm:block" top="#8A8A8A" side="#5f5f5f" />
        </div>
      </div>

      <div className="mt-14 space-y-5">
        <MarqueeRow items={rowA} direction="left" speed={45} />
        <MarqueeRow items={rowB} direction="right" speed={45} />
      </div>
    </section>
  );
}