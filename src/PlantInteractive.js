import Plant from "./Plant";
import { useState } from "react";
import { PlantTooltip } from "./PlantTooltip";

export default function PlantInteractive({ x, y, size }) {
  const HALF = size / 2;
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        position: "absolute",
        left: `${x - HALF}px`,
        top: `${y - HALF}px`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        backgroundColor: "black",
        pointerEvents: "auto",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Plant x={HALF} y={HALF} size={size} />
      {hover && <PlantTooltip x={x} y={y} />}
    </div>
  );
}
