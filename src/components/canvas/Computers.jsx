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

const Computers = ({ screenSize }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  // Adjust scale and position based on screen size
  const modelProps = {
    large: { scale: 0.75, position: [0, -3.25, -1.5], rotation: [-0.01, -0.2, -0.1] },
    tablet: { scale: 0.7, position: [0, -3, -2], rotation: [-0.01, -0.2, -0.1] },
    mobile: { scale: 0.6, position: [0, -2.5, -2.5], rotation: [-0.01, -0.2, -0.1] },
  };

  const currentProps = modelProps[screenSize] || modelProps.large;

  return (
    <mesh>
      {/* Hemisphere Light */}
      <hemisphereLight intensity={0.2} groundColor="#2C2C2C" skyColor="#1A1A1A" />

      {/* Directional Light */}
      <directionalLight
        position={[10, 10, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={1024}
        shadow-bias={-0.0001}
      />

      {/* Spotlight */}
      <spotLight
        position={[-20, 50, 10]}
        angle={0.3}
        penumbra={0.9}
        intensity={1.5}
        castShadow
        shadow-mapSize={1024}
      />

      {/* Point Light */}
      <pointLight position={[0, 10, 0]} intensity={1} />

      {/* 3D Model */}
      <primitive
        object={computer.scene}
        scale={currentProps.scale}
        position={currentProps.position}
        rotation={currentProps.rotation}
      />

      {/* Material enhancements */}
      <meshStandardMaterial metalness={0.6} roughness={0.4} />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [screenSize, setScreenSize] = useState("large");

  useEffect(() => {
    // Define breakpoints for screen sizes
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

    // Call function initially to set the correct screen size
    updateScreenSize();

    // Add a listener for window resizing
    window.addEventListener("resize", updateScreenSize);

    // Clean up listener on component unmount
    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  const cameraProps = {
    large: { position: [20, 3, 5], fov: 25 },
    tablet: { position: [15, 3, 5], fov: 30 },
    mobile: { position: [10, 2, 4], fov: 35 },
  };

  const currentCameraProps = cameraProps[screenSize] || cameraProps.large;

  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={[1, 2]}
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

        {/* 3D Model */}
        <Computers screenSize={screenSize} />

        {/* Environment */}
        <Environment background={false} preset="sunset" />

        {/* Soft Shadows */}
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

