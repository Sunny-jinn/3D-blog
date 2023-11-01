import { Environment, OrbitControls } from "@react-three/drei";
import { Character } from "./Character";
import { Map } from "./Map";
import { useState } from "react";
import * as THREE from "three";

export const Main = () => {
  const [position, setPosition] = useState([0, 0, 0]);
  return (
    <>
      {/* <OrbitControls /> */}
      <directionalLight position={[7, 7, 7]} castShadow />
      <Environment preset="sunset" />
      <Character
        position={new THREE.Vector3(position[0], position[1], position[2])}
      />
      <Map setPosition={setPosition} />
    </>
  );
};
