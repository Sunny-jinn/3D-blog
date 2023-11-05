// CharacterController.js
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { Character } from "./Character";
import { useCharacterControls } from "../hooks/useCharacterControls";

export const CharacterController = (props) => {
  const { group, rigidbody, character, animation, handleCollisionEnter } =
    useCharacterControls(props);

  return (
    <group ref={group}>
      <RigidBody
        ref={rigidbody}
        colliders={false}
        enabledRotations={[false, false, false]}
        position={[55, 0, 55]}
        lockRotations
        linearDamping={12}
        onCollisionEnter={handleCollisionEnter}
      >
        <group ref={character}>
          <Character animation={animation} />
        </group>
        <CapsuleCollider args={[1, 1]} position={[0, 2, 0]} />
      </RigidBody>
    </group>
  );
};
