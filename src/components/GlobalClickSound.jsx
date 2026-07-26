import { useEffect } from "react";
import { playBlockClick } from "../utils/sound";

const CLICKABLE_SELECTOR =
  'button, a, [role="button"], input[type="submit"], input[type="button"], [data-cursor-hover], [data-sound]';

export default function GlobalClickSound() {
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest(CLICKABLE_SELECTOR);
      if (!target) return;
      if (target.closest("[data-no-sound]")) return;
      
      playBlockClick();
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null; 
}