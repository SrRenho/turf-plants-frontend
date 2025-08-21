import { paintPixel } from "./game_api";

export function usePaintPixel(user, ws, addPixel) {
  return async function handleClick(e) {
    if (!user) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

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
