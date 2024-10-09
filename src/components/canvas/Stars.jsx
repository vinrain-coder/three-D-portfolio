import React, { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

const Stars = (props) => {
  const ref = useRef();

  // Generate positions for stars
  const [sphere] = useState(() => {
    const positions = random.inSphere(new Float32Array(5000), { radius: 1.2 });
    return positions;
  });

  // Rotate stars for a dynamic effect
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  const [screenSize, setScreenSize] = useState("large");

  // Handle screen size changes
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width <= 500) setScreenSize("mobile");
      else if (width <= 900) setScreenSize("tablet");
      else setScreenSize("large");
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  // Set camera position based on screen size
  const cameraPosition = {
    large: [0, 0, 1],
    tablet: [0, 0, 0.8],
    mobile: [0, 0, 0.5],
  }[screenSize];

  return (
    <div className='w-full h-auto absolute inset-0 z-[-1]'>
      <Canvas camera={{ position: cameraPosition }}>
        <Suspense fallback={null}>
          <Stars />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;

