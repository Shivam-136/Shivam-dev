import { useEffect, useState } from "react";
import { navLinks, profile } from "../data/profile";
import { smoothScrollTo } from "../utils/scroll";

const commands = [
  ...navLinks.map((l) => ({ label: `Go to ${l.label}`, action: () => smoothScrollTo(l.href) })),
  { label: "Open GitHub", action: () => window.open(profile.github, "_blank") },
  { label: "Open LinkedIn", action: () => window.open(profile.linkedin, "_blank") },
  { label: "Download Resume", action: () => window.open(profile.resumeUrl, "_blank") },
];

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!open) return null;

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command search palette"
      className="fixed inset-0 z-[200] bg-obsidian/75 backdrop-blur-sm flex items-start justify-center pt-28 px-4 sm:px-6"
      onClick={onClose}
    >
      <div
        className="glass pixel-border rounded-2xl w-full max-w-lg overflow-hidden shadow-panel border border-obsidian-line"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <input
            autoFocus
            aria-label="Search site commands"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to section..."
            className="w-full bg-transparent px-5 py-4 text-bone outline-none border-b border-obsidian-line placeholder:text-bone-dim font-body text-sm sm:text-base focus:border-diamond/50"
          />
        </div>
        <ul className="max-h-72 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <li className="px-5 py-3 text-sm text-bone-dim font-body">No commands found.</li>
          )}
          {filtered.map((c) => (
            <li key={c.label}>
              <button
                type="button"
                onClick={() => {
                  c.action();
                  onClose();
                }}
                className="w-full text-left px-5 py-3 text-sm text-bone-dim hover:bg-obsidian-alt hover:text-diamond transition-colors flex items-center justify-between font-body focus-visible:outline-none focus-visible:bg-obsidian-alt focus-visible:text-diamond"
              >
                <span>{c.label}</span>
                <span className="text-[10px] font-pixel text-emerald-glow/60">GO</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}