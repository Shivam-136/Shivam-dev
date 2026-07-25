import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const trailRefs = useRef([]);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const el = cursorRef.current;
    const trail = trailRefs.current;

    const move = (e) => {
      const grid = 6;
      const x = Math.round(e.clientX / grid) * grid;
      const y = Math.round(e.clientY / grid) * grid;
      posRef.current = { x, y };
      gsap.set(el, { x: x - 9, y: y - 9 });
    };

    // Trailing pixel dust — each dot lags behind the last with increasing delay
    let raf;
    const trailPos = trail.map(() => ({ x: 0, y: 0 }));
    function tick() {
      let target = posRef.current;
      trail.forEach((node, i) => {
        if (!node) return;
        const p = trailPos[i];
        p.x += (target.x - p.x) * 0.25;
        p.y += (target.y - p.y) * 0.25;
        gsap.set(node, { x: p.x - 3, y: p.y - 3, opacity: 0.5 - i * 0.12 });
        target = p;
      });
      raf = requestAnimationFrame(tick);
    }
    tick();

    const enter = () => el.classList.add("is-hovering");
    const leave = () => el.classList.remove("is-hovering");

    // "Block break" particle burst on click
    const burst = (e) => {
      const colors = ["#5D8A3A", "#8B5A2B", "#8A8A8A", "#5EEAD4"];
      for (let i = 0; i < 8; i++) {
        const p = document.createElement("div");
        p.style.cssText = `
          position: fixed; left:${e.clientX}px; top:${e.clientY}px;
          width:5px; height:5px; background:${colors[i % colors.length]};
          box-shadow:0 0 0 1px #000; pointer-events:none; z-index:9998;
        `;
        document.body.appendChild(p);
        const angle = (Math.PI * 2 * i) / 8;
        gsap.to(p, {
          x: Math.cos(angle) * (20 + Math.random() * 20),
          y: Math.sin(angle) * (20 + Math.random() * 20),
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => p.remove(),
        });
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("click", burst);

    const interactive = document.querySelectorAll("a, button, [data-cursor-hover]");
    interactive.forEach((node) => {
      node.addEventListener("mouseenter", enter);
      node.addEventListener("mouseleave", leave);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("click", burst);
      interactive.forEach((node) => {
        node.removeEventListener("mouseenter", enter);
        node.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          ref={(el) => (trailRefs.current[i] = el)}
          className="fixed top-0 left-0 w-[6px] h-[6px] bg-emerald-glow pointer-events-none z-[9997]"
          style={{ boxShadow: "0 0 0 1px #000" }}
        />
      ))}
      <div ref={cursorRef} className="mc-cursor" />
    </>
  );
}