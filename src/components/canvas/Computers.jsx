import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Preload,
  useGLTF,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  return (
    <mesh>
      {/* Hemisphere Light with reduced intensity */}
      <hemisphereLight
        intensity={0.2} // Keep intensity low for a darker scene
        groundColor="#2C2C2C" // Dark gray for a subtler ground reflection
        skyColor="#1A1A1A" // Near-black to darken the sky reflection
      />

      {/* Directional Light for sharper shadows, toned down */}
      <directionalLight
        position={[10, 10, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={1024}
        shadow-bias={-0.0001}
      />

      {/* Spotlight with softer glow and lower intensity */}
      <spotLight
        position={[-20, 50, 10]}
        angle={0.3}
        penumbra={0.9}
        intensity={1.5}
        castShadow
        shadow-mapSize={1024}
      />

      {/* Point light for subtle fill */}
      <pointLight position={[0, 10, 0]} intensity={1} />

      {/* The 3D Model with updated material for realism */}
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.7 : 0.75}
        position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />

      {/* Enhance material to make it more realistic */}
      <meshStandardMaterial
        metalness={0.6} // Introduce a subtle metallic look
        roughness={0.4} // Control the surface roughness for realism
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        {/* Camera Controls */}
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />

        {/* 3D Model */}
        <Computers isMobile={isMobile} />

        {/* Add Environment for reflections */}
        <Environment background={false} preset="sunset" />

        {/* Soft shadows below the object */}
        <ContactShadows
          position={[0, -3.25, 0]}
          opacity={0.7}
          scale={10}
          blur={2.5}
          far={4.5}
        />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
