import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function MiniVoxel3D({ className = "", top = "#5EEAD4", side = "#2b8f80", spin = "normal" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const width = mount.clientWidth || 80;
    const height = mount.clientHeight || 80;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 50);
    camera.position.set(1.6, 1.3, 2.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const topColor = new THREE.Color(top);
    const sideColor = new THREE.Color(side);

    const materials = [
      new THREE.MeshBasicMaterial({ color: sideColor }),
      new THREE.MeshBasicMaterial({ color: sideColor }),
      new THREE.MeshBasicMaterial({ color: topColor }),
      new THREE.MeshBasicMaterial({ color: sideColor.clone().multiplyScalar(0.6) }),
      new THREE.MeshBasicMaterial({ color: sideColor }),
      new THREE.MeshBasicMaterial({ color: sideColor }),
    ];

    const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    const edgesGeo = new THREE.EdgesGeometry(geometry);
    const edgeLines = new THREE.LineSegments(edgesGeo, new THREE.LineBasicMaterial({ color: 0x000000 }));
    cube.add(edgeLines);

    const speed = spin === "slow" ? 0.003 : 0.007;
    const clock = new THREE.Clock();
    let frameId;

    function animate() {
      const t = clock.getElapsedTime();
      cube.rotation.y += speed;
      cube.position.y = Math.sin(t * 1.1) * 0.06;
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
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [top, side, spin]);

  return <div ref={mountRef} className={className} />;
}