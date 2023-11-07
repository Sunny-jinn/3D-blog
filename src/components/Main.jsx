import { Environment, Stats, useHelper } from "@react-three/drei";
import { Map } from "./Map";
import { useRef, useState } from "react";
import * as THREE from "three";
import { CharacterController } from "./CharacterController";
import { atom, useAtom } from "jotai";

export const positionAtom = atom(new THREE.Vector3(55, 0, 55));

export const Main = () => {
  const [position, setPosition] = useAtom(positionAtom);

  const lightRef = useRef();

  useHelper(lightRef, THREE.DirectionalLightHelper, 10);
  return (
    <>
      <Stats />
      <directionalLight
        ref={lightRef}
        position={[140, 100, 140]}
        // color={0xfff6e6}
        intensity={5}
        castShadow
        shadow-camera-left={-70} // X축 최소값, 평면의 왼쪽 끝 이하로 설정
        shadow-camera-right={140} // X축 최대값, 평면의 오른쪽 끝 이상으로 설정
        shadow-camera-top={140} // Z축 최대값, 평면의 상단 끝 이상으로 설정
        shadow-camera-bottom={-70} // Z축 최소값, 평면의 하단 끝 이하로 설정
        shadow-camera-near={1} // near bound
        shadow-camera-far={400} // far bound
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        // color={0xfff6e6}
        position={[-140, 100, -140]}
        intensity={0.5}
      />

      {/* <Environment preset="sunset" intensity={0.5} /> */}
      <CharacterController />
      <Map setPosition={setPosition} />
    </>
  );
};
