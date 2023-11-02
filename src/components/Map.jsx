import { Text } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import React, { useState } from "react";

export const Map = ({ setPosition }) => {
  /**
   * 꾹 누르고 있을 때도 이동할 수 있게 함.
   */
  const [isPointerDown, setIsPointerDown] = useState(false);

  const handlePointerDown = (e) => {
    setIsPointerDown(true);
    setPosition([e.point.x, 0, e.point.z]);
  };

  const handlePointerMove = (e) => {
    if (isPointerDown) {
      setPosition([e.point.x, 0, e.point.z]);
    }
  };

  const handlePointerUp = () => {
    setIsPointerDown(false);
  };

  return (
    <>
      <RigidBody colliders="trimesh" type="fixed">
        <mesh
          rotation-x={-Math.PI / 2}
          position={[40, 0, 40]}
          receiveShadow
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color={"#6e6e6e"} />
        </mesh>
      </RigidBody>
      <RigidBody colliders="trimesh" type="fixed" position={[15, 5, 5]}>
        {/* <Text position={[15, 3, 0]} fontSize={10}>
          Portpolio
        </Text> */}
        <mesh>
          <boxGeometry args={[10, 10, 10]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>
    </>
  );
};
