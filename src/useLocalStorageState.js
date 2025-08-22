import { useState, useEffect } from "react";

/**
 * Hook to persist state in localStorage
 * @param {string} key localStorage key
 * @param {any} initialValue initial state value
 */
export function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (state === null || state === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(state));
      }
    } catch {}
  }, [key, state]);

  return [state, setState];
}
