import { useEffect, useState } from "react";
import { navLinks } from "../data/profile";
import { FiCommand, FiVolume2, FiVolumeX } from "react-icons/fi";
import { isMuted, toggleMuted, onMuteChange } from "../utils/sound";

export default function Navbar({ onOpenPalette }) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMutedState] = useState(false);

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

  useEffect(() => {
    setMutedState(isMuted());
    const unsubscribe = onMuteChange(setMutedState);
    return unsubscribe;
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="h-[2px] bg-obsidian-line">
        <div
          className="h-full bg-gradient-to-r from-emerald-glow to-diamond transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      <nav
        className={`mx-auto max-w-6xl flex items-center justify-between px-5 md:px-8 transition-all duration-300 ${
          scrolled ? "mt-3 glass rounded-2xl py-3 shadow-panel" : "py-5"
        }`}
      >
       <h1 className="font-bold tracking-tight">
  <span className="text-bone">Shivam</span>
  <span className="text-emerald-glow">.dev</span>
</h1>

        <ul className="hidden md:flex items-center gap-7 text-sm text-bone-dim font-body">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-diamond transition-colors" data-cursor-hover>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-cursor-hover
            data-no-sound
            onClick={() => toggleMuted()}
            aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
            title={muted ? "Sound: Off" : "Sound: On"}
            className="flex items-center justify-center text-bone-dim border border-obsidian-line rounded-lg w-9 h-9 hover:border-diamond/50 hover:text-diamond transition-colors"
          >
            {muted ? <FiVolumeX className="text-sm" /> : <FiVolume2 className="text-sm" />}
          </button>

          <button
            onClick={onOpenPalette}
            data-cursor-hover
            className="flex items-center gap-2 text-xs text-bone-dim border border-obsidian-line rounded-lg px-3 py-2 hover:border-diamond/50 hover:text-diamond transition-colors"
          >
            <FiCommand className="text-sm" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline text-[10px] bg-obsidian-alt px-1.5 py-0.5 rounded border border-obsidian-line">
              Ctrl K
            </kbd>
          </button>
        </div>
      </nav>
    </header>
  );
}