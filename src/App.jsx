import { useEffect, useState, lazy, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import CustomCursor from "./components/CustomCursor";
import CursorAura from "./components/CursorAura";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Timeline from "./components/Timeline";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CommandPalette from "./components/CommandPalette";
import GlobalClickSound from "./components/GlobalClickSound";
import NotFound from "./components/NotFound";
import useSmoothScroll from "./hooks/useSmoothScroll";

// Lazy-load Three.js ambient scene
const ThreeAmbientBackground = lazy(() =>
  import("./components/ThreeAmbientBackground")
);

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [canLoad3D, setCanLoad3D] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  useSmoothScroll();

  // 404 client route check
  useEffect(() => {
    const path = window.location.pathname;
    if (path && path !== "/" && path !== "/index.html") {
      setIsNotFound(true);
    }
  }, []);

  // Keyboard shortcut for palette
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lazy-load Three.js only after first paint and only on desktop without reduced-motion
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!isMobile && !reducedMotion) {
      // Delay mounting until after critical render
      const timer = setTimeout(() => {
        setCanLoad3D(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  if (isNotFound) {
    return <NotFound />;
  }

  return (
    <>
      {canLoad3D && (
        <Suspense fallback={null}>
          <ThreeAmbientBackground />
        </Suspense>
      )}

      <CustomCursor />
      <CursorAura />

      <GlobalClickSound />

      <Navbar onOpenPalette={() => setPaletteOpen(true)} />

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      {/* Recruiter-ready flow: Hero -> About -> Projects -> Skills -> Experience/Education -> Contact */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Timeline />
        <Contact />
      </main>

      <Footer className="relative z-10" />
    </>
  );
}