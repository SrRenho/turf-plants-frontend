import { Stage, Layer, Image as KonvaImage  } from 'react-konva';
import useImageLoader from './useImageLoader.js';

export default function GameMap({ onTileClick, children }) {

  const image = useImageLoader('/grass-background.jpg');

  const handleClick = (e) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition(); // Get click position relative to Stage
    const x = Math.floor(pointerPosition.x);
    const y = Math.floor(pointerPosition.y);

    onTileClick({ x: x, y: y });
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