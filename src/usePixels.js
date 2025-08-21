import React, { useState, useEffect } from 'react';
import { BACKEND } from './config';


export function usePixels(ws) {
  const [pixels, setPixels] = useState([]);

  const addPixel = (pixel) => setPixels(prev => [...prev, pixel]);

  // initial fetch
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BACKEND}/game_api/pixels/`);
        const data = await res.json();
        setPixels(data);
      } catch (err) {
        console.error("fetch failed", err);
      }
    })();
  }, []);

  // websocket updates
  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event) => {
      try {
        const pixel = JSON.parse(event.data);
        addPixel(pixel);
      } catch (err) {
        console.error("WS message parse error", err);
      }
    };

    ws.addEventListener("message", handleMessage);
    return () => ws.removeEventListener("message", handleMessage);
  }, [ws]);

  return [pixels, addPixel];
}
