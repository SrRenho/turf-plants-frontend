// PlantInteractive.js
import React, { useState, useRef, useEffect } from 'react';
import { Group } from 'react-konva';
import Plant from './Plant';
import { useTooltip } from './GameUIContext.js';

export default function PlantInteractive({ plantInfo }) {
  const { x, y, level } = plantInfo;
  const [hover, setHover] = useState(false);
  const groupRef = useRef(null);
  const { show, hide } = useTooltip();

  // Animate scale on hover
  useEffect(() => {
    if (!groupRef.current) return;

    groupRef.current.to({
      scaleX: hover ? 1.1 : 1,
      scaleY: hover ? 1.1 : 1,
      duration: 0.1,
    });
  }, [hover]);

  return (
    <Group
      ref={groupRef}
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
      <Plant level={level} />
    </Group>
  );
}
