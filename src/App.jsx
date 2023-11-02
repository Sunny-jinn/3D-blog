import { Canvas } from "@react-three/fiber";
import { Main } from "./components/Main";
import { SoftShadows } from "@react-three/drei";
import { Suspense } from "react";
import { Physics } from "@react-three/rapier";

function App() {
  return (
    <Canvas shadows camera={{ position: [-10, 15, 10] }}>
      <Suspense>
        <Physics>
          <Main />
        </Physics>
      </Suspense>
    </Canvas>
  );
}

export default App;
