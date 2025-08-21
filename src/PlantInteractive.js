import Plant from "./Plant";
import { useState } from "react";
import { PlantTooltip } from "./PlantTooltip";

export default function PlantInteractive({ plantInfo }) {
  const { x, y } = plantInfo;
  const size = 30; // circle diameter in px
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
        boxShadow: hover
          ? "0 0 16px 4px rgba(255, 150, 12, 0.92)" // glow when hovered
          : "none",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Plant size={size} />
      {hover && <PlantTooltip plantInfo={plantInfo} size={size} />}
    </div>
  );
}
