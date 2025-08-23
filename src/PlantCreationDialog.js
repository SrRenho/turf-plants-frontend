import { useState } from "react";

export default function TextInputDialog({ visible, onOk, onCancel }) {
  const [text, setText] = useState("");

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)"
    }}>
      <div style={{
        background: "white",
        padding: "1rem",
        borderRadius: "0.5rem",
        maxWidth: "300px",
        width: "100%",
        textAlign: "center"
      }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={200}
          rows={4}
          style={{ width: "100%", marginBottom: "1rem",  resize: "none" }}
        />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button onClick={() => onOk(text)}>OK</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
