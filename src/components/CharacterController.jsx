import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import { Character } from "./Character";
import { CameraControls } from "@react-three/drei";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { atom, useAtom } from "jotai";

export const touchAtom = atom(null);

const MOVE_SPEED = 10;

export const CharacterController = (props) => {
  const group = useRef();
  const controls = useRef();
  const rigidbody = useRef();
  const character = useRef();

  const [isTouched, setIsTouched] = useAtom(touchAtom);

  const [animation, setAnimation] = useState(
    "CharacterArmature|CharacterArmature|CharacterArmature|Idle"
  );

  useFrame(() => {
    const currentPos = vec3(rigidbody.current.translation());
    const direction = props.position.clone().sub(currentPos).normalize();

    if (currentPos.distanceTo(props.position) > 0.1) {
      const impulse = {
        x: direction.x * MOVE_SPEED,
        y: 0, // Y축 이동이 없다면 0으로 설정
        z: direction.z * MOVE_SPEED,
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

    if (controls.current) {
      const playerWorldPos = vec3(rigidbody.current.translation());

      controls.current.setLookAt(
        playerWorldPos.x - 7,
        playerWorldPos.y + 16,
        playerWorldPos.z + 9,
        playerWorldPos.x,
        playerWorldPos.y + 1.5,
        playerWorldPos.z
      );
    }
  });

  return (
    <group ref={group}>
      <CameraControls ref={controls} />
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
