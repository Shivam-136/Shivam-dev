import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A rotating 3D Minecraft-style grass block, rendered with Three.js.
 * Flat-color faces + black edge outlines keep it looking like pixel-art
 * blocky Minecraft rather than a smooth-shaded 3D render.
 *
 * Beyond the base spin, this now has:
 *  - smooth inertia-based rotation toward the mouse (no snapping)
 *  - a slow "breathing" scale pulse so it never looks frozen
 *  - a handful of tiny orbiting shard-particles (like floating mined
 *    resources) circling the block at a lazy pace
 *  - a click-to-mine moment: click/tap the block and it does a quick
 *    "hit" squash + a burst of pixel shards, like breaking a block
 *
 * Usage: <MinecraftBlock3D className="w-64 h-64" />
 */
export default function MinecraftBlock3D({ className = "", interactive = true }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = mount.clientWidth || 260;
    const height = mount.clientHeight || 260;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(2.4, 2, 3.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Flat colors, no lighting dependency — crisp blocky Minecraft look
    const grassTop = 0x5d8a3a;
    const dirtSide = 0x8b5a2b;
    const dirtBottom = 0x5c3a1c;

    const materials = [
      new THREE.MeshBasicMaterial({ color: dirtSide }),   // +x
      new THREE.MeshBasicMaterial({ color: dirtSide }),   // -x
      new THREE.MeshBasicMaterial({ color: grassTop }),   // +y (top)
      new THREE.MeshBasicMaterial({ color: dirtBottom }), // -y (bottom)
      new THREE.MeshBasicMaterial({ color: dirtSide }),   // +z
      new THREE.MeshBasicMaterial({ color: dirtSide }),   // -z
    ];

    const geometry = new THREE.BoxGeometry(1.6, 1.6, 1.6);
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    // black pixel-art edge outline, like the CSS blocks elsewhere on the site
    const edgesGeo = new THREE.EdgesGeometry(geometry);
    const edgeLines = new THREE.LineSegments(
      edgesGeo,
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    cube.add(edgeLines);

    // faint emerald glow shell to tie into the site's accent color
    const glowGeo = new THREE.BoxGeometry(1.72, 1.72, 1.72);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.06,
    });
    const glowCube = new THREE.Mesh(glowGeo, glowMat);
    cube.add(glowCube);

    // ---- orbiting shard particles: small blocky bits lazily circling
    // the cube, like resources floating around a Minecraft block ----
    const shardPalette = [0x34d399, 0x5eead4, 0x8a8a8a];
    const shardGeo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
    const orbitShards = reduced
      ? []
      : Array.from({ length: 5 }, (_, i) => {
          const mat = new THREE.MeshBasicMaterial({
            color: shardPalette[i % shardPalette.length],
            transparent: true,
            opacity: 0.85,
          });
          const mesh = new THREE.Mesh(shardGeo, mat);
          const edge = new THREE.LineSegments(
            new THREE.EdgesGeometry(shardGeo),
            new THREE.LineBasicMaterial({ color: 0x000000 })
          );
          mesh.add(edge);
          scene.add(mesh);
          return {
            mesh,
            radius: 1.5 + Math.random() * 0.6,
            speed: 0.25 + Math.random() * 0.2,
            angle: (Math.PI * 2 * i) / 5,
            tilt: (Math.random() - 0.5) * 1.2,
            bob: Math.random() * Math.PI * 2,
          };
        });

    // ---- click-to-mine burst particles: spawned on demand, animated
    // with simple velocity + gravity + fade, then cleaned up ----
    const burstPool = [];
    function spawnBurst() {
      const colors = [grassTop, dirtSide, 0x5eead4, 0x34d399];
      for (let i = 0; i < 10; i++) {
        const mat = new THREE.MeshBasicMaterial({
          color: colors[i % colors.length],
          transparent: true,
          opacity: 1,
        });
        const mesh = new THREE.Mesh(shardGeo, mat);
        mesh.position.set(0, 0, 0);
        const angle = Math.random() * Math.PI * 2;
        const upward = 0.6 + Math.random() * 1.2;
        const outward = 0.8 + Math.random() * 1;
        scene.add(mesh);
        burstPool.push({
          mesh,
          velocity: new THREE.Vector3(Math.cos(angle) * outward, upward, Math.sin(angle) * outward),
          age: 0,
        });
      }
    }

    let hitSquash = 0; // 0..1, decays after a click for a quick "impact" feel

    function onClick() {
      if (!interactive || reduced) return;
      hitSquash = 1;
      spawnBurst();
    }
    if (interactive) mount.addEventListener("pointerdown", onClick);

    let frameId;
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0.15;
    let curRotY = 0;
    let curRotX = 0.15;

    function onMouseMove(e) {
      const rect = mount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }
    window.addEventListener("mousemove", onMouseMove);

    const clock = new THREE.Clock();

    function animate() {
      const t = clock.getElapsedTime();
      const dt = Math.min(clock.getDelta(), 0.05);

      // continuous spin + smooth inertia toward mouse tilt, instead of
      // snapping straight to the target rotation
      curRotY += 0.006;
      targetRotY = curRotY;
      targetRotX = 0.15 + mouseY * 0.15;
      curRotX += (targetRotX - curRotX) * 0.08;
      cube.rotation.y = curRotY;
      cube.rotation.x = curRotX;

      // idle breathing scale + gentle bob, plus a quick squash on click
      hitSquash *= 0.9;
      const breathe = reduced ? 1 : 1 + Math.sin(t * 1.4) * 0.015;
      const squash = 1 - hitSquash * 0.12;
      cube.scale.set(breathe * (1 + hitSquash * 0.08), breathe * squash, breathe * (1 + hitSquash * 0.08));
      cube.position.y = Math.sin(t * 1.2) * 0.08;

      // orbiting shards
      orbitShards.forEach((s) => {
        s.angle += s.speed * dt;
        s.mesh.position.set(
          Math.cos(s.angle) * s.radius,
          cube.position.y + Math.sin(t * 0.8 + s.bob) * 0.15 + s.tilt * 0.3,
          Math.sin(s.angle) * s.radius
        );
        s.mesh.rotation.x += 0.02;
        s.mesh.rotation.y += 0.015;
      });

      // click burst: simple physics + fade, remove once faded out
      for (let i = burstPool.length - 1; i >= 0; i--) {
        const p = burstPool[i];
        p.age += dt;
        p.velocity.y -= dt * 2.2; // gravity
        p.mesh.position.addScaledVector(p.velocity, dt);
        p.mesh.rotation.x += dt * 4;
        p.mesh.rotation.y += dt * 3;
        p.mesh.material.opacity = Math.max(0, 1 - p.age / 0.7);
        if (p.age > 0.7) {
          scene.remove(p.mesh);
          p.mesh.material.dispose();
          burstPool.splice(i, 1);
        }
      }

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
      window.removeEventListener("mousemove", onMouseMove);
      if (interactive) mount.removeEventListener("pointerdown", onClick);
      resizeObserver.disconnect();

      geometry.dispose();
      edgesGeo.dispose();
      glowGeo.dispose();
      materials.forEach((m) => m.dispose());
      glowMat.dispose();
      shardGeo.dispose();

      orbitShards.forEach((s) => {
        s.mesh.material.dispose();
        scene.remove(s.mesh);
      });
      burstPool.forEach((p) => {
        p.mesh.material.dispose();
        scene.remove(p.mesh);
      });

      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={interactive ? { cursor: "pointer" } : undefined}
      title={interactive ? "Click to mine" : undefined}
    />
  );
}