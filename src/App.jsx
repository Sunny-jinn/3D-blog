import { Canvas } from "@react-three/fiber";
import { Main } from "./components/Main";

function App() {
  return (
    <Canvas shadows camera={{ position: [3, 3, 3] }}>
      <Main />
    </Canvas>
  );
}

export default App;
