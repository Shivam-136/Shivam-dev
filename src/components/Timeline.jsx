import useChunkReveal from "../hooks/useChunkReveal";
import useSlideReveal from "../hooks/useSlideReveal";
import { timeline } from "../data/profile";

export default function Timeline() {
  const ref = useChunkReveal();
  const listRef = useSlideReveal({ distance: 50 });

  return (
    <section id="timeline" className="py-28 px-6 bg-obsidian-panel/40">
      <div ref={ref} className="max-w-3xl mx-auto">
        <p className="eyebrow mb-4">TIMELINE</p>
        <h2 className="text-xl md:text-3xl font-semibold text-bone leading-relaxed mb-14 tracking-tight">
          How I got here
        </h2>

        <ol ref={listRef} className="relative border-l border-obsidian-line pl-8 space-y-10">
          {timeline.map((t) => (
            <li key={t.phase} data-slide-item className="relative">
              <span className="absolute -left-[38px] top-1 w-4 h-4 rounded-sm bg-emerald-glow shadow-emerald" />
              <h3 className="font-display text-lg text-bone font-semibold mb-1.5">{t.phase}</h3>
              <p className="text-bone-dim text-sm leading-relaxed font-body">{t.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}