import { useEffect, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { isMuted, toggleMuted, onMuteChange } from "../utils/sound";

/**
 * Mute/unmute button — one button, two states.
 * Click once  -> sound OFF (icon becomes crossed-out speaker)
 * Click again -> sound ON  (icon becomes normal speaker)
 *
 * Two placements supported:
 *   <SoundToggle />              -> floating, fixed bottom-right corner (default)
 *   <SoundToggle variant="inline" />  -> normal inline button, use this INSIDE Navbar
 */
export default function SoundToggle({ variant = "floating", className = "" }) {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    setMutedState(isMuted());
    const unsubscribe = onMuteChange(setMutedState);
    return unsubscribe;
  }, []);

  const base =
    "flex items-center justify-center w-11 h-11 bg-obsidian-alt text-bone-dim hover:text-bone border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.55)] transition-colors";

  const positionClass =
    variant === "floating"
      ? "fixed bottom-6 right-6 z-[9999]" // high z-index so it's never hidden behind cursor/aura layers
      : "";

  return (
    <button
      type="button"
      data-no-sound
      data-cursor-hover
      onClick={() => toggleMuted()}
      aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
      title={muted ? "Sound: Off (click to turn on)" : "Sound: On (click to turn off)"}
      className={`${base} ${positionClass} ${className}`}
      style={{ imageRendering: "pixelated" }}
    >
      {muted ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
    </button>
  );
}