import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useFBX, OrbitControls, Stars, Environment, Float, useTexture, Sphere } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

const BlackHoleModel = () => {
  const modelRef = useRef();
  const accretionDiskRef = useRef();
  const eventHorizonRef = useRef();
  const fbx = useFBX('/models/blackhole/blackhole.fbx');
  
  const blackhole = fbx.clone();
  
  useEffect(() => {
    console.log('Black hole model loaded', blackhole);
    
    blackhole.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        if (child.material) {
          // Enhanced material properties for better realism
          child.material.roughness = 0.1;
          child.material.metalness = 0.9;
          child.material.emissive = new THREE.Color(0x330066);
          child.material.emissiveIntensity = 0.3;
          
          // Add environment mapping for reflections
          child.material.envMapIntensity = 1.5;
          
          // Enhanced normal mapping if available
          if (child.material.normalMap) {
            child.material.normalScale = new THREE.Vector2(2, 2);
          }
        }
      }
    });
  }, [blackhole]);

  // Animate the black hole with more complex rotation
  useFrame(({ clock }) => {
    if (modelRef.current) {
      const time = clock.getElapsedTime();
      
      // Multi-axis rotation for more dynamic movement
      modelRef.current.rotation.y = time * 0.15;
      modelRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;
      modelRef.current.rotation.z = Math.cos(time * 0.03) * 0.05;
      
      // Subtle floating motion
      modelRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    }
    
    // Animate accretion disk if present
    if (accretionDiskRef.current) {
      accretionDiskRef.current.rotation.z = time * 0.3;
    }
    
    // Animate event horizon
    if (eventHorizonRef.current) {
      eventHorizonRef.current.material.opacity = 0.3 + Math.sin(time * 2) * 0.1;
      eventHorizonRef.current.rotation.y = -time * 0.8;
    }
  });

  return (
    <group>
      {/* Main black hole model */}
      <Float
        speed={1}
        rotationIntensity={0.2}
        floatIntensity={0.5}
      >
        <primitive 
          ref={modelRef} 
          object={blackhole} 
          scale={[0.08, 0.08, 0.08]}
          position={[0, 0, 0]} 
        />
      </Float>
      
      {/* Event Horizon Sphere */}
      <Sphere ref={eventHorizonRef} args={[2.5, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color={new THREE.Color(0x000000)}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </Sphere>
      
      {/* Accretion Disk */}
      <mesh ref={accretionDiskRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[3, 8, 64]} />
        <meshStandardMaterial
          color={new THREE.Color(0xff6600)}
          emissive={new THREE.Color(0xff2200)}
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Particle Ring Effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[4, 6, 32]} />
        <meshBasicMaterial
          color={new THREE.Color(0x4400ff)}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete && onComplete(), 800);
          return 100;
        }
        return newProgress;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [onComplete]);
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle at center, #001122 0%, #000000 70%)',
      zIndex: 1000
    }}>
      <Canvas 
        camera={{ position: [0, 5, 12], fov: 75 }}
        shadows
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        {/* Enhanced Lighting Setup */}
        <ambientLight intensity={0.3} color={new THREE.Color(0x4444ff)} />
        
        {/* Key lighting for the black hole */}
        <pointLight 
          position={[10, 10, 10]} 
          intensity={15} 
          color={new THREE.Color(0xffffff)}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Rim lighting */}
        <pointLight 
          position={[-15, 5, -10]} 
          intensity={8} 
          color={new THREE.Color(0x6600ff)}
        />
        
        {/* Fill light */}
        <pointLight 
          position={[0, -10, 5]} 
          intensity={5} 
          color={new THREE.Color(0xff4400)}
        />
        
        {/* Directional light for overall illumination */}
        <directionalLight
          position={[20, 20, 20]}
          intensity={2}
          color={new THREE.Color(0xffffff)}
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
        />
        
        {/* Environment for reflections */}
        <Environment preset="night" />
        
        {/* Enhanced Starfield */}
        <Stars 
          radius={150} 
          depth={80} 
          count={8000} 
          factor={6} 
          saturation={0.8} 
          fade={true}
          speed={0.5}
        />
        
        {/* Black Hole Model */}
        <React.Suspense fallback={null}>
          <BlackHoleModel />
        </React.Suspense>
        
        {/* Enhanced Camera Controls */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate={true} 
          autoRotateSpeed={0.8}
          enableDamping={true}
          dampingFactor={0.03}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI - Math.PI / 3}
        />
        
        {/* Post-processing Effects */}
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            height={300}
            opacity={0.8}
          />
          <ChromaticAberration
            offset={new THREE.Vector2(0.002, 0.002)}
          />
          <Vignette
            eskil={false}
            offset={0.1}
            darkness={0.5}
          />
        </EffectComposer>
      </Canvas>
      
      {/* Enhanced UI */}
      <div style={{
        position: 'absolute',
        bottom: '15%',
        width: '100%',
        textAlign: 'center',
        color: 'white',
        fontFamily: '"Space Mono", monospace'
      }}>
        <h2 style={{ 
          marginBottom: '1.5rem', 
          fontSize: '2rem',
          letterSpacing: '0.15em',
          fontWeight: 300,
          textShadow: '0 0 20px rgba(255,255,255,0.5)',
          background: 'linear-gradient(45deg, #ffffff, #66ccff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          INITIALIZING PORTFOLIO
        </h2>
        <div style={{
          width: '320px',
          height: '3px',
          background: 'rgba(255,255,255,0.1)',
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '2px',
          boxShadow: '0 0 10px rgba(255,255,255,0.2)'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #ff4400, #ff6600, #ffaa00, #66ccff)',
            transition: 'width 0.3s ease-out',
            boxShadow: '0 0 15px rgba(255,165,0,0.8)',
            borderRadius: '2px'
          }} />
        </div>
        <div style={{ 
          marginTop: '1rem', 
          fontSize: '1rem',
          opacity: 0.9,
          textShadow: '0 0 10px rgba(255,255,255,0.3)'
        }}>
          {Math.floor(progress)}%
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;