import { Text } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { touchAtom } from "./CharacterController";
import { useSpring, a, animated } from "@react-spring/three";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { Wall } from "./Wall";

export const Map = ({ setPosition }) => {
  /**
   * 꾹 누르고 있을 때도 이동할 수 있게 함.
   */
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isTouched, setIsTouched] = useAtom(touchAtom);
  const [showText, setShowText] = useState(false);

  const texture = useLoader(TextureLoader, "/models/sungsimdang.png");

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
          position={[100, 0, 100]}
          receiveShadow
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial map={texture} />
        </mesh>
      </RigidBody>

      {/* 위쪽 벽 */}
      <Wall position={[100, 0, 49]} args={[100, 5, 2]} />

      {/* 왼쪽 벽 */}
      <Wall position={[49, 0, 100]} args={[2, 5, 100]} />

      {/* 오른쪽 벽 */}
      <Wall position={[100, 0, 151]} args={[100, 5, 2]} />

      {/* 아래쪽 벽 */}
      <Wall position={[151, 0, 100]} args={[2, 5, 100]} />

      {/* <RigidBody
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
      )} */}
    </>
  );
};
