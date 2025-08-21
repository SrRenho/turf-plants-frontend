import { BACKEND } from "./config";

export async function fetchPixels() {
  const res = await fetch(`${BACKEND}/game_api/pixels/`);
  if (!res.ok) throw new Error("Failed to fetch pixels");
  return await res.json();
}

export async function paintPixel(user, x, y) {
  const res = await fetch(`${BACKEND}/game_api/paint/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${user.access_token}`,
    },
    body: JSON.stringify({ x, y }),
  });

  if (!res.ok) throw new Error("Failed to paint pixel");
  return await res.json();
}
