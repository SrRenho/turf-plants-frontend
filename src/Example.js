import React, { useRef } from 'react';
import { Stage, Layer, Rect, Circle, Line } from 'react-konva';

export default function App() {
  const stageRef = useRef(null);
  const stageSize = { width: 700, height: 700 };
  const layerSize = { width: 3000, height: 3000 };
  const gridSize = 100; // Grid cell size in pixels
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

  // Generate grid lines
  const gridLines = [];
  for (let i = 0; i <= layerSize.width; i += gridSize) {
    gridLines.push(
      <Line
        key={`v-${i}`}
        points={[i, 0, i, layerSize.height]}
        stroke="gray"
        strokeWidth={1}
        dash={[5, 5]}
      />
    );
  }
  for (let i = 0; i <= layerSize.height; i += gridSize) {
    gridLines.push(
      <Line
        key={`h-${i}`}
        points={[0, i, layerSize.width, i]}
        stroke="gray"
        strokeWidth={1}
        dash={[5, 5]}
      />
    );
  }

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
        <Layer>
          <Rect
            x={0}
            y={0}
            width={layerSize.width}
            height={layerSize.height}
            fill="lightgray"
          />
          {gridLines}
          <Rect
            x={100}
            y={100}
            width={100}
            height={100}
            fill="red"
            shadowBlur={10}
          />
          <Circle
            x={300}
            y={300}
            radius={50}
            fill="blue"
            shadowBlur={10}
          />
        </Layer>
      </Stage>
    </div>
  );
};