import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Attach to a section's background grid/texture element so it drifts
 * slightly as the section scrolls through the viewport — gives the
 * "terrain moving past" feel without affecting foreground content.
 */
export default function useParallaxBG(distance = 60) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.fromTo(
      el,
      { y: -distance },
      {
        y: distance,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("section") || el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      }
    );

    return () => tween.scrollTrigger?.kill();
  }, [distance]);

  return ref;
}