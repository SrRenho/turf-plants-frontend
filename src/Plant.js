import { Image as KonvaImage  } from "react-konva";
import useImageLoader from "./useImageLoader.js";

export default function Plant({ size, level=1, ...rest }) {
  let imgName;
  if (level <= 3) imgName = "plant.png";
  else if (level <= 9) imgName = "plant2.png";
  else if (level <= 19) imgName = "plant3.png";
  else if (level <= 29) imgName = "plant4.png";
  else if (level <= 39) imgName = "plant5.png";
  else if (level <= 49) imgName = "plant6.png";
  else if (level <= 69) imgName = "plant7.png";
  else if (level <= 89) imgName = "plant8.png";
  else imgName = "plant9.png";

  const image = useImageLoader("/" + imgName);
  if (!image) return null; // wait until loaded

  return (
    <KonvaImage 
      image={image}
      x={-size/2}   // move left by half width
      y={-size/2}
      width={size}
      height={size}
      listening={true} // pointerEvents: none
      {...rest}
    />
  );
}