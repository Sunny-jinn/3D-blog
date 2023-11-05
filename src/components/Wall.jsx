import { RigidBody } from "@react-three/rapier";

export const Wall = ({ position, args }) => {
  return (
    <RigidBody colliders="trimesh" type="fixed" position={position} name="wall">
      <mesh>
        <boxGeometry args={args} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </RigidBody>
  );
};
