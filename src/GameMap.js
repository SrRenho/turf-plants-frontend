export default function GameMap({ onTileClick, children }) {
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
        width: "3000px",
        height: "3000px",
        border: "1px solid black",
        position: "relative",
        userSelect: "none",
        cursor: "crosshair",
        backgroundImage: 'url("/grass-background.jpg")', // path relative to public/
        backgroundSize: "auto",
        backgroundRepeat: "repeat",
      }}
    >
      {children}
    </div>
  );
}
