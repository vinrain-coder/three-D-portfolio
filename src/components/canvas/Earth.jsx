import React, { Suspense, useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

// Optimized Earth component using memoization
const Earth = React.memo(() => {
  const earth = useGLTF("./planet/scene.gltf");

  return (
    <primitive
      object={earth.scene}
      scale={2.5}
      position-y={0}
      rotation-y={0}
    />
  );
});

const EarthCanvas = () => {
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

  // Set camera and DPR based on screen size
  const cameraProps = {
    large: { position: [-4, 3, 6], fov: 45 },
    tablet: { position: [-3, 2, 5], fov: 50 },
    mobile: { position: [-2, 1.5, 4], fov: 55 },
  };

  const currentCameraProps = cameraProps[screenSize] || cameraProps.large;

  return (
    <Canvas
      shadows
      frameloop="demand"
      dpr={screenSize === "mobile" ? [1, 1.5] : [1, 2]} // Reduce DPR on mobile for better performance
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: currentCameraProps.fov,
        near: 0.1,
        far: 200,
        position: currentCameraProps.position,
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        {/* Smooth Orbit Controls with auto-rotation */}
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default EarthCanvas;

