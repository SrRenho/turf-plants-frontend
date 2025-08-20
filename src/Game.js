import React, { useState, useEffect, useRef, useContext } from 'react';
import { BACKEND, WS_BACKEND } from './config';
import { UserContext } from './App';
import PlantInteractive from './PlantInteractive';

export default function Game() {
  const { user } = useContext(UserContext);

  const PIXEL_SIZE = 30; // circle diameter in px

  const [pixels, setPixels] = useState([]);

  const socketRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPixels = await fetch(`${BACKEND}/game_api/pixels/`);
        const dataPixels = await resPixels.json();
        setPixels(dataPixels); // now expecting array of pixel objects
      } catch (err) {
        console.error('fetch failed', err);
      }
    };

    fetchData();
  }, []);


  // WebSocket setup
  useEffect(() => {
    const ws = new WebSocket(`${WS_BACKEND}/ws/pixels/`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const pixel = JSON.parse(event.data);
        setPixels(prev => {
          // Remove any pixel with same x,y, then add the new one
          const filtered = prev.filter(
            p => !(p.x === pixel.x && p.y === pixel.y)
          );
          return [...filtered, pixel];
        });
      } catch (e) {
        console.error('ws message parse error', e);
      }
    };

    ws.onclose = () => console.log('WebSocket disconnected');
    ws.onerror = (err) => console.error('WebSocket error:', err);

    return () => {
      try { ws.close(); } catch (e) {}
    };
  }, []);

  const handleClick = async (e) => {
    if (!user) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    const pixelData = { x, y, color: '#000000' };
/*
    // Optimistic update
    setPixels(prev => {
      const filtered = prev.filter(p => !(p.x === x && p.y === y));
      return [
        ...filtered,
        {
          x,
          y,
          size: PIXEL_SIZE,
          plantedBy: user?.username || "WOLOLO",
          date: new Date().toISOString(),
          description: "No info available",
        }
      ];
    })*/;

    // Send to WebSocket if open
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(pixelData));
    } else {
      // fallback to POST
      const token = user?.access_token;

      try {
        await fetch(`${BACKEND}/game_api/paint/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(pixelData),
        });

        // Fetch the actual pixel data from backend after saving
        const res = await fetch(`${BACKEND}/game_api/pixels/?x=${x}&y=${y}`);
        const savedPixel = await res.json();

        setPixels(prev => {
          const filtered = prev.filter(p => !(p.x === x && p.y === y));
          return [...filtered, savedPixel];
        });

      } catch (err) {
        console.error('paint POST/fetch failed', err);
      }
    }
  };

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
          plantedBy: pixel.owner__user__username || "Unknown",
          date: pixel.planted_on || "N/A",
          description: pixel.description || "No info available",
        };

        const key = `${pixel.x},${pixel.y}`;

        return (
          <PlantInteractive
            key={key}
            plantInfo={plantInfo}
          />
        );
      })}
    </div>
  );
}