import { paintPixel } from "./game_api";

export function usePaintPixel(user, ws, addPixel, addPendingPixel) {
  return async function handlePaint({ x, y}, description ) {
    description ||= "";
    if (!user) return;

    // spawn placeholder immediately
    addPendingPixel( {x, y} );

    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ x, y, description }));
    } else {
      try {
        const savedPixel = await paintPixel(user, x, y, description);
        addPixel(savedPixel); // replaces the placeholder
      } catch (err) {
        console.error("paint POST/fetch failed", err);
      }
    }
  };
}


