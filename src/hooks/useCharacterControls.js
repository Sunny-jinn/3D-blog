// useCharacterControls.js
import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { vec3 } from "@react-three/rapier";
import * as THREE from "three";
import { atom, useAtom } from "jotai";
import { positionAtom } from "../components/Main";

const MOVE_SPEED = 1500;

export const touchAtom = atom(null);
export const isAutoMovingAtom = atom(false);

export const useCharacterControls = () => {
  const { camera } = useThree();
  const rigidbody = useRef();
  const character = useRef();
  const group = useRef();
  const [isTouched, setIsTouched] = useAtom(touchAtom);
  const [animation, setAnimation] = useState(
    "CharacterArmature|CharacterArmature|CharacterArmature|Idle"
  );
  const [isAutoMoving, setIsAutoMoving] = useAtom(isAutoMovingAtom);

  const [position, setPosition] = useAtom(positionAtom);

  function moveCharacterTo(target, lookAtTarget = true, delta) {
    const direction = target
      .clone()
      .sub(vec3(rigidbody.current.translation()))
      .normalize();
    const distance = vec3(rigidbody.current.translation()).distanceTo(target);

    if (distance > 0.1) {
      // 0.1은 캐릭터가 목표에 '충분히' 가까워졌는지를 결정하는 임계값입니다.
      const impulse = {
        x: direction.x * MOVE_SPEED * delta,
        y: 0, // Y축 이동은 없음
        z: direction.z * MOVE_SPEED * delta,
      };
      rigidbody.current.applyImpulse(impulse, true);
      if (lookAtTarget) {
        character.current.lookAt(target);
      }
      setAnimation("CharacterArmature|CharacterArmature|CharacterArmature|Run");
    } else {
      // 목표 위치에 도달하면 이동 로직을 정지합니다.
      setAnimation(
        "CharacterArmature|CharacterArmature|CharacterArmature|Idle"
      );
      rigidbody.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return true; // 도달했음을 나타내는 boolean 값을 반환할 수 있습니다.
    }
    return false;
  }

  const [targetPosition, setTargetPosition] = useState(null);

  useFrame((state, delta) => {
    const currentPos = vec3(rigidbody.current.translation());

    if (
      currentPos.x >= 70 &&
      currentPos.x <= 80 &&
      currentPos.z >= 70 &&
      currentPos.z <= 80
    ) {
      setPosition(new THREE.Vector3(56, 0, 56));
      setIsAutoMoving(true);
    }

    if (isAutoMoving) {
      const reached = moveCharacterTo(position, true, delta);
      if (reached) {
        setIsAutoMoving(false); // 도달했으면 자동 이동 종료
      }
    } else {
      // 사용자 입력에 의한 이동은 자동 이동 중이 아닐 때만 허용
      // moveCharacterTo(position, true, delta);
    }

    if (!moveCharacterTo(position, true, delta)) {
      //
    }

    const playerPosition = vec3(rigidbody.current.translation());

    const newCameraPosition = new THREE.Vector3(
      playerPosition.x - 6,
      playerPosition.y + 17,
      playerPosition.z + 10
    );

    camera.position.copy(newCameraPosition);
    camera.lookAt(playerPosition.x, playerPosition.y + 1.6, playerPosition.z);
  });

  const handleCollisionEnter = (e) => {
    console.log(e.colliderObject.name);
    if (e.colliderObject.name === "testSphere") {
      setIsTouched(true);
    } else if (e.colliderObject.name === "testBox") {
      setIsTouched(false);
    }
  };

  return { group, rigidbody, character, animation, handleCollisionEnter };
};
