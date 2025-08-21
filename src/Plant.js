export default function Plant({ plantInfo, size }) {
  return (
    <img
      src="/plant.png"
      alt="Plant"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: `${size}px`,
        height: `${size}px`,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    />
  );
}
