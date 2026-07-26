import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { profile } from "../data/profile";
import { playBlockClick } from "../utils/sound";

// ---- Original blocky "guardian" avatar bitmap (8x8) ----
// 0 = empty, 1 = plate, 2 = eye (diamond), 3 = visor (emerald)
const FACE = [
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 2, 1, 1, 2, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 3, 3, 3, 3, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
];

const COLORS = {
  1: new THREE.Color("#22301f"), // plate
  2: new THREE.Color("#5EEAD4"), // eye - diamond
  3: new THREE.Color("#34D399"), // visor - emerald
};

const MESSAGES = [
  "Initializing uplink...",
  "Rendering avatar...",
  "Compiling identity matrix...",
  "Verifying credentials...",
  "Access granted.",
];

const ASSEMBLE_DURATION = 1.8;
const AUTO_ADVANCE_DELAY = 700; // ms to linger on "Access granted" before continuing

function AvatarScene({ mountRef, onProgress }) {
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = mount.clientWidth || 260;
    const height = mount.clientHeight || 260;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // ---- build instanced blocky avatar ----
    const cells = [];
    FACE.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val === 0) return;
        cells.push({
          x: x - 3.5,
          y: 3.5 - y,
          color: COLORS[val],
          delay: (y * 8 + x) * 0.012 + Math.random() * 0.15,
          startOffset: new THREE.Vector3(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            -6 - Math.random() * 6
          ),
        });
      });
    });

    const geometry = new THREE.BoxGeometry(0.85, 0.85, 0.85);
    const material = new THREE.MeshBasicMaterial({ vertexColors: true });
    const mesh = new THREE.InstancedMesh(geometry, material, cells.length);
    mesh.instanceColor = new THREE.InstancedBufferAttribute(
      new Float32Array(cells.length * 3),
      3
    );
    scene.add(mesh);

    const edgesGeo = new THREE.EdgesGeometry(geometry);

    cells.forEach((c, i) => {
      mesh.setColorAt(i, c.color);
    });
    mesh.instanceColor.needsUpdate = true;

    // scanline plane
    const scanGeo = new THREE.PlaneGeometry(6, 0.06);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const scanLine = new THREE.Mesh(scanGeo, scanMat);
    scene.add(scanLine);

    // rotating wireframe hex-ring behind the avatar — pure decoration,
    // gives the HUD/scanner a sense of depth and motion beyond the cubes.
    const ringGeo = new THREE.TorusGeometry(4.2, 0.02, 8, 6); // 6 segments = hexagonal silhouette
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x5eead4,
      transparent: true,
      opacity: 0.25,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2.4;
    scene.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo.clone(), ringMat.clone());
    ring2.scale.setScalar(1.3);
    ring2.material.opacity = 0.15;
    ring2.rotation.x = Math.PI / 2.4;
    scene.add(ring2);

    // soft additive glow shell behind the whole avatar — a cheap stand-in
    // for real bloom post-processing, without the cost of a full composer
    // for what is a small embedded scene.
    const glowGeo = new THREE.SphereGeometry(3.4, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowShell = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glowShell);

    const dummy = new THREE.Object3D();
    const clock = new THREE.Clock();
    let frameId;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animate() {
      const t = clock.getElapsedTime();

      let finished = 0;
      cells.forEach((c, i) => {
        const local = reduced ? 1 : Math.min(1, Math.max(0, (t - c.delay) / ASSEMBLE_DURATION));
        const eased = easeOutCubic(local);
        if (local >= 1) finished++;

        const px = THREE.MathUtils.lerp(c.startOffset.x, c.x, eased);
        const py = THREE.MathUtils.lerp(c.startOffset.y, c.y, eased);
        const pz = THREE.MathUtils.lerp(c.startOffset.z, 0, eased);
        const scale = THREE.MathUtils.lerp(0.15, 1, eased);

        dummy.position.set(px, py, pz);
        dummy.scale.setScalar(scale);
        dummy.rotation.set((1 - eased) * 2, (1 - eased) * 2, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;

      onProgress(finished / cells.length);

      const settle = Math.min(1, finished / cells.length);
      mesh.rotation.y = Math.sin(t * 0.4) * 0.15 * settle;

      scanLine.position.y = ((t * 1.4) % 9) - 4.5;
      scanLine.material.opacity = 0.35 + Math.sin(t * 6) * 0.15;

      // rotating hex-rings
      ring1.rotation.z = t * 0.25;
      ring2.rotation.z = -t * 0.18;
      glowShell.scale.setScalar(1 + Math.sin(t * 1.5) * 0.04);

      // slow camera orbit around the avatar
      const orbitRadius = 9;
      camera.position.x = Math.sin(t * 0.15) * orbitRadius * 0.15;
      camera.position.z = 9 - Math.cos(t * 0.15) * 0.3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    animate();

    function handleResize() {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      geometry.dispose();
      edgesGeo.dispose();
      material.dispose();
      scanGeo.dispose();
      scanMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ring2.geometry.dispose();
      ring2.material.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

// Fully automatic — plays the scan animation, briefly shows "Access
// granted", then removes itself. No button, no keypress, no tap needed.
export default function LoginScreen({ onDone }) {
  const mountRef = useRef(null);
  const rootRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("scanning"); // scanning | granted
  const [message, setMessage] = useState(MESSAGES[0]);

  function handleProgress(p) {
    const pct = Math.floor(p * 100);
    setProgress((prev) => (pct > prev ? pct : prev));
    setMessage(MESSAGES[Math.min(MESSAGES.length - 1, Math.floor(p * MESSAGES.length))]);
    if (p >= 1) {
      setPhase((prev) => {
        if (prev === "scanning") {
          playBlockClick(); // audible confirmation chime, respects the mute setting
          return "granted";
        }
        return prev;
      });
    }
  }

  // Automatically continue into the site shortly after access is granted —
  // no interaction required at all.
  useEffect(() => {
    if (phase !== "granted") return;
    const timer = setTimeout(() => {
      gsap.to(rootRef.current, {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut",
        onComplete: onDone,
      });
    }, AUTO_ADVANCE_DELAY);
    return () => clearTimeout(timer);
  }, [phase, onDone]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-obsidian overflow-hidden px-6"
    >
      {/* faint pixel grid, matches Hero's background language */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(52,211,153,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="absolute inset-0 opacity-30 pointer-events-none">
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

      <p className="eyebrow mb-6 relative">
        IDENTITY VERIFICATION
        <span className="absolute -right-4 top-0 w-1.5 h-1.5 bg-emerald-glow rounded-full animate-pulse" />
      </p>

      {/* avatar inside a sci-fi HUD frame — corner brackets + glow ring */}
      <div className="relative w-56 h-56 md:w-72 md:h-72 mb-2">
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-25 pointer-events-none"
          style={{ background: "radial-gradient(circle, #34D399 0%, transparent 70%)" }}
        />

        {["top-0 left-0 border-t-2 border-l-2", "top-0 right-0 border-t-2 border-r-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map(
          (pos, i) => (
            <span
              key={i}
              className={`absolute w-6 h-6 border-emerald-glow/70 ${pos}`}
            />
          )
        )}

        <div ref={mountRef} className="w-full h-full relative z-10">
          <AvatarScene mountRef={mountRef} onProgress={handleProgress} />
        </div>
      </div>

      <div
        className={`glass pixel-border rounded-2xl w-full max-w-sm overflow-hidden transition-shadow duration-500 ${
          phase === "granted" ? "shadow-emerald animate-pulse" : ""
        }`}
      >
        {/* terminal-style title bar */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-obsidian-line bg-black/30">
          <span className="w-2 h-2 rounded-full bg-redstone/70" />
          <span className="w-2 h-2 rounded-full bg-diamond/70" />
          <span className="w-2 h-2 rounded-full bg-emerald-glow/70" />
          <span className="ml-2 text-[10px] text-bone-dim/60 font-body tracking-wide">
            auth://portfolio-access
          </span>
        </div>

        <div className="p-6 text-center">
          <h1 className="font-display text-lg md:text-xl font-semibold text-bone mb-1">
            {profile.name}
          </h1>
          <p className="text-xs text-bone-dim font-body mb-5">{profile.role}</p>

          {phase === "scanning" && (
            <>
              <div className="w-full h-3 rounded-sm bg-obsidian-alt border border-obsidian-line overflow-hidden flex gap-[2px] p-[2px]">
                {Array.from({ length: 20 }).map((_, i) => {
                  const filled = progress >= (i + 1) * 5;
                  return (
                    <span
                      key={i}
                      className="flex-1 h-full rounded-[1px] transition-colors duration-150"
                      style={{
                        background: filled
                          ? i < 14
                            ? "#34D399"
                            : "#5EEAD4"
                          : "transparent",
                        boxShadow: filled ? "0 0 6px rgba(52,211,153,0.6)" : "none",
                      }}
                    />
                  );
                })}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-bone-dim font-body">
                <span>{message}</span>
                <span className="tabular-nums text-emerald-glow">{progress}%</span>
              </div>
            </>
          )}

          {phase === "granted" && (
            <p className="text-emerald-glow text-sm font-body text-glow-emerald">
              ✔ Access granted — welcome back.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}