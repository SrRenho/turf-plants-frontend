import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { BACKEND, WS_BACKEND } from './config';

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const { user, logout } = useAuth(); // <-- get logout
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (!user) {
      // ensure we clear any existing socket when user logs out or is null
      setWs((s) => {
        if (s) s.close();
        return null;
      });
      return;
    }

    let socket;
    let aborted = false;

    const connect = async () => {
      try {
        const wsRes = await fetch(`${BACKEND}/api/auth/token/`, {
          method: "GET",
          headers: { Authorization: `Bearer ${user.access_token}` },
        });

        // if token endpoint failed (expired / invalid), logout
        if (!wsRes.ok) {
          console.warn("WS token fetch failed, logging out:", wsRes.status);
          logout();
          return;
        }

        const wsData = await wsRes.json();
        const ws_uuid = wsData.uuid;

        if (aborted) return; // don't proceed if cleaned up

        socket = new WebSocket(`${WS_BACKEND}/ws/pixels/?uuid=${ws_uuid}`);

        socket.onopen = () => console.log("WS connected!");
        socket.onclose = () => console.log("WS closed");
        socket.onerror = (err) => console.error("WS error:", err);

        setWs(socket);
      } catch (err) {
        console.error("WS setup failed:", err);
        // treat any error during setup as session expiry / failure -> logout
        logout();
      }
    };

    connect();

    return () => {
      aborted = true;
      if (socket) socket.close();
      setWs(null);
    };
  }, [user, logout]);

  return (
    <WebSocketContext.Provider value={{ ws }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error("useWebSocket must be used within WebSocketProvider");
  return ctx;
}

export default WebSocketContext;
