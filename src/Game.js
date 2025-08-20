import React, { useState, useEffect, useRef, useContext } from 'react';
import { BACKEND, WS_BACKEND } from './config';
import { UserContext } from './App';
import PlantInteractive from './PlantInteractive';
import { useWebSocket } from "./WebSocketContext";

export default function Game() {
  const { user } = useContext(UserContext);
  const { ws } = useWebSocket();

  const PIXEL_SIZE = 30; // circle diameter in px

  const [pixels, setPixels] = useState([]);

  const normalize = (raw) => ({
    x: raw.x,
    y: raw.y,
    owner: raw.owner ?? raw.owner__user__username ?? "Unknown",
    description: raw.description ?? "",
    planted_on: raw.planted_on ?? raw.plantedOn ?? "",
  });

  // use for initial fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BACKEND}/game_api/pixels/`);
        const data = await res.json();
        setPixels(data.map(normalize));
      } catch (err) {
        console.error('fetch failed', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event) => {
      try {
        const pixel = normalize(JSON.parse(event.data));
        setPixels(prev => {
          const filtered = prev.filter(p => !(p.x === pixel.x && p.y === pixel.y));
          return [...filtered, pixel];
        });
      } catch (e) {
        console.error('WS message parse error', e);
      }
    };

    ws.addEventListener("message", handleMessage);
    return () => ws.removeEventListener("message", handleMessage);
  }, [ws]);

  const handleClick = async (e) => {
    if (!user) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    const pixelData = { x, y };

    // Send to WebSocket if open
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(pixelData));
    } else {
      // fallback to POST
      const token = user.access_token;

      try {
        const res = await fetch(`${BACKEND}/game_api/paint/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.access_token}`,
        },
        body: JSON.stringify(pixelData),
        });

        const savedPixel = await res.json(); // directly get the pixel
        setPixels(prev => [...prev.filter(p => p.x !== x || p.y !== y), savedPixel]);

      } catch (err) {
        console.error('paint POST/fetch failed', err);
      }
    }
  }
  

  return (
    <div
      onClick={handleClick}
      style={{
        width: '90vw',
        height: '90vh',
        border: '1px solid black',
        position: 'relative',
        userSelect: 'none',
        cursor: user ? 'crosshair' : 'not-allowed',
      }}
    >
      {pixels.map(pixel => {
        const plantInfo = {
          x: pixel.x,
          y: pixel.y,
          size: PIXEL_SIZE,
          plantedBy: pixel.owner || "EL PEPE",          // use normalized `owner`
          date: pixel.planted_on || "N/A",              // ISO string is fine for display/parse
          description: pixel.description || "No info available",
        };

        const key = `${pixel.x},${pixel.y}`;
        return <PlantInteractive key={key} plantInfo={plantInfo} />;
      })}
    </div>
  );
}