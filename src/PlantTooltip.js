export default function PlantTooltip({ visible, info, pos }) {
  if (!visible || !info) return null;

  const { x: mouseX, y: mouseY } = pos;

  return (
    <div
      style={{
        position: "fixed",
        left: mouseX,
        top: mouseY,
        transform: "translate(-50%, -120%)",
        pointerEvents: "none", // let pointer through by default
        zIndex: 99999,
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          background: "white",
          border: "1px solid rgba(0,0,0,0.9)",
          padding: "8px 12px",
          borderRadius: 8,
          fontSize: "14px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          pointerEvents: "auto" // make interactive only if you switch wrapper to allow it
        }}
      >
        <div>({info.x.toFixed(1)}, {info.y.toFixed(1)})</div>
        <div>Planted by: {info.plantedBy}</div>
        <div>On: {new Date(info.date).toLocaleDateString("en-GB")}</div>
        <div>{info.description}</div>
      </div>
    </div>
  );
}