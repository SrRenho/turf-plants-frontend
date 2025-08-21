import { useState, useEffect } from "react";
import { fetchPixels } from "./game_api";

export function usePixels(ws) {
  const [pixels, setPixels] = useState([]);
  const addPixel = (pixel) => setPixels(prev => [...prev, pixel]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPixels();
        setPixels(data);
      } catch (err) {
        console.error("fetch failed", err);
      }
    })();
  }, []);

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
