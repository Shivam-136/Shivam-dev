import { useEffect, useState } from "react";
import { navLinks, profile } from "../data/profile";
import { smoothScrollTo } from "../utils/scroll";

const commands = [
  ...navLinks.map((l) => ({ label: `Go to ${l.label}`, action: () => smoothScrollTo(l.href) })),
  { label: "Open GitHub", action: () => window.open(profile.github, "_blank") },
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
      className="fixed inset-0 z-[200] bg-obsidian/70 backdrop-blur-sm flex items-start justify-center pt-32 px-6"
      onClick={onClose}
    >
      <div
        className="glass pixel-border rounded-2xl w-full max-w-lg overflow-hidden shadow-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a command..."
          className="w-full bg-transparent px-5 py-4 text-bone outline-none border-b border-obsidian-line placeholder:text-bone-dim font-body"
        />
        <ul className="max-h-72 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <li className="px-5 py-3 text-sm text-bone-dim">No commands found.</li>
          )}
          {filtered.map((c) => (
            <li key={c.label}>
              <button
                onClick={() => {
                  c.action();
                  onClose();
                }}
                className="w-full text-left px-5 py-2.5 text-sm text-bone-dim hover:bg-obsidian-alt hover:text-diamond transition-colors"
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}