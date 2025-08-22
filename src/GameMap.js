import { Stage, Layer, Image as KonvaImage  } from 'react-konva';
import useImageLoader from './useImageLoader.js';

export default function GameMap({ onTileClick, children }) {

  const image = useImageLoader('/grass-background.jpg');

  const handleClick = (e) => {
    const layer = e.target.getLayer();
    const pointerPosition = layer.getRelativePointerPosition();

    onTileClick({ x: pointerPosition.x, y: pointerPosition.y });
  };

  return (
      <Layer onClick={handleClick}>
        <KonvaImage 
          image={image}
          width={3000}
          height={3000}
        />
        {children}
      </Layer>
  );
}