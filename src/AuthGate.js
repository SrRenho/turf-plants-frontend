import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import { GoogleLogin } from "@react-oauth/google";

export function AuthGate({ children }) {
  const [dismiss, setDismiss] = useState(false);
  const { user, login } = useAuth();

  const blocked = !user && !dismiss;
  
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Render the actual content (blurred if blocked) */}
      <div style={{ filter: blocked ? "blur(5px)" : "none" }}>
        {children}
      </div>

      {/* Overlay to block everything if blocked */}
      {blocked && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0,0,0,0.5)", // soft overlay
            color: "white",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Log in to plant your own Turf Plant!</h2>
          
          <GoogleLogin
            onSuccess={login}
            onError={() => console.log("Login Failed")}
            useOneTap={false}
          />

          <button
            onClick={() => setDismiss(true)}
            style={{
              marginTop: "1rem",
              background: "none",
              border: "none",
              color: "#ddd",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Or browse the garden as a guest
          </button>
        </div>
      )}
    </div>
  );
}
