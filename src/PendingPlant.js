import { Circle } from "react-konva";


export default function PendingPlant({ plantInfo }) {
  const { x, y } = plantInfo;
  const size = 30;
  const HALF = size / 2;

  return (
    <Circle
      x={x}
      y={y}
      radius={HALF}
      fill="rgba(143, 105, 23, 0.94)" 
    />
  );
}
