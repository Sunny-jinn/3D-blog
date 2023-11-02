import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useFrame, useGraph } from "@react-three/fiber";
import * as THREE from "three";

const SPEED = 0.07;

export function Character(props) {
  const group = useRef();
  const { scene, materials, animations } = useGLTF("/models/character.glb");

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);

  const { actions } = useAnimations(animations, group);
  const position = useMemo(() => props.position, []);

  const [animation, setAnimation] = useState(
    "CharacterArmature|CharacterArmature|CharacterArmature|Idle"
  );

  useEffect(() => {
    actions[animation].reset().fadeIn(0.32).play();
    return () => actions[animation]?.fadeOut(0.32);
  }, [animation]);

  useFrame(() => {
    if (group.current.position.distanceTo(props.position) > 0.1) {
      const direction = group.current.position
        .clone()
        .sub(props.position)
        .normalize()
        .multiplyScalar(SPEED);
      group.current.position.sub(direction);
      group.current.lookAt(props.position);
      setAnimation("CharacterArmature|CharacterArmature|CharacterArmature|Run");
    } else {
      setAnimation(
        "CharacterArmature|CharacterArmature|CharacterArmature|Idle"
      );
    }
  });

  return (
    <group ref={group} {...props} dispose={null} position={position}>
      <group name="Root_Scene">
        <group name="RootNode">
          <group
            name="CharacterArmature"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <primitive object={nodes.Root} />
          </group>
          <skinnedMesh
            name="Character"
            geometry={nodes.Character.geometry}
            material={materials.Atlas}
            skeleton={nodes.Character.skeleton}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
            castShadow
            receiveShadow
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/character.glb");
