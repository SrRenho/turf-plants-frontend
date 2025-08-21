import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { BACKEND, WS_BACKEND } from './config';

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const { user } = useAuth(); // react to user login
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (!user) return; // don't connect if no user

    let socket;

    const connect = async () => {
      try {
        const wsRes = await fetch(`${BACKEND}/api/auth/token/`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${user.access_token}` },
        });
        const wsData = await wsRes.json();
        const ws_uuid = wsData.uuid;

        socket = new WebSocket(`${WS_BACKEND}/ws/pixels/?uuid=${ws_uuid}`);

        socket.onopen = () => console.log("WS connected!");
        socket.onclose = () => console.log("WS closed");
        socket.onerror = (err) => console.error("WS error:", err);

        setWs(socket);
      } catch (err) {
        console.error("WS setup failed", err);
      }
    };

    connect();

    return () => {
      if (socket) socket.close();
    };
  }, [user]);

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
