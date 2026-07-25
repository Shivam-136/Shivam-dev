import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { profile } from "../data/profile";

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

function AvatarScene({ mountRef, done, onProgress }) {
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
    const edgeMesh = new THREE.InstancedMesh(
      edgesGeo,
      new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.6 }),
      0
    );

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

      // gentle idle rotation once mostly assembled
      const settle = Math.min(1, finished / cells.length);
      mesh.rotation.y = Math.sin(t * 0.4) * 0.15 * settle;

      // scanline sweep, continuous
      scanLine.position.y = ((t * 1.4) % 9) - 4.5;
      scanLine.material.opacity = 0.35 + Math.sin(t * 6) * 0.15;

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
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

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
      setPhase((prev) => (prev === "scanning" ? "granted" : prev));
    }
  }

  function handleEnter() {
    gsap.to(rootRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: "power4.inOut",
      onComplete: onDone,
    });
  }

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-obsidian overflow-hidden px-6"
    >
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

      <p className="eyebrow mb-4">IDENTITY VERIFICATION</p>

      <div ref={mountRef} className="w-56 h-56 md:w-72 md:h-72">
        <AvatarScene mountRef={mountRef} onProgress={handleProgress} />
      </div>

      <div className="glass pixel-border rounded-2xl w-full max-w-sm mt-4 p-6 text-center">
        <h1 className="font-display text-lg md:text-xl font-semibold text-bone mb-1">
          {profile.name}
        </h1>
        <p className="text-xs text-bone-dim font-body mb-5">{profile.role}</p>

        {phase === "scanning" && (
          <>
            <div className="w-full h-3 rounded-sm bg-obsidian-alt border border-obsidian-line overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-glow to-diamond transition-[width] duration-150 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-bone-dim font-body">
              <span>{message}</span>
              <span className="tabular-nums">{progress}%</span>
            </div>
          </>
        )}

        {phase === "granted" && (
          <div className="animate-float-slow">
            <p className="text-emerald-glow text-sm font-body mb-4 text-glow-emerald">
              ✔ Access granted — welcome back.
            </p>
            <button
              onClick={handleEnter}
              data-cursor-hover
              className="mc-btn w-full bg-emerald-glow text-obsidian font-medium py-3"
            >
              Enter World
            </button>
          </div>
        )}
      </div>
    </div>
  );
}