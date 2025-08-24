import useImageLoader from "./useImageLoader.js";
import Konva from "konva";
import { Image as KonvaImage, Group } from "react-konva";
import { useRef, useEffect } from "react";

export default function Plant({ size, hover }) {
  const image = useImageLoader("/plant.png");
  const glowRef = useRef(null);

  useEffect(() => {
    if (glowRef.current) {
      glowRef.current.cache(); // required for filters
      glowRef.current.getLayer()?.batchDraw();
    }
  }, [image]);

  if (!image) return null;

  return (
    <Group>
      {/* Glow clone: scaled up a bit, blurred & tinted */}
      <KonvaImage
        ref={glowRef}
        image={image}
        x={-size / 2}
        y={-size / 2}
        width={size}
        height={size}
        scaleX={1.12}               // slightly bigger to push glow outward
        scaleY={1.12}
        opacity={hover ? 1 : 0}
        filters={[Konva.Filters.RGBA, Konva.Filters.Blur]}
        // tint color via RGBA filter (warm glow)
        red={255}
        green={180}
        blue={60}
        alpha={1}
        blurRadius={22}
        listening={false}
      />

      {/* Base image */}
      <KonvaImage
        image={image}
        x={-size / 2}
        y={-size / 2}
        width={size}
        height={size}
        listening={true}
      />
    </Group>
  );
}