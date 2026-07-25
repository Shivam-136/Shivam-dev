import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const MESSAGES = [
  "Generating terrain...",
  "Placing grass blocks...",
  "Mining diamonds...",
  "Loading chunks...",
  "Spawning world...",
];

export default function Loader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(MESSAGES[0]);
  const rootRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(rootRef.current, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
          onComplete: onDone,
        });
      },
    });

    const counter = { val: 0 };
    tl.to(counter, {
      val: 100,
      duration: 2.6,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.floor(counter.val);
        setProgress(v);
        setMessage(MESSAGES[Math.min(MESSAGES.length - 1, Math.floor((v / 100) * MESSAGES.length))]);
      },
    });
    tl.to({}, { duration: 0.35 }); // brief hold at 100%

    return () => tl.kill();
  }, [onDone]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-obsidian overflow-hidden"
    >
      {/* pixel sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 bg-diamond rounded-[1px] opacity-70 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <p className="eyebrow mb-6">WORLD GENERATION</p>
      <h1 className="font-display text-2xl md:text-4xl font-semibold text-bone mb-8 text-glow-emerald">
        Shivam Chhanchhan
      </h1>

      <div className="w-64 md:w-80 h-3 rounded-sm bg-obsidian-alt border border-obsidian-line overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-glow to-diamond transition-[width] duration-150 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between w-64 md:w-80 text-xs text-bone-dim font-body">
        <span>{message}</span>
        <span className="tabular-nums">{progress}%</span>
      </div>
    </div>
  );
}
