import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import LoginScreen from "./components/LoginScreen";
import CustomCursor from "./components/CustomCursor";
import CursorAura from "./components/CursorAura";
import ThreeAmbientBackground from "./components/ThreeAmbientBackground";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Timeline from "./components/Timeline";
import Statistics from "./components/Statistics";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CommandPalette from "./components/CommandPalette";
import GlobalClickSound from "./components/GlobalClickSound";
import useSmoothScroll from "./hooks/useSmoothScroll";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useSmoothScroll();

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

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "auto";
  }, [loading]);

  return (
    <>
      {loading && <LoginScreen onDone={() => setLoading(false)} />}

      {/* Sitewide, quiet — sits behind every section. Everything else
          (main, Navbar, Footer) needs `relative z-10` (or higher) so it
          stacks above this, which is already true for this codebase's
          .glass / section backgrounds. */}
      <ThreeAmbientBackground />

      <CustomCursor />
      <CursorAura />

      <GlobalClickSound />

      <Navbar onOpenPalette={() => setPaletteOpen(true)} />

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Services />
        <Projects />
        <Timeline />
        <Statistics />
        <Contact />
      </main>

      <Footer className="relative z-10" />
    </>
  );
}