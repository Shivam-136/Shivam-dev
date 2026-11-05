import useChunkReveal from "../hooks/useChunkReveal";
import useSlideReveal from "../hooks/useSlideReveal";
import { experienceEducation } from "../data/profile";
import { FiBriefcase, FiBookOpen, FiCalendar, FiCheckCircle } from "react-icons/fi";

export default function Timeline() {
  const ref = useChunkReveal();
  const listRef = useSlideReveal({ distance: 40 });

  return (
    <section
      id="experience"
      className="py-28 px-6 bg-obsidian-panel/40 border-t border-obsidian-line/40"
    >
      <div ref={ref} className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <p className="eyebrow mb-3">BACKGROUND</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-bone leading-tight tracking-tight">
              Experience &amp; Education
            </h2>
          </div>
          <p className="text-bone-dim text-sm max-w-sm font-body">
            Engineering progression, academic foundation, and milestones achieved along the way.
          </p>
        </div>

        <div ref={listRef} className="relative border-l-2 border-emerald-glow/30 pl-6 sm:pl-8 space-y-10">
          {experienceEducation.map((item, index) => {
            const isEducation = item.type.toLowerCase().includes("education");
            const Icon = isEducation ? FiBookOpen : FiBriefcase;

            return (
              <div
                key={index}
                data-slide-item
                className="relative glass pixel-border rounded-2xl p-6 hover:border-emerald-glow/40 transition-colors"
              >
                {/* Node icon on timeline line */}
                <div className="absolute -left-[37px] sm:-left-[45px] top-6 w-7 h-7 rounded-full bg-obsidian border-2 border-emerald-glow flex items-center justify-center text-emerald-glow shadow-emerald">
                  <Icon size={13} />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-glow bg-emerald-glow/10 border border-emerald-glow/20 px-2.5 py-0.5 rounded-full font-medium">
                    <FiCalendar size={12} />
                    {item.period}
                  </span>
                  <span className="text-[10px] font-pixel text-bone-dim uppercase">
                    {item.type}
                  </span>
                </div>

                <h3 className="font-display text-lg sm:text-xl text-bone font-semibold mb-1">
                  {item.title}
                </h3>
                <p className="text-sm font-body text-diamond/80 mb-3 font-medium">
                  {item.subtitle}
                </p>

                <p className="text-bone-dim text-sm leading-relaxed font-body mb-4">
                  {item.details}
                </p>

                {item.highlights && item.highlights.length > 0 && (
                  <ul className="space-y-1.5 pt-2 border-t border-obsidian-line">
                    {item.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2 text-xs text-bone font-body">
                        <FiCheckCircle className="text-emerald-glow shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}