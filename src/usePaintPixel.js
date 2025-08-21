import { BACKEND } from "./config"; 

export function usePaintPixel(user, ws, addPixel) {
  return async function handleClick(e) {
    if (!user) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    const pixelData = { x, y };

    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(pixelData));
    } else {
      try {
        const res = await fetch(`${BACKEND}/game_api/paint/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.access_token}`,
          },
          body: JSON.stringify(pixelData),
        });
        const savedPixel = await res.json();
        addPixel(savedPixel);
      } catch (err) {
        console.error("paint POST/fetch failed", err);
      }
    }
  };
}
