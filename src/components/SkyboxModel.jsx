import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SkyboxModel = () => {
  const modelRef = useRef();
  const { scene } = useGLTF('/models/skybox/sky_box.glb');
  useGLTF.preload('/models/skybox/sky_box.glb');

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.material.side = THREE.BackSide;
          child.material.depthWrite = false;
          child.material.fog = false;
          child.material.transparent = true;
          child.material.opacity = 1;
        }
      });
    }
  }, [scene]);

  useFrame(({ clock }) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = clock.getElapsedTime() * 0.005;
    }
  });

  return (
    <primitive ref={modelRef} object={scene} scale={[10, 10, 10]} position={[0, 0, 0]} />
  );
};

export default SkyboxModel;
