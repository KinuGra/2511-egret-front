'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Earth planet component with realistic blue/green appearance
 */
function Earth({ size, position, score }) {
  const meshRef = useRef();
  
  // Slow rotation animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  // Create realistic Earth texture using canvas
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Create ocean blue base
    const oceanGradient = ctx.createLinearGradient(0, 0, 1024, 512);
    oceanGradient.addColorStop(0, '#1e3a8a');
    oceanGradient.addColorStop(0.5, '#3b82f6');
    oceanGradient.addColorStop(1, '#1e40af');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, 1024, 512);

    // Add land masses (simplified continents)
    ctx.fillStyle = '#22c55e';
    // North America
    ctx.beginPath();
    ctx.arc(200, 150, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(240, 180, 50, 0, Math.PI * 2);
    ctx.fill();
    
    // South America
    ctx.beginPath();
    ctx.arc(280, 320, 45, 0, Math.PI * 2);
    ctx.fill();

    // Europe & Africa
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(520, 150, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(540, 260, 70, 0, Math.PI * 2);
    ctx.fill();

    // Asia
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(700, 160, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(780, 240, 60, 0, Math.PI * 2);
    ctx.fill();

    // Australia
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(850, 360, 35, 0, Math.PI * 2);
    ctx.fill();

    // Add cloud patterns for atmosphere
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const radius = Math.random() * 30 + 10;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group position={position}>
      {/* Earth planet */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial 
          map={earthTexture}
          roughness={0.7}
          metalness={0.2}
          emissive="#001a33"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      
      {/* Label above Earth */}
      <Billboard position={[0, size + 1, 0]}>
        <Text
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          あなた
        </Text>
      </Billboard>
      
      {/* Score display */}
      <Billboard position={[0, size + 1.7, 0]}>
        <Text
          fontSize={0.4}
          color="#00ff88"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {score.toLocaleString()}
        </Text>
      </Billboard>
    </group>
  );
}

/**
 * Saturn planet component with realistic rings
 */
function Saturn({ size, position }) {
  const planetRef = useRef();
  const ringRef = useRef();
  
  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.05;
    }
  });

  // Create Saturn texture (yellowish-brown)
  const saturnTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Create banded appearance
    for (let y = 0; y < 512; y += 20) {
      const variation = Math.random() * 0.2;
      const color = y % 40 === 0 ? `#d4a574` : `#c9944a`;
      ctx.fillStyle = color;
      ctx.fillRect(0, y, 1024, 20);
    }

    // Add some turbulence
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const width = Math.random() * 200 + 50;
      const height = Math.random() * 10 + 5;
      ctx.fillStyle = `rgba(${180 + Math.random() * 40}, ${130 + Math.random() * 40}, ${60 + Math.random() * 30}, 0.3)`;
      ctx.fillRect(x, y, width, height);
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  // Create ring texture
  const ringTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Create concentric rings
    const centerX = 256;
    const centerY = 256;
    
    for (let radius = 0; radius < 256; radius += 3) {
      const alpha = (radius % 20 < 10) ? 0.8 : 0.4;
      const brightness = 150 + Math.random() * 100;
      ctx.strokeStyle = `rgba(${brightness}, ${brightness * 0.85}, ${brightness * 0.6}, ${alpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group position={position}>
      {/* Saturn planet */}
      <mesh ref={planetRef} castShadow receiveShadow>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial 
          map={saturnTexture}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      
      {/* Saturn's rings */}
      <mesh 
        ref={ringRef}
        rotation={[Math.PI / 2.5, 0, 0]}
        receiveShadow
      >
        <ringGeometry args={[size * 1.3, size * 2.2, 64]} />
        <meshStandardMaterial 
          map={ringTexture}
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.8}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}

/**
 * Sun component with emission effects
 */
function Sun({ size, position }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
      // Pulsing effect
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.02 + 1;
      meshRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  // Create sun texture with surface details
  const sunTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Create fiery gradient base
    const gradient = ctx.createRadialGradient(512, 256, 0, 512, 256, 512);
    gradient.addColorStop(0, '#ffff00');
    gradient.addColorStop(0.4, '#ffaa00');
    gradient.addColorStop(0.7, '#ff6600');
    gradient.addColorStop(1, '#ff4400');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);

    // Add solar flares and spots
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const radius = Math.random() * 40 + 10;
      const flareGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      flareGradient.addColorStop(0, 'rgba(255, 200, 0, 0.8)');
      flareGradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.4)');
      flareGradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
      ctx.fillStyle = flareGradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add dark sunspots
    ctx.fillStyle = 'rgba(100, 40, 0, 0.5)';
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const radius = Math.random() * 20 + 5;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <>
      {/* Sun with glow effect */}
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial 
          map={sunTexture}
          emissive="#ff6600"
          emissiveIntensity={1.5}
          roughness={1}
          metalness={0}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh position={position}>
        <sphereGeometry args={[size * 1.1, 32, 32]} />
        <meshBasicMaterial 
          color="#ffaa00"
          transparent={true}
          opacity={0.2}
        />
      </mesh>

      {/* Point light from sun */}
      <pointLight 
        position={position} 
        intensity={2} 
        distance={50}
        color="#ffaa00"
      />
    </>
  );
}

/**
 * Main component that displays all three planets
 */
export function PlanetaryComparison({ score = [1000, 50000, 100000] }) {
  // Calculate sizes based on scores
  const [earthScore, saturnScore, sunScore] = score;
  
  // Normalize sizes (min: 0.8, max: 3.5)
  const maxScore = Math.max(earthScore, saturnScore, sunScore);
  const minSize = 0.8;
  const maxSize = 3.5;
  
  const earthSize = minSize + (earthScore / maxScore) * (maxSize - minSize);
  const saturnSize = minSize + (saturnScore / maxScore) * (maxSize - minSize);
  const sunSize = minSize + (sunScore / maxScore) * (maxSize - minSize);

  return (
    <div style={{ width: '100%', height: '600px', background: '#000' }}>
      <Canvas
        shadows
        camera={{ position: [0, 5, 15], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Background stars */}
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1} 
        />

        {/* Ambient lighting */}
        <ambientLight intensity={0.3} />
        
        {/* Main directional light */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Additional fill light */}
        <directionalLight
          position={[-5, 5, -5]}
          intensity={0.5}
        />

        {/* Planets positioned horizontally */}
        <Earth size={earthSize} position={[-8, 0, 0]} score={earthScore} />
        <Saturn size={saturnSize} position={[0, 0, 0]} />
        <Sun size={sunSize} position={[8, 0, 0]} />

        {/* Mouse controls for camera */}
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={8}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}