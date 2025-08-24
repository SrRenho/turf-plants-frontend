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
      onMouseEnter={(e) => {
        setHover(true);
        show(plantInfo);
        const stage = e.target.getStage();
        if (!stage) return;
        // save current cursor
        stage._prevCursor = stage.container().style.cursor;
        stage.container().style.cursor = 'pointer';
      }}
      onMouseLeave={(e) => {
        setHover(false);
        hide();
        const stage = e.target.getStage();
        if (!stage) return;
        // restore previous cursor
        stage.container().style.cursor = stage._prevCursor || 'default';
        delete stage._prevCursor;
      }}
    >
      <Plant size={70} hover={hover} />
    </Group>
  );
}
