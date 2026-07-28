import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { profile } from "../data/profile";
import { FiDownload, FiArrowRight, FiMail } from "react-icons/fi";
import MinecraftBlock3D from "./MinecraftBlock3D";
import { smoothScrollTo } from "../utils/scroll";
import { downloadResume } from "../utils/downloadResume";

const ROLES = [
  "Full Stack Developer",
  "React & Node.js Engineer",
  "AI-Powered App Builder",
];

export default function Hero() {
  const heroRef = useRef(null);
  const layersRef = useRef([]);
  const [roleText, setRoleText] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.from(".hero-eyebrow", { opacity: 0, y: 12, duration: 0.5 })
        .from(".hero-title-line", { opacity: 0, y: 40, stagger: 0.08, duration: 0.7, ease: "power3.out" }, "-=0.2")
        .from(".hero-sub", { opacity: 0, y: 16, duration: 0.5 }, "-=0.3")
        .from(".hero-cta", { opacity: 0, y: 16, stagger: 0.1, duration: 0.5 }, "-=0.25")
        .from(".hero-block", {
          opacity: 0,
          y: 60,
          scale: 0.8,
          stagger: 0.06,
          duration: 0.6,
          ease: "steps(6)",
        }, "-=0.6")
        .from(".hero-3d-block", { opacity: 0, scale: 0.7, duration: 0.7, ease: "back.out(1.7)" }, "-=0.4");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let mounted = true;
    let roleIndex = 0;

    async function typeLoop() {
      while (mounted) {
        const word = ROLES[roleIndex % ROLES.length];
        for (let i = 0; i <= word.length; i++) {
          if (!mounted) return;
          setRoleText(word.slice(0, i));
          await wait(35);
        }
        await wait(1400);
        for (let i = word.length; i >= 0; i--) {
          if (!mounted) return;
          setRoleText(word.slice(0, i));
          await wait(20);
        }
        await wait(300);
        roleIndex++;
      }
    }
    typeLoop();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    const onMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      layersRef.current.forEach((layer) => {
        if (!layer) return;
        const depth = Number(layer.dataset.depth || 1);
        gsap.to(layer, { x: x * 18 * depth, y: y * 12 * depth, duration: 0.5, ease: "steps(8)" });
      });
    };
    el?.addEventListener("mousemove", onMove);
    return () => el?.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-obsidian/90"
    >
      {/* crisp pixel grid background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(52,211,153,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* pixel-art sun */}
      <div
        ref={(el) => (layersRef.current[0] = el)}
        data-depth="0.4"
        className="absolute top-24 right-[12%] animate-float-slow"
        style={{ imageRendering: "pixelated" }}
      >
        <div className="relative w-16 h-16 bg-diamond" style={{ boxShadow: "0 0 0 2px #000" }}>
          <div className="absolute -top-4 left-4 w-8 h-4 bg-diamond" style={{ boxShadow: "0 0 0 2px #000" }} />
          <div className="absolute -bottom-4 left-4 w-8 h-4 bg-diamond" style={{ boxShadow: "0 0 0 2px #000" }} />
          <div className="absolute top-4 -left-4 w-4 h-8 bg-diamond" style={{ boxShadow: "0 0 0 2px #000" }} />
          <div className="absolute top-4 -right-4 w-4 h-8 bg-diamond" style={{ boxShadow: "0 0 0 2px #000" }} />
        </div>
      </div>

      {/* floating Minecraft blocks (CSS) */}
      <FloatingBlock refCb={(el) => (layersRef.current[1] = el)} depth="1.2" className="left-[8%] top-[28%]" size={64} type="grass" />
      <FloatingBlock refCb={(el) => (layersRef.current[2] = el)} depth="0.8" className="right-[10%] top-[55%]" size={44} type="dirt" />
      <FloatingBlock refCb={(el) => (layersRef.current[3] = el)} depth="1.5" className="left-[16%] bottom-[16%]" size={36} type="stone" />
      <FloatingBlock refCb={(el) => (layersRef.current[4] = el)} depth="1" className="right-[20%] bottom-[22%]" size={28} type="diamond" />

      {/* real rotating 3D Minecraft block (Three.js) — now visible on all screen sizes.
          Small + tucked near the top on mobile so it never overlaps the centered text;
          grows and moves to the side as the viewport widens. */}
      <div
        className="hero-3d-block absolute right-[6%] top-6 sm:top-10 md:top-1/2 md:-translate-y-1/2 w-28 h-28 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 pointer-events-none z-0 opacity-90"
      >
        <MinecraftBlock3D className="w-full h-full" />
      </div>

      <div className="relative z-10 max-w-4xl text-center px-6">
        <p className="hero-eyebrow eyebrow mb-6">FULL STACK DEVELOPER</p>

        <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-semibold leading-[1.3] tracking-tight text-bone">
          <span className="hero-title-line block">{profile.name}</span>
          <span className="hero-title-line block mt-4 text-xl sm:text-2xl md:text-3xl font-medium text-emerald-glow">
            {roleText}
            <span className="inline-block w-[3px] h-[0.9em] bg-diamond ml-1 align-middle animate-pulse" />
          </span>
        </h1>

        <p className="hero-sub mt-8 text-sm md:text-base text-bone-dim max-w-2xl mx-auto font-body">
          {profile.tagline}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => downloadResume(profile.resumeUrl, "Shivam_Chhanchhan_Resume.pdf")}
            data-cursor-hover
            className="hero-cta mc-btn flex items-center gap-2 bg-emerald-glow text-obsidian font-medium px-6 py-3"
          >
            <FiDownload /> Download Resume
          </button>
          
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo("#projects");
            }}
            data-cursor-hover
            className="hero-cta mc-btn glass flex items-center gap-2 text-bone px-6 py-3"
          >
            View Projects <FiArrowRight />
          </a>
          
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo("#contact");
            }}
            data-cursor-hover
            className="hero-cta mc-btn flex items-center gap-2 bg-obsidian-alt text-bone-dim hover:text-bone px-6 py-3"
          >
            <FiMail /> Hire Me
          </a>
        </div>
      </div>

      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          smoothScrollTo("#about");
        }}
        data-cursor-hover
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-bone-dim flex flex-col items-center gap-2 text-xs"
      >
        <span className="eyebrow !text-[9px]">SCROLL</span>
        <span className="w-[2px] h-10 bg-emerald-glow" />
      </a>
    </section>
  );
}

function FloatingBlock({ refCb, depth, className, size = 40, type = "grass" }) {
  const palettes = {
    grass: { top: "#5D8A3A", side: "#8B5A2B" },
    dirt: { top: "#8B5A2B", side: "#5c3a1c" },
    stone: { top: "#8A8A8A", side: "#5f5f5f" },
    diamond: { top: "#5EEAD4", side: "#2b8f80" },
  };
  const c = palettes[type];

  return (
    <div
      ref={refCb}
      data-depth={depth}
      className={`hero-block absolute ${className} animate-float`}
      style={{
        width: size,
        height: size,
        background: c.top,
        boxShadow: `0 0 0 2px #000, ${size * 0.18}px ${size * 0.18}px 0 0 rgba(0,0,0,0.55)`,
        imageRendering: "pixelated",
      }}
    >
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "30%", background: c.side, boxShadow: "0 -2px 0 0 #000" }}
      />
    </div>
  );
}

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}