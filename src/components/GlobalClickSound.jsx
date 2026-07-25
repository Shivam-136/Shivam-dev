import { useEffect } from "react";
import { playBlockClick } from "../utils/sound";

// Selector for anything that should make a "click" sound.
// Covers buttons, links, and anything explicitly marked clickable.
const CLICKABLE_SELECTOR =
  'button, a, [role="button"], input[type="submit"], input[type="button"], [data-cursor-hover], [data-sound]';

/**
 * Mount this ONCE near the root of the app (e.g. in App.jsx or main.jsx),
 * outside/above all pages, so every click across the entire portfolio
 * triggers the sound — no need to add onClick handlers anywhere else.
 *
 * Usage:
 *   import GlobalClickSound from "./components/GlobalClickSound";
 *   ...
 *   <GlobalClickSound />
 *   <App />
 */
export default function GlobalClickSound() {
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest(CLICKABLE_SELECTOR);
      if (!target) return;
      // opt-out escape hatch: add data-no-sound to any element to silence it
      if (target.closest("[data-no-sound]")) return;
      playBlockClick();
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null; // renders nothing — pure behavior component
}