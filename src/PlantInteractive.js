import { useState } from "react";
import { Group, Circle } from "react-konva";
import Plant from "./Plant";
import { useTooltip } from "./GameUIContext";

export default function PlantInteractive({ plantInfo }) {
  const { x, y } = plantInfo;
  const size = 30;
  const HALF = size / 2;
  const [hover, setHover] = useState(false);
  const { show, hide } = useTooltip();

  return (
    <Group
      x={x}
      y={y}
      onMouseEnter={() => {
        setHover(true);
        show(plantInfo);
      }}
      onMouseLeave={() => {
        setHover(false);
        hide();
      }}
    >
      {/* Glow / background circle */}
      <Circle
        radius={HALF}
        fill="rgba(255, 255, 255, 1)" 
        shadowColor="rgba(255, 150, 12, 1)"
        shadowBlur={hover ? 30 : 0}
        shadowOpacity={hover ? 1 : 0}
      />
      <Plant size={size} />
    </Group>
  );
}
