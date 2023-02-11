import { useFBO } from "@react-three/drei";
import { useFrame, extend, createPortal } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

import SimulationMaterial from "./SimulationMaterial";

import vertex from "./shaders/FBOPointsShaders/vertex";
import fragment from "./shaders/FBOPointsShaders/fragment";

import { useControls } from "leva";

extend({ SimulationMaterial: SimulationMaterial });

const FBOParticles = () => {
  const size = 128;

  const points = useRef();
  const [simulationMaterial] = useState(() => new SimulationMaterial(size));

  const controls = useControls({
    frequency: {
      value: 0.25,
      min: 0.01,
      max: 1,
      step: 0.01,
      onChange: (value) => {
        simulationMaterial.uniforms.uFrequency.value = value;
      },
    },
    pointSize: {
      value: 3,
      min: 0.5,
      max: 4,
      step: 0.01,
      onChange: (value) => {
        points.current.material.uniforms.uSize.value = value;
      },
    },
  });

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    -1,
    1,
    1,
    -1,
    1 / Math.pow(2, 53),
    1
  );
  const positions = new Float32Array([
    -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
  ]);
  const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);

  const renderTarget = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    type: THREE.FloatType,
  });

  const particlesPosition = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      let i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);

  const uniforms = useMemo(
    () => ({
      uPositions: {
        value: null,
      },
      uSize: {
        value: 3,
      },
    }),
    []
  );

  useFrame((state) => {
    const { gl, clock } = state;

    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    points.current.material.uniforms.uPositions.value = renderTarget.texture;

    simulationMaterial.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <>
      {createPortal(
        <mesh material={simulationMaterial}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-uv"
              count={uvs.length / 2}
              array={uvs}
              itemSize={2}
            />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fragmentShader={fragment}
          vertexShader={vertex}
          uniforms={uniforms}
        />
      </points>
    </>
  );
};

export default FBOParticles;
