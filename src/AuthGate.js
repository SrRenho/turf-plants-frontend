import { useAuth } from "./AuthProvider";

export function AuthGate({ children }) {
  const { user } = useAuth();

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Render the actual content (blurred if not user) */}
      <div style={{ filter: !user ? "blur(5px)" : "none" }}>
        {children}
      </div>

      {/* Overlay to block everything if no user */}
      {!user && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            background: "transparent",
            cursor: "not-allowed",
          }}
        />
      )}
    </div>
  );
}
