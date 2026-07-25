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

    const visibleClip = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
    const hiddenClip =
      "polygon(0 100%, 10% 100%, 10% 0, 20% 0, 20% 100%, 30% 100%, 30% 0, 40% 0, 40% 100%, 50% 100%, 50% 0, 60% 0, 60% 100%, 70% 100%, 70% 0, 80% 0, 80% 100%, 90% 100%, 90% 0, 100% 0, 100% 100%, 0 100%)";

    // Set the hidden state synchronously, before the browser paints —
    // this is what removes the flash/glitch on first mount.
    el.classList.add("chunk-reveal");
    gsap.set(el, { opacity: 0, y: 24, clipPath: hiddenClip });

    const items = el.querySelectorAll("[data-chunk-item]");
    if (items.length) gsap.set(items, { opacity: 0, y: 18, scale: 0.96 });

    let activeTl = null;

    function revealIn() {
      if (activeTl) activeTl.kill();
      el.classList.remove("chunk-revealed");

      activeTl = gsap.timeline();
      activeTl
        .to(el, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0)
        .to(
          el,
          {
            clipPath: visibleClip,
            duration: 0.8,
            ease: "power3.out", // smooth instead of stepped — removes the jerky wipe
            onComplete: () => el.classList.add("chunk-revealed"),
          },
          0
        );

      if (items.length) {
        activeTl.to(
          items,
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" },
          0.25
        );
      }
    }

    function revealOut() {
      if (activeTl) activeTl.kill();
      el.classList.remove("chunk-revealed");

      activeTl = gsap.timeline();
      activeTl.to(el, { opacity: 0, y: 24, clipPath: hiddenClip, duration: 0.4, ease: "power2.in" }, 0);
      if (items.length) {
        activeTl.to(items, { opacity: 0, y: 18, scale: 0.96, duration: 0.3, ease: "power2.in" }, 0);
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
  }, [options.start, options.end]);

  return ref;
}