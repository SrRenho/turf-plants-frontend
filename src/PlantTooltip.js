export function PlantTooltip({ plantInfo }) {
  const { x, y, plantedBy, date, description } = plantInfo;

  return (
    <span
      style={{
        position: "absolute",
        left: "50%",
        top: 0,
        transform: "translate(-50%, -110%)", // move up by 100% of height + 10%
        marginBottom: "8px", // extra space above cursor
        background: "white",
        border: "1px solid black",
        padding: "8px 16px",
        fontSize: "1.1rem",
        borderRadius: "8px",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 9999,
      }}
    >
      ({x}, {y})<br />
      Planted by: {plantedBy}<br />
      On: {date}<br />
      {description}
    </span>
  );
}
