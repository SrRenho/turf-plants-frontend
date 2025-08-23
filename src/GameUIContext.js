// add useRef
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import PlantTooltip from "./PlantTooltip";
import PlantCreationDialog from "./PlantCreationDialog";

const GameUIContext = createContext(null);

export function GameUIProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState(null);
  const [pos, setPos] = useState({ x: -9999, y: -9999 });

  const [zoom, setZoom] = useState(100);

  // ---- plant dialog state ----
  const [plantDialogVisible, setPlantDialogVisible] = useState(false);
  const [plantDialogPos, setPlantDialogPos] = useState(null); // {x,y}
  const plantDialogResolveRef = useRef(null);

  useEffect(() => {
    const handleMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const show = (payload) => { setInfo(payload); setVisible(true); };
  const hide = () => { setVisible(false); setInfo(null); };

  // ---- promise-based open/close for PlantCreationDialog ----
  const openPlantCreationDialog = ({ x, y }) =>
    new Promise((resolve) => {
      plantDialogResolveRef.current = resolve;
      setPlantDialogPos({ x, y });
      setPlantDialogVisible(true);
    });

  const closePlantCreationDialog = (result) => {
    plantDialogResolveRef.current?.(result);
    plantDialogResolveRef.current = null;
    setPlantDialogVisible(false);
    setPlantDialogPos(null);
  };

  return (
    <GameUIContext.Provider
      value={{
        show, hide, visible, info, pos,
        zoom, setZoom,
        // expose only what’s needed for the dialog
        openPlantCreationDialog,
        closePlantCreationDialog,
      }}
    >
      {children}
      <PlantTooltip visible={visible} info={info} pos={pos} />

      <PlantCreationDialog
        visible={plantDialogVisible}
        pos={plantDialogPos}
        onOk={(data) => closePlantCreationDialog(data)}
        onCancel={() => closePlantCreationDialog(null)}
      />
    </GameUIContext.Provider>
  );
}

// keep tooltip hook lean
export function useTooltip() {
  const ctx = useContext(GameUIContext);
  if (!ctx) throw new Error("useTooltip must be used within GameUIProvider");
  return { show: ctx.show, hide: ctx.hide, visible: ctx.visible, info: ctx.info, pos: ctx.pos };
}

export function useZoomDisplay() {
  const ctx = useContext(GameUIContext);
  if (!ctx) throw new Error("useZoomDisplay must be used within GameUIProvider");
  return { zoom: ctx.zoom, setZoom: ctx.setZoom };
}

// dialog hook: one clean async API
export function usePlantDialog() {
  const ctx = useContext(GameUIContext);
  if (!ctx) throw new Error("usePlantDialog must be used within GameUIProvider");
  return {
    prompt: ({ x, y }) => ctx.openPlantCreationDialog({ x, y }), // returns Promise
    cancel: (result = null) => ctx.closePlantCreationDialog(result),
  };
}
