"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import IsometricPlatforms from "./IsometricPlatforms";
import { OrbitControls } from "@react-three/drei";

export default function CoinBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track mouse position for parallax
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReducedMotion]);

  // Fallback gradient for reduced motion or loading
  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#8C705F] via-[#A89F91] to-[#BFA896]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    );
  }

  const coinCount = isMobile ? 40 : 80;

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [8, 6, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        shadows
      >
        <Suspense fallback={null}>
          {/* Lighting for isometric scene */}
          <ambientLight intensity={0.6} color="#FFF9F0" />

          {/* Main directional light with shadows */}
          <directionalLight
            position={[8, 12, 8]}
            intensity={1.5}
            color="#FFECD1"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {/* Rim light for depth */}
          <directionalLight
            position={[-5, 5, -5]}
            intensity={0.8}
            color="#BFA896"
          />

          {/* Soft fill light */}
          <spotLight
            position={[0, 10, 0]}
            angle={0.6}
            penumbra={1}
            intensity={0.5}
            color="#F5F2EB"
          />

          {/* Isometric Platforms */}
          <IsometricPlatforms mousePosition={mousePosition} />

          {/* Camera controls (disabled rotation for fixed isometric view) */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Suspense>

        {/* Subtle fog */}
        <fog attach="fog" args={["#FDFCF8", 10, 25]} />
      </Canvas>

      {/* Gradient overlay for smooth blend */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCF8]/40 to-transparent pointer-events-none" />
    </div>
  );
}
