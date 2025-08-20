import React, { useState, useEffect, useRef, useContext } from 'react';
import { BACKEND, WS_BACKEND } from './config';
import { UserContext } from './App';
import PlantInteractive from './PlantInteractive';

export default function Game(){
  const { user } = useContext(UserContext);

  const PIXEL_SIZE = 5; // circle diameter in px

  const [pixels, setPixels] = useState(new Set());

  const socketRef = useRef(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const resPixels = await fetch(`${BACKEND}/game_api/pixels/`);
          const dataPixels = await resPixels.json();
          setPixels(new Set(dataPixels.map(p => `${p[0]},${p[1]}`)));

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
        const key = `${pixel.x},${pixel.y}`;
        setPixels(prev => new Set(prev).add(key));
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

  const handleClick = (e) => {
    if (!user) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    const pixelData = { x, y, color: '#000000' };

    // Try WebSocket first
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(pixelData));
    } else {
      // fallback to POST
      const token = user?.access_token;

      fetch(`${BACKEND}/game_api/paint/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ x, y, color: pixelData.color }),
      })
      .catch(err => console.error('paint POST failed', err));
    }

    // Optimistically update local state
    setPixels(prev => new Set(prev).add(`${x},${y}`));
  };

  return (
      <div
        onClick={handleClick}
        style={{ width: '90vw', height: '90vh', border: '1px solid black', position: 'relative', userSelect: 'none', cursor: user ? 'crosshair' : 'not-allowed', }}
      >
        {[...pixels].map(coord => {
          const [x, y] = coord.split(',').map(Number);
          return (
            <PlantInteractive
              key={coord}
              x={x}
              y={y}
              size={PIXEL_SIZE}
            />
          );
        })}
      </div>
  );
}