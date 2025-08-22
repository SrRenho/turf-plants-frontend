import { useState, useEffect } from "react";
import { fetchPixels } from "./game_api";

export function usePixels(ws) {
  const [pixels, setPixels] = useState([]);

  const addPixel = (pixel) =>
    setPixels((prev) => {
      // If a pending placeholder exists at the same coordinates, replace it
      const filtered = prev.filter(
        (p) => !(p.x === pixel.x && p.y === pixel.y && p.pending)
      );
      return [...filtered, pixel];
    });

  const addPendingPixel = ({ x, y }) =>
    setPixels((prev) => [...prev, { x, y, pending: true }]);

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
        addPixel(pixel); // replaces any pending placeholder automatically
      } catch (err) {
        console.error("WS message parse error", err);
      }
    };

    ws.addEventListener("message", handleMessage);
    return () => ws.removeEventListener("message", handleMessage);
  }, [ws]);

  return [pixels, addPixel, addPendingPixel];
}
