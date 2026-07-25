import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Wires Lenis smooth scrolling into GSAP's ticker AND tells ScrollTrigger
 * to read scroll position from Lenis instead of the native scrollTop —
 * otherwise every scrollTrigger (Hero parallax, chunk-reveal, Statistics
 * counters) drifts out of sync with what the user actually sees.
 */
export default function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    // Keep ScrollTrigger in sync with Lenis's virtual scroll position
    lenis.on("scroll", ScrollTrigger.update);

    function raf(time) {
      lenis.raf(time * 1000); // Lenis expects ms, gsap ticker gives seconds
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Let ScrollTrigger drive/scroll through Lenis instead of native scrollTo
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.animatedScroll || window.scrollY;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    ScrollTrigger.addEventListener("refresh", () => lenis.resize());
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}