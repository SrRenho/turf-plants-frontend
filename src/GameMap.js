export default function GameMap({ width, height, onTileClick, children }) {
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
    onTileClick({ x, y });
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width,
        height,
        border: "1px solid black",
        position: "relative",
        userSelect: "none",
        cursor: "crosshair",
      }}
    >
      {children}
    </div>
  );
}
