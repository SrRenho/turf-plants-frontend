import { Image as KonvaImage  } from "react-konva";
import useImageLoader from "./useImageLoader.js";

export default function Plant({ size }) {
  const image = useImageLoader("/plant.png");

  if (!image) return null; // wait until loaded

  return (
    <KonvaImage 
      image={image}
      x={-size/2}   // move left by half width
      y={-size/2}
      width={size}
      height={size}
      listening={false} // pointerEvents: none
    />
  );
}