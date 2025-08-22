import { paintPixel } from "./game_api";

export function usePaintPixel(user, ws, addPixel, addPendingPixel) {
  return async function handlePaint({ x, y }) {
    if (!user) return;

    // spawn placeholder immediately
    addPendingPixel({ x, y });

    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ x, y }));
    } else {
      try {
        const savedPixel = await paintPixel(user, x, y);
        addPixel(savedPixel); // replaces the placeholder
      } catch (err) {
        console.error("paint POST/fetch failed", err);
      }
    }
  };
}


