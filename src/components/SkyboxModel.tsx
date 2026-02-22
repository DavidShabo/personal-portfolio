import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SkyboxModel = () => {
  /** @type {import("react").MutableRefObject<import("three").Object3D | null>} */
  const modelRef = useRef(null);

  const { scene } = useGLTF("/models/skybox/skybox.glb");

  useEffect(() => {
    if (!scene) return;

    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const mat = obj.material;
        const mats = Array.isArray(mat) ? mat : [mat];

        mats.forEach((m) => {
          m.side = THREE.BackSide;
          m.depthWrite = false;
          m.fog = false;
          m.transparent = true;
          m.opacity = 1;
          m.needsUpdate = true;
        });
      }
    });
  }, [scene]);

  useFrame(({ clock }) => {
    const obj = modelRef.current;
    if (obj) {
      obj.rotation.y = clock.getElapsedTime() * 0.005;
    }
  });

  if (!scene) return null;

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={[10, 10, 10]}
      position={[0, 0, 0]}
      frustumCulled={false}
    />
  );
};

useGLTF.preload("/models/skybox/skybox.glb");

export default SkyboxModel;