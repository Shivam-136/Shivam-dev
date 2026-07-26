import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Sitewide ambient Three.js layer: a sparse field of tiny voxel shards
 * drifting slowly behind every section. This is the ONE global 3D touch
 * that ties the whole portfolio together — kept deliberately quiet
 * (low opacity, slow motion, no lighting drama) so it reads as
 * atmosphere, not decoration competing with the content.
 *
 * Mount ONCE near the root, e.g. in App.jsx:
 *   <ThreeAmbientBackground />
 * Render it before <main> so it sits behind all page content
 * (it's `fixed` + `pointer-events-none`, so it never blocks clicks).
 */
export default function ThreeAmbientBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Respect data saver / low-end devices: skip entirely on very small
    // viewports where the effect would barely be visible anyway.
    if (reduced) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    mount.appendChild(renderer.domElement);

    const PALETTE = [0x34d399, 0x5eead4, 0xffffff, 0x5d8a3a];
    const COUNT = 60;

    // Bigger + additive-blended so the glow reads through the section
    // panels' translucent backgrounds instead of disappearing behind them.
    const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const edges = new THREE.EdgesGeometry(geometry);

    const group = new THREE.Group();
    const shards = [];

    for (let i = 0; i < COUNT; i++) {
      const color = PALETTE[i % PALETTE.length];
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.4 + Math.random() * 0.25,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geometry, mat);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 })
      );
      mesh.add(line);

      mesh.position.set(
        (Math.random() - 0.5) * 26,
        (Math.random() - 0.5) * 34, // spread across full scroll height, not just one screen
        (Math.random() - 0.5) * 14 - 4
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      const scale = 0.7 + Math.random() * 1.6;
      mesh.scale.setScalar(scale);

      group.add(mesh);
      shards.push({
        mesh,
        speed: 0.05 + Math.random() * 0.08,
        driftAngle: Math.random() * Math.PI * 2,
        driftRadius: 0.6 + Math.random() * 1.2,
        baseY: mesh.position.y,
        rotSpeed: (Math.random() - 0.5) * 0.15,
      });
    }
    scene.add(group);

    let mouseX = 0;
    let mouseY = 0;
    function onMouseMove(e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener("mousemove", onMouseMove);

    // gentle scroll-linked depth: as the page scrolls, drift the whole
    // field very slightly so it doesn't feel static-pasted-on
    let scrollY = window.scrollY;
    function onScroll() {
      scrollY = window.scrollY;
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    const clock = new THREE.Clock();
    let frameId;

    function animate() {
      const t = clock.getElapsedTime();

      shards.forEach((s) => {
        s.mesh.position.y = s.baseY + Math.sin(t * s.speed + s.driftAngle) * s.driftRadius;
        s.mesh.rotation.x += s.rotSpeed * 0.01;
        s.mesh.rotation.y += s.rotSpeed * 0.015;
      });

      group.rotation.y = mouseX * 0.05;
      group.rotation.x = mouseY * 0.03;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      group.position.y = (scrollY / maxScroll) * 30 - 15;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    animate();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      edges.dispose();
      shards.forEach((s) => s.mesh.material.dispose());
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}