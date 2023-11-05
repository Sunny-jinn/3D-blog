import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import { Character } from "./Character";
import { CameraControls } from "@react-three/drei";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { atom, useAtom } from "jotai";
import * as THREE from "three";

export const touchAtom = atom(null);

const MOVE_SPEED = 1000;

export const CharacterController = (props) => {
  const group = useRef();
  const controls = useRef();
  const rigidbody = useRef();
  const character = useRef();

  const [isTouched, setIsTouched] = useAtom(touchAtom);

  const [animation, setAnimation] = useState(
    "CharacterArmature|CharacterArmature|CharacterArmature|Idle"
  );

  useFrame((state, delta) => {
    const currentPos = vec3(rigidbody.current.translation());
    const direction = props.position.clone().sub(currentPos).normalize();

    if (currentPos.distanceTo(props.position) > 0.1) {
      // delta는 이전 프레임 이후의 초 단위 시간임. 이는 모니터 프레임과 무관하게 속도 제정가능.
      const impulse = {
        x: direction.x * MOVE_SPEED * delta,
        y: 0, // Y축 이동이 없다면 0으로 설정
        z: direction.z * MOVE_SPEED * delta,
      };
      rigidbody.current.applyImpulse(impulse, true);
      character.current.lookAt(props.position);
      setAnimation("CharacterArmature|CharacterArmature|CharacterArmature|Run");
    } else {
      setAnimation(
        "CharacterArmature|CharacterArmature|CharacterArmature|Idle"
      );
      rigidbody.current.setLinvel({ x: 0, y: 0, z: 0 }, true); // 선형 속도를 0으로 설정하여 멈춤
    }

    const playerPosition = vec3(rigidbody.current.translation());

    // 캐릭터의 머리 위에 카메라를 고정시킬 오프셋을 설정합니다.
    // 이 값을 조정하여 카메라가 머리로부터 얼마나 높은 위치에 있을지 결정할 수 있습니다.
    const cameraHeightOffset = 2; // 캐릭터의 머리로부터 2 유닛 위

    // 카메라의 새로운 위치를 설정합니다.
    // playerPosition에서 Y축만 cameraHeightOffset만큼 더해줍니다.
    const newCameraPosition = new THREE.Vector3(
      playerPosition.x - 6,
      playerPosition.y + 17,
      playerPosition.z + 10
    );

    // 카메라의 위치를 새로운 위치로 갱신합니다.
    state.camera.position.copy(newCameraPosition);

    // 카메라가 캐릭터를 바라보게 합니다.
    // 이 때, 머리 부분을 바라보게 하고 싶다면 Y축을 적당히 조절해주어야 합니다.
    state.camera.lookAt(
      playerPosition.x,
      playerPosition.y + 1.6,
      playerPosition.z
    ); // 캐릭터의 머리 위치를 가정하고 1.6으로 설정
  });

  return (
    <group ref={group}>
      {/* <CameraControls ref={controls} /> */}
      <RigidBody
        colliders={false}
        ref={rigidbody}
        enabledRotations={[false, false, false]}
        lockRotations
        linearDamping={12}
        onCollisionEnter={(e) => {
          console.log(e.colliderObject.name);
          if (e.colliderObject.name === "testSphere") {
            setIsTouched(true);
          } else if (e.colliderObject.name === "testBox") {
            setIsTouched(false);
          }
        }}
      >
        <group ref={character}>
          <Character animation={animation} />
        </group>
        <CapsuleCollider args={[1, 1]} position={[0, 2, 0]} />
      </RigidBody>
    </group>
  );
};
