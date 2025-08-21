import { usePixels } from './usePixels';
import { usePaintPixel } from './usePaintPixel';
import PlantInteractive from './PlantInteractive';
import { useWebSocket } from "./WebSocketContext";
import { useAuth } from './AuthProvider';        

export default function Game() {
  const { user } = useAuth();
  const { ws } = useWebSocket();

  const [pixels, addPixel] = usePixels(ws);
  const handleClick = usePaintPixel(user, ws, addPixel);

  return (
    <div
      onClick={handleClick}
      style={{
        width: "90vw",
        height: "90vh",
        border: "1px solid black",
        position: "relative",
        userSelect: "none",
        cursor: "crosshair",
      }}
    >
      {pixels.map(pixel => (
        <PlantInteractive
          key={`${pixel.x},${pixel.y}`}
          plantInfo={{
            x: pixel.x,
            y: pixel.y,
            plantedBy: pixel.owner,
            date: pixel.planted_on,
            description: pixel.description,
          }}
        />
      ))}
    </div>
  );
}
