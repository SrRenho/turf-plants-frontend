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
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8em", color: "gray" }}>
            <span>({info.x.toFixed(1)}, {info.y.toFixed(1)})</span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <span>Lvl: {info.level}</span>
              <span>
                Next: {Math.floor(info.xp_into_level)} / {Math.floor(info.xp_until_next)} XP
              </span>
            </div>
          </div>
          <br />
        { info.description ? (
          <>
          <span
            style={{
              display: 'inline-block',   // allow width
              maxWidth: '300px',         // adjust to desired "square" width
              fontSize: '1.1em',
              margin: '0.5em 0',
              whiteSpace: 'normal',      // allow wrapping
              wordWrap: 'break-word',    // break long words
              wordBreak: 'break-word',   // extra safety for long strings
              textAlign: 'justify'
            }}
          >
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