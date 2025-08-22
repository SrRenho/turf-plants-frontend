import { usePixels } from './usePixels';
import { usePaintPixel } from './usePaintPixel';
import PlantInteractive from './PlantInteractive';
import { useWebSocket } from "./WebSocketContext";
import { useAuth } from './AuthProvider';        
import GameMap from "./GameMap";
import Viewport from './Viewport';
import { GameUIProvider } from "./GameUIContext";
import PendingPlant from './PendingPlant';

export default function Game() {
  const { user } = useAuth();
  const { ws } = useWebSocket();
  const [pixels, addPixel, addPendingPixel] = usePixels(ws);
  const handlePaint = usePaintPixel(user, ws, addPixel, addPendingPixel);

  return (
    <GameUIProvider>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Viewport width={1200} height={700} layerWidth={10000} layerHeight={10000}>
          <GameMap onTileClick={handlePaint}>
            {pixels.map((pixel) =>
              pixel.pending ? (
                <PendingPlant key={`pending-${pixel.x},${pixel.y}`} plantInfo = {{x : pixel.x, y : pixel.y}} />
              ) : (
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
              )
            )}
          </GameMap>
        </Viewport>
      </div>
    </GameUIProvider>
  );
}

