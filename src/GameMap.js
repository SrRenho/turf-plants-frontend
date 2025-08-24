import { Layer, Rect } from 'react-konva';
import useImageLoader from './useImageLoader.js';

export default function GameMap({ onTileClick, children, onMouseMove }) {
  const image = useImageLoader('/grass-background.jpg');

  const handleClick = (e) => {
    const layer = e.target.getLayer();
    const pointerPosition = layer.getRelativePointerPosition();
    onTileClick({ x: pointerPosition.x, y: pointerPosition.y });
  };

  return (
    <Layer onClick={handleClick} onMouseMove={onMouseMove}>
      <Rect
        width={10000}
        height={10000}
        fillPatternImage={image}
        fillPatternRepeat="repeat"
      />
      {children}
    </Layer>
  );
}
