import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useSlideReveal(options = {}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = el.querySelectorAll("[data-slide-item]");
    if (!items.length) return;

    const distance = options.distance || 70;
    const triggers = [];
    const activeTweens = new Map();

    items.forEach((item, i) => {
      const dir = item.dataset.slideDir || (i % 2 === 0 ? "left" : "right");
      const fromX = dir === "left" ? -distance : distance;

      // synchronous hidden state — no flash before scroll trigger fires
      gsap.set(item, { opacity: 0, x: fromX });

      function animateTo(opacity, x, ease) {
        const prev = activeTweens.get(item);
        if (prev) prev.kill();
        const tween = gsap.to(item, { opacity, x, duration: opacity ? 0.6 : 0.45, ease });
        activeTweens.set(item, tween);
      }

      const trigger = ScrollTrigger.create({
        trigger: item,
        start: options.start || "top 85%",
        end: options.end || "bottom 15%",
        onEnter: () => animateTo(1, 0, "power2.out"),
        onEnterBack: () => animateTo(1, 0, "power2.out"),
        onLeaveBack: () => animateTo(0, fromX, "power2.in"),
      });

      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
      activeTweens.forEach((tw) => tw.kill());
    };
  }, [options.start, options.end, options.distance]);

  return ref;
}