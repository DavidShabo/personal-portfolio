import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useFBX, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

function AccretionDisk() {
  const mesh = useRef();
  const mesh2 = useRef();
  const mesh3 = useRef();
  
  useFrame(({ clock }) => {
    if (mesh.current) mesh.current.rotation.z = clock.getElapsedTime() * 0.25;
    if (mesh2.current) mesh2.current.rotation.z = -clock.getElapsedTime() * 0.15;
    if (mesh3.current) mesh3.current.rotation.z = clock.getElapsedTime() * 0.35;
  });
  
  return (
    <group>
      <mesh ref={mesh} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[0.32, 0.09, 32, 128]} />
        <meshBasicMaterial color={'#e0baff'} transparent opacity={0.45} />
      </mesh>
      <mesh ref={mesh2} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[0.45, 0.06, 32, 128]} />
        <meshBasicMaterial color={'#00ff9d'} transparent opacity={0.3} />
      </mesh>
      <mesh ref={mesh3} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[0.58, 0.04, 32, 128]} />
        <meshBasicMaterial color={'#00fff7'} transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

function ParticleRing() {
  const group = useRef();
  const particles = Array.from({ length: 64 }).map((_, i) => {
    const angle = (i / 64) * Math.PI * 2;
    const radius = 0.5 + Math.sin(i * 0.3) * 0.1;
    return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
  });
  
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.getElapsedTime() * 0.18;
  });
  
  return (
    <group ref={group}>
      {particles.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshBasicMaterial 
            color={i % 3 === 0 ? '#00ff9d' : i % 3 === 1 ? '#00fff7' : '#e0baff'} 
            transparent 
            opacity={0.6} 
          />
        </mesh>
      ))}
    </group>
  );
}

function FloatingDebris() {
  const group = useRef();
  const debris = Array.from({ length: 20 }).map((_, i) => ({
    position: [
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4
    ],
    rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
    scale: Math.random() * 0.5 + 0.5
  }));
  
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.children.forEach((child, i) => {
        child.rotation.x += 0.01;
        child.rotation.y += 0.01;
        child.position.y += Math.sin(clock.getElapsedTime() + i) * 0.001;
      });
    }
  });
  
  return (
    <group ref={group}>
      {debris.map((item, i) => (
        <mesh key={i} position={item.position} rotation={item.rotation} scale={item.scale}>
          <boxGeometry args={[0.02, 0.02, 0.02]} />
          <meshBasicMaterial 
            color={i % 4 === 0 ? '#00ff9d' : i % 4 === 1 ? '#00fff7' : i % 4 === 2 ? '#e0baff' : '#ffffff'} 
            transparent 
            opacity={0.4} 
          />
        </mesh>
      ))}
    </group>
  );
}

function EnergyField() {
  const mesh = useRef();
  
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.material.opacity = 0.1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
    }
  });
  
  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshBasicMaterial color={'#00ff9d'} transparent opacity={0.1} wireframe />
    </mesh>
  );
}

const BlackHoleModel = ({ onModelLoad }) => {
  const modelRef = useRef();
  const fbx = useFBX('/models/blackhole/blackhole.fbx');
  const blackhole = fbx.clone();
  
  useEffect(() => {
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
    
    // Signal that the blackhole model is loaded
    onModelLoad && onModelLoad();
  }, [blackhole, onModelLoad]);
  
  useFrame(({ clock }) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = clock.getElapsedTime() * 0.18;
      const scale = 0.07 + Math.sin(clock.getElapsedTime() * 3) * 0.005;
      modelRef.current.scale.set(scale, scale, scale);
    }
  });
  
  return (
    <primitive ref={modelRef} object={blackhole} scale={[0.07, 0.07, 0.07]} position={[0, 0, 0]} />
  );
};

const VignetteOverlay = () => (
  <div style={{
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 1100,
    background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.8) 100%)',
    transition: 'opacity 0.8s',
  }} />
);

