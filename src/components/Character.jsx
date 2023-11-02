import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useGLTF,
  useAnimations,
  CameraControls,
  OrbitControls,
} from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useGraph } from "@react-three/fiber";

export function Character(props) {
  const group = useRef();

  const { scene, materials, animations } = useGLTF("/models/character.glb");

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);

  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions[props.animation].reset().fadeIn(0.32).play();
    return () => actions[props.animation]?.fadeOut(0.32);
  }, [props.animation]);

  return (
    <group ref={group} {...props} dispose={null}>
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
