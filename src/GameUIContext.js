import React, { createContext, useContext, useState, useEffect } from "react";
import PlantTooltip from "./PlantTooltip";  

const GameUIContext = createContext(null);

export function GameUIProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState(null);
  const [pos, setPos] = useState({ x: -9999, y: -9999 });


  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const handleMove = (e) => {
      // Track raw screen coords (viewport)
      setPos({ x: e.clientX, y: e.clientY });
    };

    // Always listen globally — we only render tooltip when visible.
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const show = (payload) => {
    setInfo(payload);
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
    // keep info if you want or clear it:
    setInfo(null);
  };

  return (
    <GameUIContext.Provider value={{ show, hide, visible, info, pos, zoom, setZoom }}>
      {children}
      <PlantTooltip visible={visible} info={info} pos={pos} />
    </GameUIContext.Provider>
  );
}

export function useTooltip() {
  const ctx = useContext(GameUIContext);
  if (!ctx) throw new Error("useTooltip must be used within GameUIProvider");

  return {
    show: ctx.show,
    hide: ctx.hide,
    visible: ctx.visible,
    info: ctx.info,
    pos: ctx.pos,
  };
}

export function useZoomDisplay() {
  const ctx = useContext(GameUIContext);
  if (!ctx) throw new Error("useZoomDisplay must be used within GameUIProvider");
  return {
    zoom: ctx.zoom,
    setZoom: ctx.setZoom
  };
}