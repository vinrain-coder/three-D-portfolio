import { Suspense, memo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
  useTexture,
} from "@react-three/drei";

import CanvasLoader from "../Loader";

// Memoized Ball component to prevent unnecessary re-renders
const Ball = memo((props) => {
  const [decal] = useTexture([props.imgUrl]);

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      {/* Reduced light intensity for better performance */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[0, 0, 0.05]} intensity={0.8} />
      <mesh castShadow receiveShadow scale={2.75}>
        {/* Using a lower detail level for icosahedronGeometry for better performance */}
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color='#fff8eb'
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={1}
          map={decal}
          flatShading
        />
      </mesh>
    </Float>
  );
});

// Canvas component with performance optimizations
const BallCanvas = ({ icon }) => {
  return (
    <Canvas
      frameloop="demand" // Ensures rendering only when necessary
      dpr={[1, 2]} // Device pixel ratio for sharper visuals on high-DPI displays
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        {/* Disable zoom to limit unnecessary computations */}
        <OrbitControls enableZoom={false} />
        <Ball imgUrl={icon} />
      </Suspense>

      {/* Preload all assets for smoother loading experience */}
      <Preload all />
    </Canvas>
  );
};

export default BallCanvas;
