import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useChunkReveal(options = {}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("chunk-revealed");
      return;
    }

    const distance = options.distance || 60;

    // Simple, clean entrance — no clip-path column tearing.
    gsap.set(el, { opacity: 0, x: -distance });

    const items = el.querySelectorAll("[data-chunk-item]");
    if (items.length) gsap.set(items, { opacity: 0, x: -distance * 0.6 });

    let activeTl = null;

    function revealIn() {
      if (activeTl) activeTl.kill();
      el.classList.remove("chunk-revealed");

      activeTl = gsap.timeline();
      activeTl.to(
        el,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          onComplete: () => el.classList.add("chunk-revealed"),
        },
        0
      );

      if (items.length) {
        activeTl.to(
          items,
          { opacity: 1, x: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" },
          0.15
        );
      }
    }

    function revealOut() {
      if (activeTl) activeTl.kill();
      el.classList.remove("chunk-revealed");

      activeTl = gsap.timeline();
      activeTl.to(el, { opacity: 0, x: -distance, duration: 0.4, ease: "power2.in" }, 0);
      if (items.length) {
        activeTl.to(items, { opacity: 0, x: -distance * 0.6, duration: 0.3, ease: "power2.in" }, 0);
      }
    }

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: options.start || "top 82%",
      end: options.end || "bottom 18%",
      onEnter: revealIn,
      onEnterBack: revealIn,
      onLeaveBack: revealOut,
    });

    return () => {
      trigger.kill();
      if (activeTl) activeTl.kill();
    };
  }, [options.start, options.end, options.distance]);

  return ref;
}