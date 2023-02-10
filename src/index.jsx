import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { StrictMode } from "react";
import FBOParticles from "./FBOMaterial";
import { OrbitControls } from "@react-three/drei";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <StrictMode>
    <Canvas
      camera={{
        position: [1.5, 1.5, 2.5],
      }}
    >
      <OrbitControls />
      <FBOParticles />
    </Canvas>
  </StrictMode>
);
