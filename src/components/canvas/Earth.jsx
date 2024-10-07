import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

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

  useEffect(() => {
    // Update screen size on resize
    const handleResize = () => {
      const width = window.innerWidth;

      if (width <= 500) {
        setScreenSize("mobile");
      } else if (width <= 900) {
        setScreenSize("tablet");
      } else {
        setScreenSize("large");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
