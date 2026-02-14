"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingCoinsProps {
  count?: number;
  mousePosition: { x: number; y: number };
}

export default function FloatingCoins({
  count = 80,
  mousePosition,
}: FloatingCoinsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Generate random positions and animation data for each coin
  const coins = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 25, // X spread
          (Math.random() - 0.5) * 20, // Y spread
          (Math.random() - 0.5) * 15, // Z depth
        ],
        rotation: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.5, // Animation speed
        offset: Math.random() * Math.PI * 2, // Phase offset for varied motion
        scale: 0.3 + Math.random() * 0.4, // Vary coin sizes
      });
    }
    return temp;
  }, [count]);

  // Animate coins
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const position = new THREE.Vector3();

    coins.forEach((coin, i) => {
      // Floating animation (vertical bobbing)
      const yOffset = Math.sin(time * coin.speed + coin.offset) * 0.5;

      // Rotation animation
      const rotationY = coin.rotation + time * 0.3;
      const rotationX = Math.sin(time * 0.2 + coin.offset) * 0.2;

      // Apply subtle parallax based on mouse position
      const parallaxX =
        mousePosition.x * 0.5 * ((coin.position[2] as number) / 15);
      const parallaxY =
        mousePosition.y * 0.5 * ((coin.position[2] as number) / 15);

      position.set(
        (coin.position[0] as number) + parallaxX,
        (coin.position[1] as number) + yOffset + parallaxY,
        coin.position[2] as number,
      );

      quaternion.setFromEuler(new THREE.Euler(rotationX, rotationY, 0));

      matrix.compose(
        position,
        quaternion,
        new THREE.Vector3(coin.scale, coin.scale, coin.scale),
      );

      meshRef.current?.setMatrixAt(i, matrix);
    });

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* Coin geometry - cylinder for coin shape */}
      <cylinderGeometry args={[1, 1, 0.15, 32]} />

      {/* Metallic bronze material */}
      <meshStandardMaterial
        color="#8C705F"
        metalness={0.8}
        roughness={0.3}
        emissive="#BFA896"
        emissiveIntensity={0.1}
      />
    </instancedMesh>
  );
}
