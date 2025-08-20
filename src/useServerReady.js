import { useEffect, useState } from "react";

export default function useServerReady(pingUrl) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        await fetch(pingUrl, { signal });
        if (!signal.aborted) setLoading(false);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Server not reachable", err);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [pingUrl]);

  return loading;
}