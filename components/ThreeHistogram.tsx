import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeHistogramProps {
  mode: 'SDR' | 'HDR';
}

const ThreeHistogram: React.FC<ThreeHistogramProps> = ({ mode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const updateParticles = () => {
      for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 10;
        const y = mode === 'SDR' 
          ? (Math.random() * 3 - 1.5) // More compressed for SDR
          : (Math.random() * 10 - 5); // Expanded for HDR
        const z = (Math.random() - 0.5) * 5;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Color based on position (spectrum)
        const color = new THREE.Color();
        // Hue based on X, Lightness based on Y
        const h = (x + 5) / 10; 
        const s = 0.8;
        const l = (y + 5) / 10;
        color.setHSL(h, s, l);
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    };

    updateParticles();

    // Add a spectrum curve/grid
    const curvePoints = [];
    for (let i = -5; i <= 5; i += 0.5) {
      const x = i;
      const y = mode === 'SDR' ? Math.sin(i) * 0.5 : Math.sin(i) * 2;
      curvePoints.push(new THREE.Vector3(x, y, 0));
    }
    const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const curveMaterial = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.3 });
    const curveLine = new THREE.Line(curveGeometry, curveMaterial);
    scene.add(curveLine);

    // Add a 2D histogram plane at the bottom
    const planeGeometry = new THREE.PlaneGeometry(10, 5);
    const planeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x111111, 
      transparent: true, 
      opacity: 0.5,
      side: THREE.DoubleSide 
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -6;
    scene.add(plane);

    // Add 2D histogram bars on the plane
    const barCount = 50;
    const barWidth = 10 / barCount;
    for (let i = 0; i < barCount; i++) {
      const h = mode === 'SDR' 
        ? Math.random() * 2 
        : Math.random() * 5;
      const barGeo = new THREE.BoxGeometry(barWidth * 0.8, h, 0.1);
      const barMat = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color().setHSL(i / barCount, 0.5, 0.5),
        transparent: true,
        opacity: 0.6
      });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.x = -5 + (i * barWidth) + barWidth/2;
      bar.position.y = -6 + h/2;
      bar.position.z = 0;
      scene.add(bar);
    }

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    camera.position.z = 8;

    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.y += 0.005;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
    };
  }, [mode]);

  return (
    <div className="relative w-full h-[400px] bg-black/20 rounded-2xl overflow-hidden border border-white/10">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-mono uppercase tracking-widest border border-white/20">
          {mode} Dynamic Range Visualization
        </span>
      </div>
      <div className="absolute bottom-4 right-4 text-right">
        <p className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">
          {mode === 'SDR' ? 'Clipping at 100 nits' : 'Expanding to 1000+ nits'}
        </p>
      </div>
    </div>
  );
};

export default ThreeHistogram;
