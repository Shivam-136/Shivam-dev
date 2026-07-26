import useChunkReveal from "../hooks/useChunkReveal";
import useSlideReveal from "../hooks/useSlideReveal";
import { services } from "../data/profile";

export default function Services() {
  const ref = useChunkReveal();
  const gridRef = useSlideReveal();

  return (
    <section id="services" className="py-28 px-6 bg-obsidian-panel/60">
      <div ref={ref} className="max-w-6xl mx-auto">
        <p className="eyebrow mb-4">SERVICES</p>
        <h2 className="text-xl md:text-3xl font-semibold text-bone leading-relaxed mb-14 tracking-tight">
          What I build
        </h2>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <div
              key={s.title}
              data-slide-item
              data-slide-dir={i % 4 < 2 ? "left" : "right"}
              data-cursor-hover
              className="group glass pixel-border rounded-2xl p-6 hover:shadow-emerald transition-all hover:-translate-y-1"
            >
              <span className="eyebrow !text-emerald-glow/60">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-lg text-bone mt-4 mb-2 font-semibold">{s.title}</h3>
              <p className="text-sm text-bone-dim font-body leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}