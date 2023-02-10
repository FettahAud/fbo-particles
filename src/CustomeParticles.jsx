import * as THREE from "three";
import { useMemo, useRef } from "react";
import vertex from "./shaders/customParticlesShaders/vertex.js";
import fragment from "./shaders/customParticlesShaders/fragment.js";
import { useFrame } from "@react-three/fiber";

export default function CustomParticles(props) {
  const points = useRef();
  const { count } = props;
  const radius = 2;

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions.set(
        [
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
        ],
        i * 3
      );
    }
    return positions;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0.0,
      },
      u_radius: {
        value: radius,
      },
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    uniforms.u_time.value = clock.elapsedTime;
  });

  return (
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
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
