export function PlantTooltip({ x, y }) {
  return (
    <span
      style={{
        position: "absolute",
        top: "-1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        background: "white",
        border: "1px solid black",
        padding: "2px 4px",
        fontSize: "0.7rem",
        borderRadius: "4px",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      ({x}, {y})
    </span>
  );
}
