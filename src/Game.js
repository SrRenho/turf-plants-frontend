import { usePixels } from './usePixels';
import { usePaintPixel } from './usePaintPixel';
import PlantInteractive from './PlantInteractive';
import { useWebSocket } from "./WebSocketContext";
import { useAuth } from './AuthProvider';        
import GameMap from "./GameMap";
import Viewport from './Viewport';
import { GameUIProvider } from "./GameUIContext";

export default function Game() {
  const { user } = useAuth();
  const { ws } = useWebSocket();
  const [pixels, addPixel] = usePixels(ws);
  const handlePaint = usePaintPixel(user, ws, addPixel);

  return (
    <GameUIProvider>
      <Viewport width={700} height={700} layerWidth={3000} layerHeight={3000}>
        <GameMap onTileClick={handlePaint}>
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
      </Viewport>
    </GameUIProvider>
  );
}

