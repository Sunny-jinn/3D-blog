import { Environment, OrbitControls } from "@react-three/drei";
import { Character } from "./Character";
import { Map } from "./Map";

export const Main = () => {
  return (
    <>
      <OrbitControls />
      <directionalLight position={[7, 7, 7]} castShadow />
      <Environment preset="sunset" />
      <Character />
      <Map />
    </>
  );
};
