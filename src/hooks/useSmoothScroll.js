import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Stop the browser's own instant anchor-jump from fighting Lenis on load
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (window.location.hash) {
      window.scrollTo(0, 0);
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    // Expose globally so Navbar/Footer/CommandPalette/Hero can scroll
    // through Lenis instead of native scrollIntoView/anchor jump.
    window.lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

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

    // Now that Lenis + ScrollTrigger are wired up, honor a deep-link hash
    // (e.g. someone opened /#contact directly) with a real Lenis scroll,
    // once, after layout has settled — never via native jump.
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            lenis.scrollTo(target, { immediate: true });
            ScrollTrigger.refresh();
          }, 50);
        });
      }
    }

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      if (window.lenis === lenis) delete window.lenis;
    };
  }, []);
}