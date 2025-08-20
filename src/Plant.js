export default function Plant({ size }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `$0px`,
        top: `$0px`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: 'black',
        pointerEvents: 'none'
      }}
    />
  );
}
