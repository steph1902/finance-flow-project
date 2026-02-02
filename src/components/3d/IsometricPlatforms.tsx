"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface IsometricPlatformsProps {
    mousePosition: { x: number; y: number };
}

export default function IsometricPlatforms({ mousePosition }: IsometricPlatformsProps) {
    const groupRef = useRef<THREE.Group>(null);

    // Define platform configurations with financial objects (reduced to 4 for performance)
    const platforms = useMemo(() => [
        {
            position: [-3, 0, 1],
            object: "coin-stack",
            color: "#8C705F",
            glowColor: "#BFA896",
            scale: 1.2,
            rotationSpeed: 0.3,
        },
        {
            position: [3, 0, 1],
            object: "card",
            color: "#8C705F",
            glowColor: "#BFA896",
            scale: 1.1,
            rotationSpeed: 0.2,
        },
        {
            position: [-2, 1.5, -2],
            object: "chart",
            color: "#A89F91",
            glowColor: "#BFA896",
            scale: 1,
            rotationSpeed: 0.25,
        },
        {
            position: [2.5, 1.8, -2.5],
            object: "dollar",
            color: "#BFA896",
            glowColor: "#8C705F",
            scale: 1.3,
            rotationSpeed: 0.35,
        },
    ], []);

    // Animate platforms with subtle floating
    useFrame((state) => {
        if (!groupRef.current) return;

        const time = state.clock.getElapsedTime();

        // Subtle camera tilt based on mouse
        groupRef.current.rotation.y = mousePosition.x * 0.1;
        groupRef.current.rotation.x = -mousePosition.y * 0.05;

        // Animate individual platforms
        groupRef.current.children.forEach((child, i) => {
            if (child instanceof THREE.Group) {
                const platform = platforms[i];
                if (!platform) return;

                // Floating animation
                const floatOffset = Math.sin(time * 0.5 + i) * 0.1;
                child.position.y = (platform.position[1] as number) + floatOffset;

                // Get the object on the platform (second child)
                const objectMesh = child.children[1];
                if (objectMesh) {
                    // Rotate objects gently
                    objectMesh.rotation.y = time * platform.rotationSpeed;
                }
            }
        });
    });

    return (
        <group ref={groupRef}>
            {platforms.map((platform, index) => (
                <PlatformWithObject
                    key={index}
                    position={platform.position as [number, number, number]}
                    object={platform.object}
                    color={platform.color}
                    glowColor={platform.glowColor}
                    scale={platform.scale}
                />
            ))}
        </group>
    );
}

// Individual platform component
function PlatformWithObject({
    position,
    object,
    color,
    glowColor,
    scale,
}: {
    position: [number, number, number];
    object: string;
    color: string;
    glowColor: string;
    scale: number;
}) {
    return (
        <group position={position}>
            {/* Platform Base */}
            <mesh position={[0, -0.3, 0]} castShadow>
                <boxGeometry args={[1.5, 0.3, 1.5]} />
                <meshStandardMaterial
                    color="#FFFFFF"
                    roughness={0.2}
                    metalness={0.1}
                />
            </mesh>

            {/* Financial Object */}
            <group position={[0, 0.4, 0]} scale={scale}>
                {object === "coin-stack" && <CoinStack color={color} glowColor={glowColor} />}
                {object === "card" && <CreditCard color={color} glowColor={glowColor} />}
                {object === "chart" && <BarChart color={color} glowColor={glowColor} />}
                {object === "wallet" && <Wallet color={color} glowColor={glowColor} />}
                {object === "dollar" && <DollarSign color={color} glowColor={glowColor} />}
                {object === "trend" && <TrendArrow color={color} glowColor={glowColor} />}
            </group>

            {/* Point light for glow effect */}
            <pointLight
                position={[0, 1, 0]}
                color={glowColor}
                intensity={1.5}
                distance={3}
                decay={2}
            />
        </group>
    );
}

// Financial Object Components

