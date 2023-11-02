import React, { useState } from "react";

export const Map = ({ setPosition }) => {
  /**
   * 꾹 누르고 있을 때도 이동할 수 있게 함.
   */
  const [isPointerDown, setIsPointerDown] = useState(false);

  const handlePointerDown = (e) => {
    setIsPointerDown(true);
    setPosition([e.point.x, 0, e.point.z]);
  };

  const handlePointerMove = (e) => {
    if (isPointerDown) {
      setPosition([e.point.x, 0, e.point.z]);
    }
  };

  const handlePointerUp = () => {
    setIsPointerDown(false);
  };

  return (
    <>
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, 0, 0]}
        receiveShadow
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={"#6e6e6e"} />
      </mesh>
    </>
  );
};
