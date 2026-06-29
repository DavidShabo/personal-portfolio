import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useFBX, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Preload the FBX so it's cached before the loading screen renders
useFBX.preload?.('/models/blackhole/blackhole.fbx');

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

  const [positions, colors] = useMemo(() => {
    const count = 64;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#00ff9d'),
      new THREE.Color('#00fff7'),
      new THREE.Color('#e0baff'),
    ];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 0.5 + Math.sin(i * 0.3) * 0.1;
      pos[i * 3]     = Math.cos(angle) * radius;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      const c = palette[i % 3];
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.getElapsedTime() * 0.18;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.025} vertexColors transparent opacity={0.6} sizeAttenuation />
      </points>
    </group>
  );
}

function FloatingDebris() {
  const meshRef = useRef();

  const { dummy, count, initialPositions } = useMemo(() => {
    const n = 20;
    const dummy = new THREE.Object3D();
    const initialPositions = Array.from({ length: n }, () => ({
      x: (Math.random() - 0.5) * 4,
      y: (Math.random() - 0.5) * 4,
      z: (Math.random() - 0.5) * 4,
      rx: Math.random() * Math.PI,
      ry: Math.random() * Math.PI,
      rz: Math.random() * Math.PI,
      scale: Math.random() * 0.5 + 0.5,
    }));
    return { dummy, count: n, initialPositions };
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;
    initialPositions.forEach((item, i) => {
      dummy.position.set(item.x, item.y, item.z);
      dummy.rotation.set(item.rx, item.ry, item.rz);
      dummy.scale.setScalar(item.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy, initialPositions]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    initialPositions.forEach((item, i) => {
      dummy.position.set(item.x, item.y + Math.sin(t + i) * 0.001 * i, item.z);
      dummy.rotation.set(item.rx + t * 0.01, item.ry + t * 0.01, item.rz);
      dummy.scale.setScalar(item.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[0.02, 0.02, 0.02]} />
      <meshBasicMaterial color={'#00ff9d'} transparent opacity={0.4} />
    </instancedMesh>
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

const loadingPhases = [
  "INITIALIZING QUANTUM CORE",
  "CALIBRATING SPACE-TIME",
  "LOADING NEURAL NETWORKS",
  "ESTABLISHING WORMHOLE",
  "PORTFOLIO READY"
];

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
  const modelsLoadedRef = useRef(false);

  const handleModelLoad = () => {
    modelsLoadedRef.current = true;
    setModelsLoaded(true);
  };

  useEffect(() => {
    setShow(true);
    const textTimer = setTimeout(() => setShowText(true), 500);

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 0.8;

        if (newProgress >= 80 && !modelsLoadedRef.current) return 80;

        if (newProgress >= 100) {
          clearInterval(interval);
          setLoadingComplete(true);
          setTimeout(() => onComplete && onComplete(), 2000);
          return 100;
        }

        if (newProgress >= 20) setLoadingPhase(p => p === 0 ? 1 : p);
        if (newProgress >= 40) setLoadingPhase(p => p === 1 ? 2 : p);
        if (newProgress >= 60) setLoadingPhase(p => p === 2 ? 3 : p);
        if (newProgress >= 80) setLoadingPhase(p => p === 3 ? 4 : p);

        return newProgress;
      });
    }, 120);

    return () => {
      clearInterval(interval);
      clearTimeout(textTimer);
    };
  }, [onComplete]);

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
          <BlackHoleModel onModelLoad={handleModelLoad} />
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
