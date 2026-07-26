import { useEffect, useRef } from "react";

export default function CursorAura() {
  const canvasRef = useRef(null);

  useEffect(() => {

    if (window.matchMedia("(hover: none)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let width, height;

    const GRID = 14;
    const PARTICLE_COUNT = 46;
    const colors = ["#34D399", "#5EEAD4", "#10B981", "#6EE7B7"];

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      x: mouse.x,
      y: mouse.y,
      lag: 0.06 + Math.random() * 0.1,
      offsetAngle: Math.random() * Math.PI * 2,
      offsetRadius: Math.random() * 40,
      size: GRID * (0.6 + Math.random() * 0.8),
      color: colors[i % colors.length],
      flicker: Math.random() * Math.PI * 2,
    }));

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    function onMove(e) {
      // viewport coords work directly since the canvas is position: fixed
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    window.addEventListener("mousemove", onMove);

    function snap(v) {
      return Math.round(v / GRID) * GRID;
    }

    function tick(t) {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        const targetX = mouse.x + Math.cos(p.offsetAngle + t * 0.0003) * p.offsetRadius;
        const targetY = mouse.y + Math.sin(p.offsetAngle + t * 0.0003) * p.offsetRadius;
        p.x += (targetX - p.x) * p.lag;
        p.y += (targetY - p.y) * p.lag;

        const flicker = 0.55 + Math.sin(t * 0.004 + p.flicker) * 0.25;
        const sx = snap(p.x);
        const sy = snap(p.y);

        ctx.save();
        ctx.globalAlpha = flicker * (1 - i / (PARTICLE_COUNT * 1.4));
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(sx - p.size / 2, sy - p.size / 2, p.size, p.size);
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(0,0,0,0.4)";
        ctx.lineWidth = 1;
        ctx.strokeRect(sx - p.size / 2, sy - p.size / 2, p.size, p.size);
        ctx.restore();
      });

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none opacity-70 mix-blend-screen z-[1]"
    />
  );
}