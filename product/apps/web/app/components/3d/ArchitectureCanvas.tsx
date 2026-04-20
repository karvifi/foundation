"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

const LAYERS = [
  { label: "AI Inference",    color: "#6366F1", emissive: "#3730A3", y: 0,    detail: "Phi-4-mini local · Claude cloud · Semantic cache" },
  { label: "Graph Compiler",  color: "#8B5CF6", emissive: "#4C1D95", y: 0.65, detail: "300 node primitives · DAG executor · Live compilation" },
  { label: "OmniMind",        color: "#A78BFA", emissive: "#5B21B6", y: 1.3,  detail: "Cross-surface context · HNSW vector search · MMR rerank" },
  { label: "Workflow Engine",  color: "#3B82F6", emissive: "#1E3A8A", y: 1.95, detail: "Durable execution · Retries · Human-in-loop gates" },
  { label: "Data Layer",      color: "#06B6D4", emissive: "#0E7490", y: 2.6,  detail: "pgvector · Drizzle ORM · Row-level security" },
  { label: "UI Surface",      color: "#D4AF37", emissive: "#92400E", y: 3.25, detail: "React compiler · Live re-render · Intent-to-UI mapping" },
  { label: "Integrations",    color: "#10B981", emissive: "#065F46", y: 3.9,  detail: "700+ APIs · OAuth relay · Webhook broker" },
  { label: "Security Shell",  color: "#F43F5E", emissive: "#9F1239", y: 4.55, detail: "RS256 JWT · Zero-trust · AES-256 graph encryption" },
];

function Layer({
  layer,
  selected,
  onSelect,
}: {
  layer: typeof LAYERS[number];
  selected: boolean;
  onSelect: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetY = layer.y + (hovered || selected ? 0.22 : 0);
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      delta * 6,
    );
    const targetScale = hovered || selected ? 1.05 : 1;
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, delta * 6);
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, delta * 6);
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, layer.y, 0]}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onPointerEnter={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerLeave={() => { setHovered(false); document.body.style.cursor = ""; }}
      castShadow
    >
      <boxGeometry args={[5.5, 0.14, 2.8]} />
      <meshStandardMaterial
        color={layer.color}
        emissive={layer.emissive}
        emissiveIntensity={hovered || selected ? 0.7 : 0.22}
        metalness={0.75}
        roughness={0.12}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function StackGroup({ selectedIdx, onSelect }: { selectedIdx: number; onSelect: (i: number) => void }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={groupRef} position={[0, -2.3, 0]} rotation={[0.22, 0, 0]}>
      {LAYERS.map((layer, i) => (
        <Layer
          key={layer.label}
          layer={layer}
          selected={selectedIdx === i}
          onSelect={() => onSelect(i)}
        />
      ))}
      <Sparkles
        count={140}
        scale={[7, 6, 4]}
        position={[0, 2.3, 0]}
        size={2.2}
        speed={0.35}
        color="#6366F1"
        opacity={0.45}
      />
    </group>
  );
}

export default function ArchitectureCanvas() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = LAYERS[selectedIdx]!;

  function handleSelect(i: number) {
    setSelectedIdx((prev) => (prev === i ? 0 : i));
  }

  return (
    <div style={{ width: "100%", display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap" }}>
      {/* 3D Canvas */}
      <div
        style={{
          flex: "0 0 560px",
          height: 520,
          borderRadius: 24,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "oklch(7% 0.015 265)",
          position: "relative",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.12)",
        }}
      >
        <Canvas
          camera={{ position: [0, 2, 14], fov: 42 }}
          shadows
          gl={{ antialias: true, alpha: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.45} />
          <directionalLight position={[5, 8, 5]} intensity={1.3} castShadow />
          <pointLight position={[-4, 6, -4]} intensity={0.9} color="#8B5CF6" />
          <pointLight position={[4, -2, 4]} intensity={0.6} color="#3B82F6" />
          <StackGroup selectedIdx={selectedIdx} onSelect={handleSelect} />
          <OrbitControls
            enablePan={false}
            minDistance={7}
            maxDistance={20}
            autoRotate={false}
            enableDamping
            dampingFactor={0.07}
          />
        </Canvas>
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 11,
            color: "oklch(36% 0.01 260)",
            pointerEvents: "none",
            letterSpacing: "0.04em",
          }}
        >
          drag to rotate · click a layer to inspect
        </div>
      </div>

      {/* Detail panel */}
      <div style={{ flex: 1, minWidth: 260 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "oklch(63% 0.22 265)",
            marginBottom: 10,
          }}
        >
          Layer {LAYERS.indexOf(selected) + 1} of {LAYERS.length}
        </div>
        <h3
          style={{
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#fff",
            marginBottom: 14,
            lineHeight: 1.1,
          }}
        >
          {selected.label}
        </h3>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 14px",
            borderRadius: 100,
            marginBottom: 28,
            border: `1px solid ${selected.color}55`,
            background: `${selected.color}1A`,
            fontSize: 13,
            color: selected.color,
            fontWeight: 500,
          }}
        >
          {selected.detail}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {LAYERS.map((l, i) => (
            <button
              key={l.label}
              onClick={() => handleSelect(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid",
                borderColor: selectedIdx === i ? `${l.color}50` : "rgba(255,255,255,0.06)",
                background: selectedIdx === i ? `${l.color}14` : "transparent",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.18s cubic-bezier(0.16,1,0.3,1)",
                fontFamily: "inherit",
                width: "100%",
              }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 3,
                  background: l.color,
                  boxShadow: selectedIdx === i ? `0 0 10px ${l.color}99` : "none",
                  flexShrink: 0,
                  transition: "box-shadow 0.18s",
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: selectedIdx === i ? 600 : 400,
                  color: selectedIdx === i ? "#fff" : "oklch(45% 0.01 260)",
                  transition: "color 0.18s",
                }}
              >
                {l.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
