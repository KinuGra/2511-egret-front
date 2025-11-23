'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Earth planet component with enhanced vibrant appearance
 */
function Earth({ size, position, score }) {
  const meshRef = useRef();

  // Slow rotation animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  // Create enhanced Earth texture
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Create vibrant ocean blue with radial gradient for depth
    const oceanGradient = ctx.createRadialGradient(512, 256, 0, 512, 256, 600);
    oceanGradient.addColorStop(0, '#0ea5e9');
    oceanGradient.addColorStop(0.4, '#0284c7');
    oceanGradient.addColorStop(0.7, '#0369a1');
    oceanGradient.addColorStop(1, '#075985');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, 1024, 512);

    // Add subtle ocean depth variations
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const radius = Math.random() * 80 + 40;
      ctx.fillStyle = `rgba(14, 165, 233, ${0.05 + Math.random() * 0.1})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add vibrant land masses with gradient
    const landGradient = ctx.createLinearGradient(0, 0, 1024, 512);
    landGradient.addColorStop(0, '#10b981');
    landGradient.addColorStop(0.5, '#059669');
    landGradient.addColorStop(1, '#047857');

    // North America
    ctx.fillStyle = landGradient;
    ctx.beginPath();
    ctx.arc(200, 150, 65, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(245, 185, 55, 0, Math.PI * 2);
    ctx.fill();

    // South America
    ctx.beginPath();
    ctx.arc(285, 325, 50, 0, Math.PI * 2);
    ctx.fill();

    // Europe & Africa
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.arc(525, 155, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(545, 265, 75, 0, Math.PI * 2);
    ctx.fill();

    // Asia
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.arc(705, 165, 95, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(785, 245, 65, 0, Math.PI * 2);
    ctx.fill();

    // Australia
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(855, 365, 38, 0, Math.PI * 2);
    ctx.fill();

    // Add beautiful wispy clouds
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const radius = Math.random() * 35 + 15;
      const cloudGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      cloudGradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
      cloudGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
      cloudGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = cloudGradient;
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
          roughness={0.6}
          metalness={0.15}
          emissive="#002244"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Label above Earth */}
      <Billboard position={[0, size + 1.5, 0]}>
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
      <Billboard position={[0, size + 1, 0]}>
        <Text
          fontSize={0.6}
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
 * Jupiter planet component with elegant banding (no Great Red Spot)
 */
function Jupiter({ size, position, score }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
    }
  });

  // Create enhanced Jupiter texture with elegant banding
  const jupiterTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Create smooth, elegant banded cloud layers
    const bands = [
      { y: 0, height: 64, colors: ['#f5e6d3', '#e8d4b8', '#dcc9a8'] },
      { y: 64, height: 56, colors: ['#c9a67a', '#b89968', '#a88c56'] },
      { y: 120, height: 72, colors: ['#f0dfc8', '#e4d3b7', '#d8c7a6'] },
      { y: 192, height: 64, colors: ['#b89668', '#a78956', '#967c44'] },
      { y: 256, height: 80, colors: ['#f8e8d8', '#ecdcc8', '#e0d0b8'] },
      { y: 336, height: 72, colors: ['#c49a70', '#b38d5e', '#a2804c'] },
      { y: 408, height: 104, colors: ['#d4b896', '#c8ac8a', '#bca07e'] }
    ];

    bands.forEach(band => {
      const gradient = ctx.createLinearGradient(0, band.y, 0, band.y + band.height);
      gradient.addColorStop(0, band.colors[0]);
      gradient.addColorStop(0.5, band.colors[1]);
      gradient.addColorStop(1, band.colors[2]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, band.y, 1024, band.height);
    });

    // Add subtle turbulence along bands
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const width = Math.random() * 100 + 50;
      const height = Math.random() * 12 + 4;
      const brightness = 0.95 + Math.random() * 0.1;

      ctx.fillStyle = `rgba(${220 * brightness}, ${190 * brightness}, ${150 * brightness}, ${0.15 + Math.random() * 0.2})`;
      ctx.fillRect(x, y, width, height);
    }

    // Add elegant swirling storms (cream-colored ovals)
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const radiusX = Math.random() * 25 + 12;
      const radiusY = Math.random() * 18 + 8;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(radiusX / radiusY, 1);

      const stormGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radiusY);
      stormGradient.addColorStop(0, 'rgba(255, 250, 240, 0.6)');
      stormGradient.addColorStop(0.5, 'rgba(245, 235, 220, 0.4)');
      stormGradient.addColorStop(1, 'rgba(235, 220, 200, 0)');
      ctx.fillStyle = stormGradient;

      ctx.beginPath();
      ctx.arc(0, 0, radiusY, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Add fine atmospheric details
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const size = Math.random() * 6 + 2;
      ctx.fillStyle = `rgba(${235 + Math.random() * 20}, ${210 + Math.random() * 20}, ${180 + Math.random() * 20}, ${0.1 + Math.random() * 0.15})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          map={jupiterTexture}
          roughness={0.65}
          metalness={0.08}
        />
      </mesh>

      {/* Label above Jupiter */}
      <Billboard position={[0, size + 1.5, 0]}>
        <Text
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          活躍するプレイヤー
        </Text>
      </Billboard>

      {/* Score display */}
      <Billboard position={[0, size + 1, 0]}>
        <Text
          fontSize={0.6}
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
 * Sun component with emission effects
 */
