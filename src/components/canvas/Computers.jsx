import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Preload,
  useGLTF,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import CanvasLoader from "../Loader";

// Optimize Computers component using screenSize and memoization to avoid unnecessary re-renders
const Computers = React.memo(({ screenSize }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  // Define model properties (scale, position, and rotation) for different screen sizes
  const modelProps = {
    large: { scale: 0.75, position: [0, -3.25, -1.5], rotation: [-0.01, -0.2, -0.1] },
    tablet: { scale: 0.7, position: [0, -3, -2], rotation: [-0.01, -0.2, -0.1] },
    mobile: { scale: 0.6, position: [0, -2.5, -2.5], rotation: [-0.01, -0.2, -0.1] },
  };

  const currentProps = modelProps[screenSize] || modelProps.large;

  return (
    <mesh>
      {/* Hemisphere Light for ambient lighting */}
      <hemisphereLight intensity={0.15} groundColor="#2C2C2C" skyColor="#1A1A1A" />

      {/* Directional Light - slightly reduced intensity for mobile */}
      <directionalLight
        position={[10, 10, 10]}
        intensity={screenSize === "mobile" ? 1.0 : 1.2}
        castShadow
        shadow-mapSize={1024}
        shadow-bias={-0.0001}
      />

      {/* Spotlight with optimized intensity */}
      <spotLight
        position={[-20, 50, 10]}
        angle={0.3}
        penumbra={0.9}
        intensity={screenSize === "mobile" ? 1.2 : 1.5}
        castShadow
        shadow-mapSize={1024}
      />

      {/* 3D Model with adjusted scale and position */}
      <primitive
        object={computer.scene}
        scale={currentProps.scale}
        position={currentProps.position}
        rotation={currentProps.rotation}
      />
    </mesh>
  );
});

const ComputersCanvas = () => {
  const [screenSize, setScreenSize] = useState("large");

  useEffect(() => {
    // Define breakpoints and update screen size dynamically
    const updateScreenSize = () => {
      const width = window.innerWidth;

      if (width <= 500) {
        setScreenSize("mobile");
      } else if (width <= 900) {
        setScreenSize("tablet");
      } else {
        setScreenSize("large");
      }
    };

    // Initial screen size detection
    updateScreenSize();

    // Listen to window resize events
    window.addEventListener("resize", updateScreenSize);

    // Clean up event listener
    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  // Define camera properties for different screen sizes
  const cameraProps = {
    large: { position: [20, 3, 5], fov: 25 },
    tablet: { position: [15, 3, 5], fov: 30 },
    mobile: { position: [10, 2, 4], fov: 35 },
  };

  const currentCameraProps = cameraProps[screenSize] || cameraProps.large;

  return (
    <Canvas
      frameloop="demand" // Avoid unnecessary re-renders
      shadows
      dpr={[1, screenSize === "mobile" ? 1.5 : 2]} // Lower pixel ratio for mobile to boost performance
      camera={currentCameraProps}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        {/* Camera Controls */}
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />

        {/* Render the 3D Model */}
        <Computers screenSize={screenSize} />

        {/* Environment Lighting for realistic reflections */}
        <Environment background={false} preset="sunset" />

        {/* Soft shadows for depth effect */}
        <ContactShadows
          position={[0, -3.25, 0]}
          opacity={0.7}
          scale={10}
          blur={2.5}
          far={4.5}
        />
      </Suspense>

      {/* Preload all assets for smoother transitions */}
      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;

