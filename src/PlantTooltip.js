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
        <div style={{ width: '100%', fontFamily: 'sans-serif' }}>
          <span style={{ fontSize: '0.8em', color: 'gray' }}>
            ({info.x.toFixed(1)}, {info.y.toFixed(1)})
          </span>
          <br />
        { info.description ? (
          <>
          <span style={{ fontSize: '1.1em', margin: '0.5em 0' }}>
            “{info.description}”
          </span>
          <br />
          <br />
          <span style={{ fontStyle: 'italic', textAlign: 'right', display: 'block' }}>
            — {info.plantedBy}, {new Date(info.date).toLocaleDateString("en-GB")}
          </span>
          </>
          )
          :
          (          
            <span style={{ fontStyle: 'italic', textAlign: 'right', display: 'block' }}>
            Planted by {info.plantedBy}, {new Date(info.date).toLocaleDateString("en-GB")}
            </span>
          ) 
          }
        </div>
      </div>
    </div>
  );
}