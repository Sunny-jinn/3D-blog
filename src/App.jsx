import { Canvas } from "@react-three/fiber";
import { Main } from "./components/Main";
import { Suspense } from "react";
import { Physics } from "@react-three/rapier";

function App() {
  return (
    <Canvas shadows camera={{ position: [-10, 15, 10] }}>
      <Suspense>
        <Physics debug>
          <Main />
        </Physics>
      </Suspense>
    </Canvas>
  );
}

export default App;
