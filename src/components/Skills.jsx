import { useState } from "react";
import useChunkReveal from "../hooks/useChunkReveal";
import MarqueeRow from "./MarqueeRow";
import MiniVoxel3D from "./MiniVoxel3D";
import { skillCategories, allSkillsList } from "../data/profile";
import { techIcons, defaultTechIcon } from "../data/techIcons";

const rowA = allSkillsList.filter((_, i) => i % 2 === 0);
const rowB = allSkillsList.filter((_, i) => i % 2 !== 0);

export default function Skills() {
  const ref = useChunkReveal();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const displayedCategories =
    selectedCategory === "all"
      ? skillCategories
      : skillCategories.filter((c) => c.categoryKey === selectedCategory);

  return (
    <section id="skills" className="relative py-28 bg-obsidian/95 border-t border-obsidian-line/40 overflow-hidden">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10">
          <div>
            <p className="eyebrow mb-3">TECHNICAL INVENTORY</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-bone leading-tight tracking-tight">
              Skills &amp; Technology Stack
            </h2>
            <p className="text-bone-dim text-sm max-w-xl font-body mt-2">
              Grouped by core engineering domain. Every tool listed is actively used to build, secure, and deploy full-stack applications.
            </p>
          </div>
          <MiniVoxel3D
            className="w-12 h-12 shrink-0 opacity-90 hidden sm:block"
            top="#8A8A8A"
            side="#5f5f5f"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            type="button"
            data-cursor-hover
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow ${
              selectedCategory === "all"
                ? "bg-emerald-glow text-obsidian font-semibold shadow-emerald"
                : "glass text-bone-dim hover:text-bone hover:border-emerald-glow/40"
            }`}
          >
            All Categories ({skillCategories.length})
          </button>
          {skillCategories.map((cat) => (
            <button
              key={cat.categoryKey}
              type="button"
              data-cursor-hover
              onClick={() => setSelectedCategory(cat.categoryKey)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow ${
                selectedCategory === cat.categoryKey
                  ? "bg-emerald-glow text-obsidian font-semibold shadow-emerald"
                  : "glass text-bone-dim hover:text-bone hover:border-emerald-glow/40"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Grouped Category Cards (No percentage bars) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCategories.map((category) => (
            <div
              key={category.categoryKey}
              data-chunk-item
              className="glass pixel-border rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-glow/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-obsidian-line pb-3">
                  <h3 className="font-display text-base font-semibold text-bone flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-glow" />
                    {category.title}
                  </h3>
                  <span className="text-[10px] font-pixel text-emerald-glow/80">
                    {category.skills.length} TOOLS
                  </span>
                </div>

                {/* Skill Badges */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skillName) => {
                    const tech = techIcons[skillName] || defaultTechIcon;
                    const Icon = tech.icon;
                    return (
                      <div
                        key={skillName}
                        className="inline-flex items-center gap-2 bg-obsidian-alt/80 border border-obsidian-line hover:border-emerald-glow/40 rounded-lg px-3 py-1.5 transition-colors group"
                      >
                        <Icon size={14} style={{ color: tech.color }} />
                        <span className="text-xs text-bone-dim group-hover:text-bone font-body font-medium">
                          {skillName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Marquee ticker */}
      <div className="mt-16 space-y-4">
        <MarqueeRow items={rowA} direction="left" speed={50} />
        <MarqueeRow items={rowB} direction="right" speed={50} />
      </div>
    </section>
  );
}