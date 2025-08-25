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
import useImageLoader from "./useImageLoader.js";

// ⬇️ added
import React, { useState } from 'react';
import Konva from 'konva';
import Plant from './Plant';

export default function Game() {
  const { user } = useAuth();
  const { ws } = useWebSocket();
  const [pixels, addPixel, addPendingPixel] = usePixels(ws);
  const handlePaint = usePaintPixel(user, ws, addPixel, addPendingPixel);
  const { prompt } = usePlantDialog();

  // ⬇️ added: track cursor (stage) position
  const [cursor, setCursor] = useState(null);
  const handleMouseMove = (e) => {
    const stage = e.target?.getLayer?.();
    const pos = stage?.getRelativePointerPosition?.();
    if (pos) setCursor(pos);
  };

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
    const MIN_DISTANCE_SQRD = 150**2; // minimum distance in pixels
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
                  autoClose={2000}
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
        {/* ⬇️ added onMouseMove */}
        <Viewport width={1200} height={700} layerWidth={10000} layerHeight={10000}>
          <GameMap onTileClick={handleClick} onMouseMove={handleMouseMove}>
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
                    total_xp: pixel.total_xp,
                  }}
                />
              )
            )}

            {/* ⬇️ ghost Plant that follows cursor; doesn't capture events */}
            {cursor && (
<Plant
  size={70}
  opacity={0.5}
  x={cursor.x - 35}
  y={cursor.y - 35}
  listening={false}
  ref={node => {
    if (node && tooCloseToExistingPlant(cursor.x, cursor.y)) {
      node.cache();
    }
  }}
  {...(tooCloseToExistingPlant(cursor.x, cursor.y) && {
    filters: [Konva.Filters.RGBA],
    red: 255,
    green: 0,
    blue: 0,
    alpha: 0.75,
  })}
/>
            )}
          </GameMap>
        </Viewport>
      </div>
  );
}
