import React, { useRef } from 'react';
import { Stage } from 'react-konva';

export default function Viewport({ width, height, layerWidth, layerHeight, children }) {
  const stageRef = useRef(null);
  const stageSize = { width, height };
  const layerSize = { width: layerWidth, height: layerHeight };
  const minScale = Math.max(stageSize.width / layerSize.width, stageSize.height / layerSize.height); // Minimum scale to keep layer at least as large as stage
  const maxScale = 2; // Maximum scale for zoom limit
  const [scale, setScale] = React.useState(1);

  const handleDragStart = (e) => {
    e.target.getStage().container().style.cursor = 'grabbing';
  };

  const handleDragEnd = (e) => {
    e.target.getStage().container().style.cursor = 'grab';
  };

  const dragBoundFunc = (pos) => {
    const scaledLayerWidth = layerSize.width * scale;
    const scaledLayerHeight = layerSize.height * scale;
    const newX = Math.max(Math.min(pos.x, 0), stageSize.width - scaledLayerWidth);
    const newY = Math.max(Math.min(pos.y, 0), stageSize.height - scaledLayerHeight);
    return { x: newX, y: newY };
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const scaleBy = 1.1;
    let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    newScale = Math.max(minScale, Math.min(maxScale, newScale)); // Clamp scale

    setScale(newScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(dragBoundFunc(newPos)); // Ensure new position respects bounds
    stage.batchDraw();
  };

  return (
    <div
      style={{
        width: stageSize.width,
        height: stageSize.height,
        border: '1px solid black',
      }}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        draggable
        dragBoundFunc={dragBoundFunc}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onWheel={handleWheel}
        scaleX={scale}
        scaleY={scale}
        style={{ cursor: 'grab' }}
      >
        {children}
      </Stage>
    </div>
  );
};