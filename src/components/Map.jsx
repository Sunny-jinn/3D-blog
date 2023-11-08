import { Text } from "@react-three/drei";
import { CuboidCollider, RigidBody, vec3 } from "@react-three/rapier";
import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
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
import { Fireworks } from "./Fireworks";

export const Map = ({ setPosition }) => {
  /**
   * 꾹 누르고 있을 때도 이동할 수 있게 함.
   */
  const rigidbody = useRef();

  const [isPointerDown, setIsPointerDown] = useState(false);
  const [showText, setShowText] = useState(false);
  const [isTouched, setIsTouched] = useAtom(touchAtom);
  const [isAutoMoving, setIsAutoMoving] = useAtom(isAutoMovingAtom);
  const [isFirstTouch, setIsFirstTouch] = useAtom(isFirstTouchAtom);

  const [animatedPosition, setAnimatedPosition] = useSpring(() => ({
    position: [0, -12, 0], // 시작 위치: 바닥 아래 숨겨진 상태
    from: { position: [0, -10, 0] }, // 끝 위치: 바닥 바로 위 숨겨진 상태
    config: {
      mass: 1, // 물체의 질량
      tension: 200, // 스프링의 긴장도
      friction: 5, // 마찰력
      bounce: 0.8, // 튕겨나오는 정도 (0에서 1 사이, 1이 완전 탄성 충돌)
      duration: undefined, // 스프링 물리를 사용할 때는 duration을 정의하지 않음
    },
    reset: true, // 컴포넌트가 리렌더링될 때마다 애니메이션을 리셋
  }));

  useEffect(() => {
    if (isFirstTouch) {
      const timeoutId = setTimeout(() => {
        setAnimatedPosition.start({
          position: [0, 0, 0],
        });
      }, 1800); // 1초 지연
    }
  }, [isFirstTouch, setAnimatedPosition]);

  const texture = useLoader(TextureLoader, "/models/back11.png");

  // 애니메이션의 opacity 값을 제어합니다.
  const { opacity } = useSpring({
    scale: isTouched ? 1 : 0,
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
        <RigidBody
          ref={rigidbody}
          colliders="trimesh"
          type="fixed"
          position={[75, 2.5, 75]}
        >
          <a.mesh position={animatedPosition.position}>
            <boxGeometry args={[5, 5, 5]} />
            <meshStandardMaterial color={"red"} />
          </a.mesh>
        </RigidBody>
      )}

      {/* <Fireworks position={[80, 5, 55]} /> */}

      <RigidBody colliders="trimesh" type="fixed" position={[64, 0, 60]}>
        <mesh>
          <boxGeometry args={[2, 20, 2]} />
          <meshStandardMaterial color={"#ffd754"} transparent opacity={0.7} />
        </mesh>
      </RigidBody>
      <RigidBody colliders="trimesh" type="fixed" position={[51, 0, 60]}>
        <mesh>
          <boxGeometry args={[2, 20, 2]} />
          <meshStandardMaterial color={"#ffd754"} transparent opacity={0.7} />
        </mesh>
      </RigidBody>
      <RigidBody colliders="trimesh" type="fixed" position={[57.5, 11, 60]}>
        <mesh>
          <boxGeometry args={[15, 2, 2]} />
          <meshStandardMaterial color={"#ffd754"} transparent opacity={0.7} />
        </mesh>
      </RigidBody>

      <RigidBody position={[60, 0, 60]} colliders="trimesh" type="fixed">
        <CuboidCollider
          args={[5, 5, 1]}
          sensor
          onIntersectionEnter={() => {
            setIsTouched(true);
          }}
        />
      </RigidBody>
    </>
  );
};
