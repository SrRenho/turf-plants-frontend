import { usePixels } from './usePixels';
import { usePaintPixel } from './usePaintPixel';
import PlantInteractive from './PlantInteractive';
import { useWebSocket } from "./WebSocketContext";
import { useAuth } from './AuthProvider';        
import GameMap from "./GameMap";
import Viewport from './Viewport';
import { usePlantDialog } from "./GameUIContext";
import PendingPlant from './PendingPlant';
import ZoomDisplay from './ZoomDisplay';
import { ToastContainer, toast } from 'react-toastify';
import { MdWarning } from "react-icons/md";

export default function Game() {
  const { user } = useAuth();
  const { ws } = useWebSocket();
  const [pixels, addPixel, addPendingPixel] = usePixels(ws);
  const handlePaint = usePaintPixel(user, ws, addPixel, addPendingPixel);
  const { prompt } = usePlantDialog();
  const handleClick = async ({x,y}) => {
    if (!user) return;

    if (tooCloseToExistingPlant(x, y)) {
      toast.error("Too close to an existing plant! Please choose another location.");      
      return;
    }

    const result = await prompt({ x, y });
    if (result !== null && result !== undefined)
      handlePaint({ x, y }, result);
    
  }

  const tooCloseToExistingPlant = (x, y) => {
    const MIN_DISTANCE_SQRD = 100**2; // minimum distance in pixels
    return pixels.some((pixel) => {
      const dx = pixel.x - x;
      const dy = pixel.y - y;
      return (dx * dx + dy * dy) < MIN_DISTANCE_SQRD;
    });
  }

  return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  pauseOnHover
                  theme="colored"
                  stacked
                  limit={5}
                  
                  />
        <div style={{ width: 1200, display: 'flex', justifyContent: 'flex-end' }}>
          <ZoomDisplay />
        </div>
        <Viewport width={1200} height={700} layerWidth={10000} layerHeight={10000}>
          <GameMap onTileClick={handleClick}>
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
  );
}

