import { useEffect, useState } from "react";

export default function useServerReady(pingUrl) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    let interval;

    const checkServer = async () => {
      try {
        await fetch(pingUrl, { signal });
        if (!signal.aborted) {
          setLoading(false);
          clearInterval(interval); // stop retrying once successful
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Server not reachable", err);
        }
      }
    };

    checkServer(); // first try immediately
    interval = setInterval(checkServer, 2 * 60 * 1000); // retry every 2 mins

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [pingUrl]);

  return loading;
}
