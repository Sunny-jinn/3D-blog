import { Text } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { useSpring, a, animated } from "@react-spring/three";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

import { Wall } from "./Wall";
import font1 from "/fonts/font1.ttf";
import {
  isAutoMovingAtom,
  isFirstTouchAtom,
  touchAtom,
} from "../hooks/useCharacterControls";

import * as THREE from "three";

export const Map = ({ setPosition }) => {
  /**
   * 꾹 누르고 있을 때도 이동할 수 있게 함.
   */
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [showText, setShowText] = useState(false);
  const [isTouched, setIsTouched] = useAtom(touchAtom);
  const [isAutoMoving, setIsAutoMoving] = useAtom(isAutoMovingAtom);
  const [isFirstTouch, setIsFirstTouch] = useAtom(isFirstTouchAtom);

  const [startAnimation, setStartAnimation] = useState(false);

  const [animatedPosition, setAnimatedPosition] = useSpring(() => ({
    position: [0, -12, 0], // 시작 위치
    from: { position: [0, -10, 0] }, // 끝 위치 (아래에서 시작)
    config: { tension: 170, friction: 26, duration: 2000 },
    reset: true, // 컴포넌트가 렌더링될 때마다 애니메이션을 리셋합니다.
  }));

  useEffect(() => {
    if (isFirstTouch) {
      setAnimatedPosition.start({ position: [0, 0, 0] }); // 목표 위치로 애니메이션 시작
    }
  }, [isFirstTouch, setAnimatedPosition]);

  const texture = useLoader(TextureLoader, "/models/back11.png");

  // 애니메이션의 opacity 값을 제어합니다.
  const { opacity } = useSpring({
    opacity: isTouched ? 1 : 0,
    config: { duration: 2000 },
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
    if (!isAutoMoving) {
      setIsPointerDown(true);
      setPosition(new THREE.Vector3(e.point.x, 0, e.point.z));
    }
  };

  const handlePointerMove = (e) => {
    if (isPointerDown && !isAutoMoving) {
      setPosition(new THREE.Vector3(e.point.x, 0, e.point.z));
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
      <RigidBody colliders="trimesh" type="fixed">
        <mesh position={[100, -10, 100]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[400, 400]} />
          <meshStandardMaterial map={texture} opacity={1} />
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

      <RigidBody
        colliders="trimesh"
        type="fixed"
        position={[60, 0, 50]}
        name="testBox"
      >
        <mesh>
          <boxGeometry args={[5, 5, 5]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>
      <RigidBody
        colliders="trimesh"
        type="fixed"
        position={[70, 2, 50]}
        name="testSphere"
      >
        <mesh>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>
      {showText && (
        <Text font={font1} position={[70, 5, 55]} fontSize={5}>
          안녕하세용
          <AnimatedMaterial color="#ffff00" opacity={opacity} transparent />
        </Text>
      )}

      {isFirstTouch && (
        <RigidBody colliders="trimesh" type="fixed" position={[75, 2.5, 75]}>
          <a.mesh position={animatedPosition.position}>
            <boxGeometry args={[5, 5, 5]} />
            <meshStandardMaterial color={"red"} />
          </a.mesh>
        </RigidBody>
      )}
    </>
  );
};
