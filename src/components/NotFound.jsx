import { FiHome, FiArrowLeft } from "react-icons/fi";
import { profile } from "../data/profile";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-6 text-center text-bone">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(52,211,153,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 glass pixel-border rounded-3xl p-8 sm:p-12 max-w-lg w-full shadow-panel border border-obsidian-line">
        <p className="eyebrow mb-4 text-emerald-glow">ERROR 404</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-bone mb-4">
          Lost in Chunk Space
        </h1>
        <p className="text-bone-dim text-sm sm:text-base font-body mb-8 leading-relaxed">
          The page or route you are looking for doesn't exist or has moved into another quadrant.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/"
            className="mc-btn w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-glow text-obsidian font-semibold px-6 py-3 rounded text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow"
          >
            <FiHome size={16} />
            <span>Return to Portfolio</span>
          </a>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="mc-btn glass w-full sm:w-auto flex items-center justify-center gap-2 text-bone px-6 py-3 rounded text-sm hover:text-emerald-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow"
          >
            <FiArrowLeft size={16} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
