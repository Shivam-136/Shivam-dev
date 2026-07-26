import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useChunkReveal from "../hooks/useChunkReveal";
import useSlideReveal from "../hooks/useSlideReveal";
import { stats } from "../data/profile";

gsap.registerPlugin(ScrollTrigger);

export default function Statistics() {
  const ref = useChunkReveal();
  const gridRef = useSlideReveal({ distance: 40 });
  const numRefs = useRef([]);

  useEffect(() => {
    const triggers = numRefs.current.map((el, i) => {
      if (!el) return null;
      const target = stats[i].value;
      const counter = { val: 0 };
      return ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () =>
          gsap.to(counter, {
            val: target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => (el.textContent = Math.floor(counter.val).toLocaleString()),
          }),
      });
    });
    return () => triggers.forEach((t) => t?.kill());
  }, []);

  return (
    <section className="py-28 px-6 bg-obsidian/90">
      <div ref={ref} className="max-w-5xl mx-auto">
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={s.label} data-slide-item className="glass pixel-border rounded-2xl py-8">
              <p className="font-display text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-glow to-diamond">
                <span ref={(el) => (numRefs.current[i] = el)}>0</span>
                {s.suffix}
              </p>
              <p className="text-bone-dim text-sm mt-2 font-body">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}