import { Environment, OrbitControls, useHelper } from "@react-three/drei";
import { Character } from "./Character";
import { Map } from "./Map";
import { useRef, useState } from "react";
import * as THREE from "three";
import { CharacterController } from "./CharacterController";

export const Main = () => {
  const [position, setPosition] = useState([0, 0, 0]);

  const lightRef = useRef();

  useHelper(lightRef, THREE.DirectionalLightHelper, 10);
  return (
    <>
      {/* <OrbitControls /> */}
      <directionalLight
        ref={lightRef}
        position={[140, 100, 140]}
        castShadow
        shadow-camera-left={-70} // X축 최소값, 평면의 왼쪽 끝 이하로 설정
        shadow-camera-right={140} // X축 최대값, 평면의 오른쪽 끝 이상으로 설정
        shadow-camera-top={140} // Z축 최대값, 평면의 상단 끝 이상으로 설정
        shadow-camera-bottom={-70} // Z축 최소값, 평면의 하단 끝 이하로 설정
        shadow-camera-near={1} // near bound
        shadow-camera-far={400} // far bound
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
      />

      {/* <pointLight position={[7, 7, 7]} castShadow /> */}

      <Environment preset="sunset" />
      <CharacterController
        position={new THREE.Vector3(position[0], position[1], position[2])}
      />
      <Map setPosition={setPosition} />
    </>
  );
};
