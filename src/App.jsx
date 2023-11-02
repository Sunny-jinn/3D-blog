import { Canvas } from "@react-three/fiber";
import { Main } from "./components/Main";
import { SoftShadows } from "@react-three/drei";

function App() {
  return (
    <Canvas shadows camera={{ position: [-10, 15, 10] }}>
      <Main />
    </Canvas>
  );
}

export default App;