function Sun({ size, position, score }) {
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

      {/* Label above Sun */}
      <Billboard position={[position[0], position[1] + size + 1.5, position[2]]}>
        <Text
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          他プレイヤー
        </Text>
      </Billboard>

      {/* Score display */}
      <Billboard position={[position[0], position[1] + size + 1, position[2]]}>
        <Text
          fontSize={0.6}
          color="#00ff88"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {score.toLocaleString()}
        </Text>
      </Billboard>
    </>
  );
}

/**
 * Main component that displays all three planets with responsive design
 */
export function PlanetaryComparison({ score = [1000, 50000, 100000] }) {
  // Calculate sizes based on scores
  const [earthScore, jupiterScore, sunScore] = score;

  // Track window size for responsive design
  const [windowSize, setWindowSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    // Only run on client side
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Detect mobile device (portrait orientation)
  const isMobile = windowSize.width > 0 && windowSize.width / windowSize.height < 1.0;

  // Responsive settings
  const cameraPosition = isMobile ? [0, 8, 22] : [0, 5, 15];
  const cameraFov = isMobile ? 60 : 50;
  const planetSpacing = isMobile ? 6.5 : 8;
  const containerHeight = isMobile ? '500px' : '600px';

  // Normalize sizes (min: 0.8, max: 3.5)
  const maxScore = Math.max(earthScore, jupiterScore, sunScore);
  const minSize = 0.3;
  const maxSize = 3.5;

  const earthSize = minSize + (earthScore / maxScore) * (maxSize - minSize);
  const jupiterSize = minSize + (jupiterScore / maxScore) * (maxSize - minSize);
  const sunSize = minSize + (sunScore / maxScore) * (maxSize - minSize);

  return (
    <div style={{ width: '100%', height: containerHeight, background: '#000' }}>
      <Canvas
        shadows
        camera={{ position: cameraPosition, fov: cameraFov }}
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

        {/* Background Text - RUNNING (top line) */}
        <Text
          position={[0, 7, -15]}
          fontSize={isMobile ? 4 : 7}
          color="white"
          anchorX="center"
          anchorY="middle"
          letterSpacing={isMobile ? 0.4 : 0.5}
        >
          <meshStandardMaterial
            color="white"
            transparent={true}
            opacity={0.7}
            side={THREE.DoubleSide}
          />
          RUNNING
        </Text>

        {/* Background Text - LATE (bottom line) */}
        <Text
          position={[0, 5, -15]}
          fontSize={isMobile ? 3 : 5.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          letterSpacing={isMobile ? 0.6 : 0.8}
        >
          <meshStandardMaterial
            color="white"
            transparent={true}
            opacity={0.7}
            side={THREE.DoubleSide}
          />
          LATE
        </Text>

        {/* Planets positioned horizontally with responsive spacing */}
        <Earth size={earthSize} position={[-planetSpacing, 0, 0]} score={earthScore} />
        <Jupiter size={jupiterSize} position={[0, 0, 0]} score={jupiterScore} />
        <Sun size={sunSize} position={[planetSpacing, 0, 0]} score={sunScore} />

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