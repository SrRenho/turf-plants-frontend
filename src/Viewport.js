import React, { useRef, useCallback } from 'react';
import { Stage } from 'react-konva';
import { useAuth } from './AuthProvider';
import { useZoomDisplay } from './GameUIContext';
import { usePlayer } from './PlayerProvider';

export default function Viewport({ width, height, layerWidth, layerHeight, children }) {
  const stageRef = useRef(null);
  const rafRef = useRef(0); // for coalescing wheel events
  const { player } = usePlayer(); 
  const { setZoom } = useZoomDisplay(); 

  const stageSize = { width, height };
  const layerSize = { width: layerWidth, height: layerHeight };
  const maxScale = 2;

  const minScale = Math.max(
    stageSize.width / layerSize.width,
    stageSize.height / layerSize.height
  );

  const bound = useCallback((pos, scale) => {
    const scaledW = layerSize.width * scale;
    const scaledH = layerSize.height * scale;
    const x = Math.max(Math.min(pos.x, 0), stageSize.width - scaledW);
    const y = Math.max(Math.min(pos.y, 0), stageSize.height - scaledH);
    return { x, y };
  }, [layerSize.width, layerSize.height, stageSize.width, stageSize.height]);

  const dragBoundFunc = (pos) => {
    const stage = stageRef.current;
    const s = stage ? stage.scaleX() : 1;
    return bound(pos, s);
  };

  const handleDragStart = (e) => {
    e.target.getStage().container().style.cursor = 'grabbing';
  };
  const handleDragEnd = (e) => {
    e.target.getStage().container().style.cursor = player?.seeds? 'crosshair' : 'grab';
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    // read the current transform directly from the node (no React state)
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // map pointer to world coords
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    // smooth, device-independent zoom factor
    const scaleBy = 1.001; // gentle step
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const targetScaleRaw = oldScale * Math.pow(scaleBy, direction * Math.min(60, Math.abs(e.evt.deltaY)));
    const newScale = Math.max(minScale, Math.min(maxScale, targetScaleRaw));

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    // coalesce multiple wheel events into one frame
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      stage.scale({ x: newScale, y: newScale });
      stage.position(bound(newPos, newScale));
      stage.batchDraw();
    });

    setZoom(newScale * 100);
  };

  const initialPos = {
    x: -layerWidth / 2 + width / 2,
    y: -layerHeight / 2 + height / 2,
  };

  return (
    <div style={{ width, height, border: '1px solid black' }}>
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        draggable
        dragBoundFunc={dragBoundFunc}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onWheel={handleWheel}
        style={{ cursor: player?.seeds ? 'crosshair' : 'grab' }}
        x={initialPos.x}
        y={initialPos.y}
      >
        {children}
      </Stage>
    </div>
  );
}
