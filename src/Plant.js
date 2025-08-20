export default function Plant({ x, y, size }) {
  const HALF = size / 2;
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x - HALF}px`,
        top: `${y - HALF}px`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: 'black',
        pointerEvents: 'none'
      }}
    />
  );
}
