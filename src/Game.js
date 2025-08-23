import { usePixels } from './usePixels';
import { usePaintPixel } from './usePaintPixel';
import PlantInteractive from './PlantInteractive';
import { useWebSocket } from "./WebSocketContext";
import { useAuth } from './AuthProvider';        
import GameMap from "./GameMap";
import Viewport from './Viewport';
import { GameUIProvider } from "./GameUIContext";
import PendingPlant from './PendingPlant';
import ZoomDisplay from './ZoomDisplay';

export default function Game() {
  const { user } = useAuth();
  const { ws } = useWebSocket();
  const [pixels, addPixel, addPendingPixel] = usePixels(ws);
  const handlePaint = usePaintPixel(user, ws, addPixel, addPendingPixel);

  return (
    <GameUIProvider>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
    {/* Zoom display aligned to the right edge of the viewport */}
    <div style={{ width: 1200, display: 'flex', justifyContent: 'flex-end' }}>
      <ZoomDisplay />
    </div>
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