const LoadingText = ({ text, show, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (show && currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100 + delay);
      return () => clearTimeout(timer);
    }
  }, [show, currentIndex, text, delay]);
  
  return (
    <span style={{
      opacity: show ? 1 : 0,
      transition: 'opacity 0.5s ease',
      display: 'inline-block',
      minHeight: '1.2em'
    }}>
      {displayText}
      <span style={{ animation: 'blink 1s infinite', marginLeft: '2px' }}>|</span>
    </span>
  );
};

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);
  const [showText, setShowText] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  
  const loadingPhases = [
    "INITIALIZING QUANTUM CORE",
    "CALIBRATING SPACE-TIME",
    "LOADING NEURAL NETWORKS",
    "ESTABLISHING WORMHOLE",
    "PORTFOLIO READY"
  ];
  
  useEffect(() => {
    setShow(true);
    
    const textTimer = setTimeout(() => setShowText(true), 500);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 0.8; 
        
        if (newProgress >= 80 && !modelsLoaded) {
          return 80;
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setLoadingComplete(true);
          if (modelsLoaded) {
            setTimeout(() => onComplete && onComplete(), 2000);
          }
          return 100;
        }
        
        if (newProgress >= 20 && loadingPhase === 0) setLoadingPhase(1);
        if (newProgress >= 40 && loadingPhase === 1) setLoadingPhase(2);
        if (newProgress >= 60 && loadingPhase === 2) setLoadingPhase(3);
        if (newProgress >= 80 && loadingPhase === 3) setLoadingPhase(4);
        
        return newProgress;
      });
    }, 120); 
    
    return () => {
      clearInterval(interval);
      clearTimeout(textTimer);
    };
  }, [onComplete, loadingPhase, modelsLoaded]);
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(180deg, #0a0a1a 0%, #000 100%)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <Canvas
        camera={{ position: [2, 4, 8], fov: 80 }}
        shadows
        gl={{ antialias: true }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1001 }}
      >
        <ambientLight intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={12} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#4040ff" />
        <pointLight position={[0, 10, 0]} intensity={8} color="#00ff9d" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.1} fade={true} />
        <fog attach="fog" args={["#0a0a1a", 8, 18]} />
        <React.Suspense fallback={null}>
          <BlackHoleModel onModelLoad={() => {
            setModelsLoaded(true);
          }} />
          <AccretionDisk />
          <ParticleRing />
          <FloatingDebris />
          <EnergyField />
        </React.Suspense>
        <OrbitControls 
          enableZoom={true} 
          enablePan={true} 
          autoRotate={true} 
          autoRotateSpeed={0.5}
          enableDamping={true}
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={15}
        />
      </Canvas>
      <VignetteOverlay />
      
      <div style={{
        position: 'relative',
        zIndex: 1200,
        width: '100%',
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Space Mono, monospace',
        marginTop: 'auto',
        marginBottom: '8vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <h2 style={{
          marginBottom: '1rem',
          fontSize: '1.8rem',
          letterSpacing: '0.15em',
          fontWeight: 400,
          opacity: show ? 1 : 0,
          transition: 'opacity 1.2s cubic-bezier(0.4,0,0.2,1)',
          textShadow: '0 0 16px #00ff9d, 0 0 32px #00fff7, 0 0 8px #e0baff',
          filter: 'blur(0.5px)',
        }}>
          <LoadingText text="INITIALIZING PORTFOLIO" show={showText} />
        </h2>
        
                 <div style={{
           marginBottom: '2rem',
           fontSize: '1rem',
           opacity: 0.8,
           textShadow: '0 0 8px #00ff9d',
           minHeight: '1.2em',
           transition: 'all 0.5s ease',
         }}>
           <LoadingText text={loadingPhases[loadingPhase]} show={showText} delay={200} />
           {progress >= 80 && !modelsLoaded && (
             <div style={{
               marginTop: '1rem',
               fontSize: '0.9rem',
               opacity: 0.7,
               color: '#00fff7',
               animation: 'pulse 1.5s infinite'
             }}>
               Loading 3D Models...
             </div>
           )}
           {modelsLoaded && progress >= 80 && (
             <div style={{
               marginTop: '1rem',
               fontSize: '0.9rem',
               opacity: 1,
               color: '#00ff9d',
               animation: 'fadeIn 0.5s ease-out'
             }}>
               ✓ 3D Models Loaded
             </div>
           )}
         </div>
        
        <div style={{
          width: '400px',
          height: '10px',
          background: 'rgba(255,255,255,0.08)',
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '5px',
          boxShadow: '0 0 20px #00ff9d44',
          border: '1px solid rgba(0, 255, 157, 0.3)',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #00ff9d 0%, #00fff7 50%, #e0baff 100%)',
            transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: '0 0 20px #00ff9d, 0 0 40px #00fff7',
            filter: 'blur(0.5px)',
            animation: 'pulseGlow 1.2s infinite alternate',
            borderRadius: '4px',
          }} />
        </div>
        
        <div style={{
          marginTop: '1.2rem',
          fontSize: '1.2rem',
          opacity: 0.9,
          textShadow: '0 0 12px #00ff9d',
          fontWeight: 'bold',
        }}>
          {Math.floor(progress)}%
        </div>
        
        <div style={{
          marginTop: '2rem',
          fontSize: '0.9rem',
          opacity: 0.6,
          textShadow: '0 0 6px #00ff9d',
          maxWidth: '500px',
          lineHeight: '1.4',
        }}>
          <LoadingText text="Preparing to explore the digital cosmos..." show={showText} delay={1000} />
        </div>
        
        <div style={{
          marginTop: '1.5rem',
          fontSize: '0.8rem',
          opacity: 0.5,
          color: '#00fff7',
          textShadow: '0 0 4px #00fff7',
          animation: 'fadeInOut 3s infinite',
        }}>
          💡 Try zooming and rotating the blackhole while you wait!
        </div>
      </div>
      
             <style>{`
         @keyframes pulseGlow {
           0% { box-shadow: 0 0 15px #00ff9d, 0 0 30px #00fff7; }
           100% { box-shadow: 0 0 25px #00ff9d, 0 0 50px #00fff7; }
         }
         @keyframes blink {
           0%, 50% { opacity: 1; }
           51%, 100% { opacity: 0; }
         }
         @keyframes pulse {
           0%, 100% { opacity: 0.7; }
           50% { opacity: 1; }
         }
         @keyframes fadeInOut {
           0%, 100% { opacity: 0.3; }
           50% { opacity: 0.7; }
         }
       `}</style>
    </div>
  );
};

export default LoadingScreen;