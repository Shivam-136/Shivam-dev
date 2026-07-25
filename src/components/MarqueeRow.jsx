import { useEffect, useRef } from "react";
import gsap from "gsap";
import { techIcons } from "../data/techIcons";

export default function MarqueeRow({
  items,
  direction = "left",
  speed = 40,
}) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const singleWidth = track.scrollWidth / 2;

    gsap.killTweensOf(track);

    let tween;

    if (direction === "left") {
      gsap.set(track, { x: 0 });

      tween = gsap.to(track, {
        x: -singleWidth,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    } else {
      gsap.set(track, { x: -singleWidth });

      tween = gsap.to(track, {
        x: 0,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    }

    const pause = () => tween.pause();
    const play = () => tween.resume();

    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", play);

    return () => {
      track.removeEventListener("mouseenter", pause);
      track.removeEventListener("mouseleave", play);
      tween.kill();
    };
  }, [direction, speed]);

  return (
    <div className="overflow-hidden w-full">
      <div
        ref={trackRef}
        className="flex w-max gap-5"
      >
        {[...items, ...items].map((name, index) => (
          <TechChip key={`${name}-${index}`} name={name} />
        ))}
      </div>
    </div>
  );
}

function TechChip({ name }) {
  const tech = techIcons[name];

  if (!tech) return null;

  const Icon = tech.icon;

  return (
    <div
      className="glass pixel-border rounded-xl flex items-center gap-3 px-5 py-3 shrink-0"
    >
      <Icon
        size={22}
        style={{
          color: tech.color,
        }}
      />

      <span className="text-bone-dim whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}