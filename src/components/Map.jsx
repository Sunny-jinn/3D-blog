import { Text } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { touchAtom } from "./CharacterController";
import { useSpring, a, animated } from "@react-spring/three";

export const Map = ({ setPosition }) => {
  /**
   * 꾹 누르고 있을 때도 이동할 수 있게 함.
   */
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isTouched, setIsTouched] = useAtom(touchAtom);
  const [showText, setShowText] = useState(false);

  // 애니메이션의 opacity 값을 제어합니다.
  const { opacity } = useSpring({
    opacity: isTouched ? 1 : 0,
    config: { duration: 4000 },
    onRest: () => {
      // opacity가 0이 될 때 컴포넌트를 더 이상 렌더링하지 않도록 설정합니다.
      if (!isTouched) setShowText(false);
    },
    onStart: () => {
      // 애니메이션이 시작될 때 컴포넌트를 렌더링하도록 설정합니다.
      if (isTouched) setShowText(true);
    },
  });

  const AnimatedMaterial = animated("meshStandardMaterial");

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
      <RigidBody
        colliders="trimesh"
        type="fixed"
        position={[15, 5, 5]}
        name="testBox"
      >
        <mesh>
          <boxGeometry args={[10, 10, 10]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>
      <RigidBody
        colliders="trimesh"
        type="fixed"
        position={[15, 5, 15]}
        name="testSphere"
      >
        <mesh>
          <sphereGeometry args={[5, 32, 32]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>
      {showText && (
        <Text position={[20, 5, 20]} fontSize={20}>
          HI
          <AnimatedMaterial color="#000" opacity={opacity} transparent />
        </Text>
      )}
    </>
  );
};
