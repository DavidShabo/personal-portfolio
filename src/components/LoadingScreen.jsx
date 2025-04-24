import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useFBX, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

const BlackHoleModel = () => {
  const modelRef = useRef();
  const fbx = useFBX('/models/blackhole/blackhole.fbx');
  
  const blackhole = fbx.clone();
  
  useEffect(() => {
    console.log('Black hole model loaded', blackhole);
    
    blackhole.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        if (child.material) {
          child.material.roughness = 0.6;
          child.material.metalness = 0.8;
        }
      }
    });
  }, [blackhole]);
  
  // Animate the black hole
  useFrame(({ clock }) => {
    if (modelRef.current) {
      // Gentle rotation for the black hole
      modelRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });
  
  return (
    <primitive 
      ref={modelRef} 
      object={blackhole} 
      scale={[0.05, 0.05, 0.05]} // Adjust scale as needed
      position={[0, 0, 0]} 
    />
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
      background: 'black',
      zIndex: 1000
    }}>
      <Canvas 
        camera={{ position: [2, 4, 8], fov: 80
         }}
        shadows
        gl={{ antialias: true }}
      >
        {}
        <ambientLight intensity={1.0} />
        
        {}
        <pointLight position={[10, 10, 10]} intensity={10} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#4040ff" />
        
        {}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade={true} />
        
        {}
        <React.Suspense fallback={null}>
          <BlackHoleModel />
        </React.Suspense>
        
        {}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate={true} 
          autoRotateSpeed={0.5}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
      
      {}
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
          fontSize: '1.8rem',
          letterSpacing: '0.15em',
          fontWeight: 300
        }}>
          INITIALIZING PORTFOLIO
        </h2>
        <div style={{
          width: '280px',
          height: '2px',
          background: 'rgba(255,255,255,0.1)',
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '1px'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #4040ff, #ffffff)',
            transition: 'width 0.3s',
            boxShadow: '0 0 8px rgba(255,255,255,0.8)'
          }} />
        </div>
        <div style={{ 
          marginTop: '0.8rem', 
          fontSize: '0.9rem',
          opacity: 0.8
        }}>
          {Math.floor(progress)}%
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;