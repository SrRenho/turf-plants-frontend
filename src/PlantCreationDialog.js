import { useState, useEffect, useRef } from "react";

export default function TextInputDialog({ visible, pos, onOk, onCancel }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  // Focus and select textarea when modal becomes visible
  useEffect(() => {
    if (visible && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select(); // ← auto-select all text
    }
  }, [visible]);

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
        <span style={{ fontSize: '0.8em', color: 'gray' }}>
          Planting at ({pos.x.toFixed(1)}, {pos.y.toFixed(1)})
        </span>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={200}
          rows={4}
          style={{ width: "100%", marginBottom: "1rem", resize: "none" }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // prevent newline
              onOk(text);
            } else if (e.key === "Escape") {
              e.preventDefault();
              onCancel(); // ← ESC to cancel
            }
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button onClick={() => onOk(text)}>OK</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
