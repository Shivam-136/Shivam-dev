import { useEffect, useState } from "react";
import { navLinks, profile } from "../data/profile";
import { FiCommand, FiVolume2, FiVolumeX, FiMenu, FiX } from "react-icons/fi";
import { isMuted, toggleMuted, onMuteChange } from "../utils/sound";
import { smoothScrollTo } from "../utils/scroll";

export default function Navbar({ onOpenPalette }) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMutedState] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Scroll depth & progress bar
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrollTop = h.scrollTop || document.body.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      setScrolled(scrollTop > 24);
      setProgress(height > 0 ? (scrollTop / height) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section scroll spy
  useEffect(() => {
    const sectionIds = ["hero", ...navLinks.map((l) => l.href.replace("#", ""))];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0.1,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setMutedState(isMuted());
    const unsubscribe = onMuteChange(setMutedState);
    return unsubscribe;
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function handleMobileLink(href) {
    setMobileOpen(false);
    smoothScrollTo(href);
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* Scroll indicator */}
      <div className="h-[2px] bg-obsidian-line">
        <div
          className="h-full bg-gradient-to-r from-emerald-glow via-diamond to-emerald-glow transition-[width] duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <nav
        aria-label="Main Navigation"
        className={`mx-auto max-w-6xl flex items-center justify-between px-5 md:px-8 transition-all duration-300 ${
          scrolled
            ? "mt-3 glass rounded-2xl py-3 shadow-panel border border-obsidian-line/80"
            : "py-5"
        }`}
      >
        {/* Brand logo (Semantic span / anchor, not H1 to maintain single H1 hierarchy) */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            smoothScrollTo("#hero");
          }}
          data-cursor-hover
          className="group flex items-center gap-1.5 font-bold tracking-tight text-base sm:text-lg whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow rounded-md px-1"
        >
          <span className="text-bone group-hover:text-white transition-colors">
            {profile.name.split(" ")[0]}
          </span>
          <span className="text-emerald-glow">.dev</span>
        </a>

        {/* Desktop navigation with active-section indicator */}
        <ul className="hidden md:flex items-center gap-1 text-sm font-body">
          {navLinks.map((l) => {
            const sectionId = l.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScrollTo(l.href);
                  }}
                  data-cursor-hover
                  className={`relative px-3.5 py-1.5 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow ${
                    isActive
                      ? "text-emerald-glow font-medium bg-emerald-glow/10"
                      : "text-bone-dim hover:text-bone hover:bg-obsidian-alt/60"
                  }`}
                >
                  {l.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-[2px] bg-emerald-glow rounded-full" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Action icons (Sound, Command Palette, Mobile Menu) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-cursor-hover
            data-no-sound
            onClick={() => toggleMuted()}
            aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
            title={muted ? "Sound: Off" : "Sound: On"}
            className="flex items-center justify-center text-bone-dim border border-obsidian-line rounded-lg w-9 h-9 hover:border-diamond/50 hover:text-diamond transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow"
          >
            {muted ? <FiVolumeX className="text-base" /> : <FiVolume2 className="text-base" />}
          </button>

          <button
            type="button"
            onClick={onOpenPalette}
            data-cursor-hover
            aria-label="Open command palette"
            className="hidden sm:flex items-center gap-2 text-xs text-bone-dim border border-obsidian-line rounded-lg px-3 py-2 hover:border-diamond/50 hover:text-diamond transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow"
          >
            <FiCommand className="text-sm" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline text-[10px] bg-obsidian-alt px-1.5 py-0.5 rounded border border-obsidian-line text-bone-dim">
              Ctrl K
            </kbd>
          </button>

          {/* Mobile search trigger */}
          <button
            type="button"
            onClick={onOpenPalette}
            data-cursor-hover
            aria-label="Open quick search"
            className="sm:hidden flex items-center justify-center text-bone-dim border border-obsidian-line rounded-lg w-9 h-9 hover:border-diamond/50 hover:text-diamond transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow"
          >
            <FiCommand className="text-base" />
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            data-cursor-hover
            data-no-sound
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="md:hidden flex items-center justify-center text-bone-dim border border-obsidian-line rounded-lg w-9 h-9 hover:border-diamond/50 hover:text-diamond transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow"
          >
            {mobileOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 top-0 z-40 bg-obsidian/85 backdrop-blur-md"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="glass pixel-border mx-4 mt-24 rounded-2xl p-5 flex flex-col gap-2 text-bone font-body shadow-panel border border-obsidian-line"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="eyebrow px-3 mb-1 text-[9px]">NAVIGATION</p>
            {navLinks.map((l) => {
              const sectionId = l.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMobileLink(l.href);
                  }}
                  data-cursor-hover
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-base transition-colors ${
                    isActive
                      ? "bg-emerald-glow/15 text-emerald-glow font-semibold"
                      : "text-bone-dim hover:bg-obsidian-alt hover:text-bone"
                  }`}
                >
                  <span>{l.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-emerald-glow" />}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}