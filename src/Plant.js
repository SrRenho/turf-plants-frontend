export default function Plant({ size }) {
  return (
    <img
      src="/plant.png" // adjust path as needed
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
