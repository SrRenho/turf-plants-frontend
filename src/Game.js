import { usePixels } from './usePixels';
import { usePaintPixel } from './usePaintPixel';
import PlantInteractive from './PlantInteractive';
import { useWebSocket } from "./WebSocketContext";
import { useAuth } from './AuthProvider';        
import GameMap from "./GameMap";

export default function Game() {
  const { user } = useAuth();
  const { ws } = useWebSocket();
  const [pixels, addPixel] = usePixels(ws);
  const handlePaint = usePaintPixel(user, ws, addPixel);

  return (
    <GameMap width="90vw" height="90vh" onTileClick={handlePaint}>
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
    </GameMap>
  );
}

