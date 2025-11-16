/* eslint-disable react/no-unknown-property */
import * as THREE from "three";
import { useRef, useState, useEffect, memo } from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import {
  useFBO,
  useScroll,
  Image,
  Scroll,
  Preload,
  ScrollControls,
  MeshTransmissionMaterial,
  Text,
} from "@react-three/drei";
import { easing } from "maath";

export default function FluidGlassSimple({ mode = "lens" }) {
  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
      <ScrollControls damping={0.2} pages={3} distance={0.4}>
        <LensSimple>
          <Scroll>
            <Typography />
            <Images />
          </Scroll>
          <Scroll html />
          <Preload />
        </LensSimple>
      </ScrollControls>
    </Canvas>
  );
}

const LensSimple = memo(function LensSimple({ children }) {
  const ref = useRef();
  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = useState(() => new THREE.Scene());

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = (pointer.x * v.width) / 2;
    const destY = (pointer.y * v.height) / 2;
    easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.setClearColor(0x000000, 0);
  });

  return (
    <>
      {createPortal(children, scene)}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>
      <mesh ref={ref} scale={0.15} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[1, 1, 0.5, 64]} />
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={1.2}
          thickness={5}
          anisotropy={0.01}
          chromaticAberration={0.15}
        />
      </mesh>
    </>
  );
});

function Images() {
  const group = useRef();
  const data = useScroll();
  const { height } = useThree((s) => s.viewport);

  // Use your existing hero images or placeholder
  const img1 = "/hero-2.avif";
  const img2 = "/hero-3.avif";
  const img3 = "/hero-4.avif";

  useFrame(() => {
    if (!group.current?.children) return;
    const children = group.current.children;
    if (children[0]?.material)
      children[0].material.zoom = 1 + data.range(0, 1 / 3) / 3;
    if (children[1]?.material)
      children[1].material.zoom = 1 + data.range(0, 1 / 3) / 3;
    if (children[2]?.material)
      children[2].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
    if (children[3]?.material)
      children[3].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
    if (children[4]?.material)
      children[4].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
  });

  return (
    <group ref={group}>
      <Image position={[-2, 0, 0]} scale={[3, height / 1.1, 1]} url={img1} />
      <Image position={[2, 0, 3]} scale={3} url={img2} />
      <Image position={[-2.05, -height, 6]} scale={[1, 3, 1]} url={img3} />
      <Image position={[-0.6, -height, 9]} scale={[1, 2, 1]} url={img1} />
      <Image position={[0.75, -height, 10.5]} scale={1.5} url={img2} />
    </group>
  );
}

function Typography() {
  const DEVICE = {
    mobile: { fontSize: 0.2 },
    tablet: { fontSize: 0.4 },
    desktop: { fontSize: 0.5 },
  };

  const getDevice = () => {
    const w = window.innerWidth;
    return w <= 639 ? "mobile" : w <= 1023 ? "tablet" : "desktop";
  };

  const [device, setDevice] = useState(getDevice());

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { fontSize } = DEVICE[device];

  return (
    <Text
      position={[0, 0, 12]}
      fontSize={fontSize}
      letterSpacing={-0.05}
      outlineWidth={0}
      outlineBlur="20%"
      outlineColor="#000"
      outlineOpacity={0.5}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      AI That Runs Businesses
    </Text>
  );
}