function CoinStack({ color, glowColor }: { color: string; glowColor: string }) {
    return (
        <group>
            {[0, 0.12, 0.24, 0.36].map((y, i) => (
                <mesh key={i} position={[0, y, 0]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
                    <meshStandardMaterial
                        color={color}
                        metalness={0.9}
                        roughness={0.2}
                        emissive={glowColor}
                        emissiveIntensity={i === 3 ? 0.3 : 0.1}
                    />
                </mesh>
            ))}
        </group>
    );
}

function CreditCard({ color, glowColor }: { color: string; glowColor: string }) {
    return (
        <group>
            <mesh rotation={[0, 0, 0]}>
                <boxGeometry args={[0.6, 0.4, 0.05]} />
                <meshStandardMaterial
                    color="#FFFFFF"
                    roughness={0.3}
                    metalness={0.2}
                />
            </mesh>
            {/* Card stripe */}
            <mesh position={[0, 0.05, 0.03]}>
                <boxGeometry args={[0.65, 0.1, 0.01]} />
                <meshStandardMaterial
                    color={color}
                    emissive={glowColor}
                    emissiveIntensity={0.4}
                    metalness={0.8}
                    roughness={0.1}
                />
            </mesh>
        </group>
    );
}

function BarChart({ color, glowColor }: { color: string; glowColor: string }) {
    const heights = [0.2, 0.35, 0.5];
    return (
        <group>
            {heights.map((height, i) => (
                <mesh key={i} position={[(i - 1) * 0.25, height / 2, 0]}>
                    <boxGeometry args={[0.15, height, 0.15]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={glowColor}
                        emissiveIntensity={0.3}
                        metalness={0.6}
                        roughness={0.3}
                    />
                </mesh>
            ))}
        </group>
    );
}

function Wallet({ color, glowColor }: { color: string; glowColor: string }) {
    return (
        <group>
            {/* Wallet body */}
            <mesh>
                <boxGeometry args={[0.4, 0.3, 0.1]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.4}
                    metalness={0.3}
                />
            </mesh>
            {/* Wallet accent line */}
            <mesh position={[0, 0, 0.06]}>
                <boxGeometry args={[0.45, 0.05, 0.01]} />
                <meshStandardMaterial
                    color={glowColor}
                    emissive={glowColor}
                    emissiveIntensity={0.5}
                />
            </mesh>
        </group>
    );
}

function DollarSign({ color, glowColor }: { color: string; glowColor: string }) {
    return (
        <group>
            {/* Vertical line */}
            <mesh>
                <boxGeometry args={[0.05, 0.6, 0.05]} />
                <meshStandardMaterial
                    color={color}
                    emissive={glowColor}
                    emissiveIntensity={0.6}
                    metalness={0.8}
                    roughness={0.1}
                />
            </mesh>
            {/* Top curve */}
            <mesh position={[0, 0.15, 0]}>
                <torusGeometry args={[0.15, 0.04, 8, 16, Math.PI]} />
                <meshStandardMaterial
                    color={color}
                    emissive={glowColor}
                    emissiveIntensity={0.6}
                    metalness={0.8}
                    roughness={0.1}
                />
            </mesh>
            {/* Bottom curve */}
            <mesh position={[0, -0.15, 0]} rotation={[0, 0, Math.PI]}>
                <torusGeometry args={[0.15, 0.04, 8, 16, Math.PI]} />
                <meshStandardMaterial
                    color={color}
                    emissive={glowColor}
                    emissiveIntensity={0.6}
                    metalness={0.8}
                    roughness={0.1}
                />
            </mesh>
        </group>
    );
}

function TrendArrow({ color, glowColor }: { color: string; glowColor: string }) {
    return (
        <group rotation={[0, 0, -Math.PI / 4]}>
            {/* Arrow shaft */}
            <mesh position={[0, 0.15, 0]}>
                <boxGeometry args={[0.05, 0.4, 0.05]} />
                <meshStandardMaterial
                    color={color}
                    emissive={glowColor}
                    emissiveIntensity={0.4}
                    metalness={0.7}
                    roughness={0.2}
                />
            </mesh>
            {/* Arrow head */}
            <mesh position={[0, 0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
                <coneGeometry args={[0.1, 0.15, 4]} />
                <meshStandardMaterial
                    color={color}
                    emissive={glowColor}
                    emissiveIntensity={0.5}
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>
        </group>
    );
}
