import React, { Suspense, useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Preload,
  useGLTF,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import CanvasLoader from "../Loader";

// Helper function to throttle events like resizing
const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Optimized Computers component using memoization
const Computers = React.memo(({ screenSize }) => {
  const { scene } = useGLTF("./desktop_pc/scene.gltf");

  // Define model properties for different screen sizes
  const modelProps = {
    large: { scale: 0.75, position: [0, -3.25, -1.5], rotation: [-0.01, -0.2, -0.1] },
    tablet: { scale: 0.7, position: [0, -3, -2], rotation: [-0.01, -0.2, -0.1] },
    mobile: { scale: 0.6, position: [0, -2.5, -2.5], rotation: [-0.01, -0.2, -0.1] },
  };

  const currentProps = modelProps[screenSize] || modelProps.large;

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="#2C2C2C" skyColor="#1A1A1A" />

      <directionalLight
        position={[10, 10, 10]}
        intensity={screenSize === "mobile" ? 1.0 : 1.2}
        castShadow={screenSize !== "mobile"} // Disable shadows for mobile
        shadow-mapSize={1024}
        shadow-bias={-0.0001}
      />

      <spotLight
        position={[-20, 50, 10]}
        angle={0.3}
        penumbra={0.9}
        intensity={screenSize === "mobile" ? 1.2 : 1.5}
        castShadow={screenSize !== "mobile"} // Disable shadows for mobile
        shadow-mapSize={1024}
      />

      <primitive
        object={scene}
        scale={currentProps.scale}
        position={currentProps.position}
        rotation={currentProps.rotation}
      />
    </mesh>
  );
});

const ComputersCanvas = () => {
  const [screenSize, setScreenSize] = useState("large");
  let resizeTimeout = null; // For throttling resize events

  // Update screen size with requestAnimationFrame for better performance
  const updateScreenSize = useCallback(() => {
    const width = window.innerWidth;
    const newSize = width <= 500 ? "mobile" : width <= 900 ? "tablet" : "large";

    // Only set state if the size has changed
    if (newSize !== screenSize) {
      setScreenSize(newSize);
    }
  }, [screenSize]);

  useEffect(() => {
    const handleResize = () => {
      if (!resizeTimeout) {
        resizeTimeout = requestAnimationFrame(() => {
          updateScreenSize();
          resizeTimeout = null;
        });
      }
    };

    window.addEventListener("resize", handleResize);
    updateScreenSize(); // Initial detection

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updateScreenSize]);

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
      shadows={screenSize !== "mobile"} // Disable shadows for mobile to boost performance
      dpr={[1, screenSize === "mobile" ? 1.5 : 2]} // Lower pixel ratio for mobile
      camera={currentCameraProps}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
        <Computers screenSize={screenSize} />
        <Environment background={false} preset="sunset" />

        {/* Conditional soft shadows for better performance on non-mobile devices */}
        {screenSize !== "mobile" && (
          <ContactShadows
            position={[0, -3.25, 0]}
            opacity={0.7}
            scale={10}
            blur={2.5}
            far={4.5}
          />
        )}
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;

