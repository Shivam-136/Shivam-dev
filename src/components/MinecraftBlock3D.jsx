import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A small rotating 3D Minecraft-style grass block, rendered with Three.js.
 * Flat-color faces + black edge outlines keep it looking like pixel-art
 * blocky Minecraft rather than a smooth-shaded 3D render.
 *
 * Usage: <MinecraftBlock3D className="w-64 h-64" />
 */
export default function MinecraftBlock3D({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

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

    let frameId;
    let mouseX = 0;
    let mouseY = 0;

    function onMouseMove(e) {
      const rect = mount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }
    window.addEventListener("mousemove", onMouseMove);

    const clock = new THREE.Clock();

    function animate() {
      const t = clock.getElapsedTime();
      cube.rotation.y += 0.006;
      cube.rotation.x = 0.15 + mouseY * 0.15;
      cube.position.y = Math.sin(t * 1.2) * 0.08;
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
      resizeObserver.disconnect();
      geometry.dispose();
      edgesGeo.dispose();
      glowGeo.dispose();
      materials.forEach((m) => m.dispose());
      glowMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} />;
}