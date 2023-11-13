import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

// 폭죽 입자의 수와 생명주기를 정의
const particleCount = 100;
const particleLife = 2.0;

export const Fireworks = ({ position }) => {
  const particlesRef = useRef();
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      const particle = {
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 3,
          Math.random() * 3,
          (Math.random() - 0.5) * 3
        ),
        life: particleLife,
      };
      temp.push(particle);
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    particles.forEach((particle, i) => {
      if (particle.life > 0) {
        particle.life -= delta;
        particle.position.add(particle.velocity.clone().multiplyScalar(delta));
        particle.velocity.multiplyScalar(0.98); // Damping effect
      } else {
        // Reset
        particle.position.copy(position);
        particle.velocity.set(
          (Math.random() - 0.5) * 3,
          Math.random() * 3,
          (Math.random() - 0.5) * 3
        );
        particle.life = particleLife;
      }
      console.log(particlesRef.current.geometry.attributes.position);
      //   particlesRef.current.geometry.attributes.position.setXYZ(
      //     i,
      //     particle.position.x,
      //     particle.position.y,
      //     particle.position.z
      //   );
    });
    // particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={["attributes", "position"]}
          array={new Float32Array(particleCount * 3)}
          count={particleCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        size={0.1}
        color="white"
        transparent
        opacity={0.6}
        sizeAttenuation
        vertexColors
      />
    </points>
  );
};
