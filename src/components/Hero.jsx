import { useEffect, useRef, useState, lazy, Suspense } from "react";
import gsap from "gsap";
import { profile, resumeAvailable } from "../data/profile";
import { FiDownload, FiArrowRight } from "react-icons/fi";
import { smoothScrollTo } from "../utils/scroll";
import { downloadResume } from "../utils/downloadResume";

const MinecraftBlock3D = lazy(() => import("./MinecraftBlock3D"));

const ROLES = [
  "Full Stack Developer",
  "MERN Stack Specialist",
  "AI Application Engineer",
];

export default function Hero() {
  const heroRef = useRef(null);
  const layersRef = useRef([]);
  const [roleText, setRoleText] = useState("");
  const [canLoad3DBlock, setCanLoad3DBlock] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!isMobile && !reducedMotion) {
      const timer = setTimeout(() => {
        setCanLoad3DBlock(true);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.from(".hero-eyebrow", { opacity: 0, y: 12, duration: 0.5 })
        .from(
          ".hero-title-line",
          { opacity: 0, y: 40, stagger: 0.08, duration: 0.7, ease: "power3.out" },
          "-=0.2"
        )
        .from(".hero-sub", { opacity: 0, y: 16, duration: 0.5 }, "-=0.3")
        .from(".hero-cta", { opacity: 0, y: 16, stagger: 0.1, duration: 0.5 }, "-=0.25")
        .from(
          ".hero-block",
          {
            opacity: 0,
            y: 60,
            scale: 0.8,
            stagger: 0.06,
            duration: 0.6,
            ease: "steps(6)",
          },
          "-=0.6"
        );
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
        await wait(1500);
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
        gsap.to(layer, {
          x: x * 18 * depth,
          y: y * 12 * depth,
          duration: 0.5,
          ease: "steps(8)",
        });
      });
    };
    el?.addEventListener("mousemove", onMove);
    return () => el?.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-[92vh] sm:min-h-screen flex flex-col items-center justify-center overflow-hidden bg-obsidian/90 pt-20"
    >
      {/* Pixel grid background */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(52,211,153,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Pixel-art decorative element */}
      <div
        ref={(el) => (layersRef.current[0] = el)}
        data-depth="0.4"
        className="absolute top-24 right-[12%] animate-float-slow pointer-events-none"
        style={{ imageRendering: "pixelated" }}
      >
        <div
          className="relative w-14 h-14 bg-diamond"
          style={{ boxShadow: "0 0 0 2px #000" }}
        >
          <div
            className="absolute -top-3 left-3 w-8 h-3 bg-diamond"
            style={{ boxShadow: "0 0 0 2px #000" }}
          />
          <div
            className="absolute -bottom-3 left-3 w-8 h-3 bg-diamond"
            style={{ boxShadow: "0 0 0 2px #000" }}
          />
          <div
            className="absolute top-3 -left-3 w-3 h-8 bg-diamond"
            style={{ boxShadow: "0 0 0 2px #000" }}
          />
          <div
            className="absolute top-3 -right-3 w-3 h-8 bg-diamond"
            style={{ boxShadow: "0 0 0 2px #000" }}
          />
        </div>
      </div>

      {/* Floating Minecraft blocks (CSS) */}
      <FloatingBlock
        refCb={(el) => (layersRef.current[1] = el)}
        depth="1.2"
        className="left-[6%] top-[25%]"
        size={56}
        type="grass"
      />
      <FloatingBlock
        refCb={(el) => (layersRef.current[2] = el)}
        depth="0.8"
        className="right-[8%] top-[55%]"
        size={40}
        type="dirt"
      />
      <FloatingBlock
        refCb={(el) => (layersRef.current[3] = el)}
        depth="1.5"
        className="left-[12%] bottom-[16%]"
        size={34}
        type="stone"
      />
      <FloatingBlock
        refCb={(el) => (layersRef.current[4] = el)}
        depth="1"
        className="right-[18%] bottom-[20%]"
        size={28}
        type="diamond"
      />

      {/* 3D Minecraft block: Lazy-loaded after paint on desktop, CSS block on mobile */}
      <div className="hero-3d-block absolute right-[4%] top-10 sm:top-12 md:top-1/2 md:-translate-y-1/2 w-24 h-24 sm:w-36 sm:h-36 md:w-56 md:h-56 lg:w-64 lg:h-64 pointer-events-none z-0 opacity-80 flex items-center justify-center">
        {canLoad3DBlock ? (
          <Suspense fallback={<FloatingBlock size={56} type="grass" />}>
            <MinecraftBlock3D className="w-full h-full" />
          </Suspense>
        ) : (
          <FloatingBlock size={48} type="grass" />
        )}
      </div>

      <div className="relative z-10 max-w-4xl text-center px-6">
        <p className="hero-eyebrow eyebrow mb-5 inline-block px-3 py-1 bg-emerald-glow/10 border border-emerald-glow/20 rounded-full">
          AVAILABLE FOR FULL STACK &amp; AI ROLES
        </p>

        {/* Single H1 hierarchy for the entire page */}
        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-semibold leading-[1.25] tracking-tight text-bone">
          <span className="hero-title-line block">{profile.name}</span>
          <span className="hero-title-line block mt-3 text-lg sm:text-2xl md:text-3xl font-medium text-emerald-glow">
            {roleText}
            <span
              className="inline-block w-[3px] h-[0.85em] bg-diamond ml-1.5 align-middle animate-pulse"
              aria-hidden="true"
            />
          </span>
        </h1>

        {/* One clear line on what I do and for whom */}
        <p className="hero-sub mt-6 sm:mt-8 text-base sm:text-lg text-bone-dim max-w-2xl mx-auto font-body leading-relaxed">
          {profile.tagline}
        </p>

        {/* Exactly two recruiter-focused CTAs */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo("#projects");
            }}
            data-cursor-hover
            className="hero-cta mc-btn flex items-center gap-2.5 bg-emerald-glow text-obsidian font-semibold px-7 py-3.5 text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow"
          >
            View Projects <FiArrowRight className="text-lg" />
          </a>

          {resumeAvailable && (
            <button
              type="button"
              onClick={() =>
                downloadResume(
                  profile.resumeUrl,
                  "Shivam_Chhanchhan_Full_Stack_Developer_Resume.pdf"
                )
              }
              data-cursor-hover
              className="hero-cta mc-btn glass flex items-center gap-2.5 text-bone px-7 py-3.5 text-sm sm:text-base hover:text-emerald-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow"
            >
              <FiDownload className="text-lg text-emerald-glow" /> Download Resume
            </button>
          )}
        </div>
      </div>

      {/* Subtle scroll indicator */}
      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          smoothScrollTo("#about");
        }}
        data-cursor-hover
        aria-label="Scroll to About section"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-bone-dim hover:text-emerald-glow transition-colors flex flex-col items-center gap-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow rounded"
      >
        <span className="eyebrow !text-[9px]">SCROLL</span>
        <span className="w-[2px] h-8 bg-emerald-glow/60 animate-pulse" />
      </a>
    </section>
  );
}

function FloatingBlock({ refCb, depth, className = "", size = 40, type = "grass" }) {
  const palettes = {
    grass: { top: "#5D8A3A", side: "#8B5A2B" },
    dirt: { top: "#8B5A2B", side: "#5c3a1c" },
    stone: { top: "#8A8A8A", side: "#5f5f5f" },
    diamond: { top: "#5EEAD4", side: "#2b8f80" },
  };
  const c = palettes[type] || palettes.grass;

  return (
    <div
      ref={refCb}
      data-depth={depth}
      className={`hero-block ${className} animate-float pointer-events-none`}
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