// WebSocketContext.js
import { createContext, useContext, useState } from "react";

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  return (
    <WebSocketContext.Provider value={{ ws, setWs }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
