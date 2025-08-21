import { paintPixel } from "./game_api";

export function usePaintPixel(user, ws, addPixel) {
  return async function handlePaint({ x, y }) {
    if (!user) return;

    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ x, y }));
    } else {
      try {
        const savedPixel = await paintPixel(user, x, y);
        addPixel(savedPixel);
      } catch (err) {
        console.error("paint POST/fetch failed", err);
      }
    }
  };
}

