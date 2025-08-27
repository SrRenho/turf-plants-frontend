import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { fetchPlayer } from './game_api';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const { user } = useAuth(); // only auth info
  const [player, setPlayer] = useState(null); // null until loaded

  // load player when user logs in
  useEffect(() => {
    if (!user) {
      setPlayer(null); // clear player on logout
      return;
    }

    let aborted = false;

    const loadPlayer = async () => {
      try {
        const data = await fetchPlayer(user);
        if (!aborted) setPlayer(data);
      } catch (err) {
        console.error("Failed to load player:", err);
      }
    };

    loadPlayer();

    return () => { aborted = true; }; // prevent setting state after unmount
  }, [user]);

  // helper to safely decrease seeds locally
  const decreaseSeed = (amount = 1) => {
    if (!player) return;
    setPlayer((p) => ({ ...p, seeds: Math.max(0, p.seeds - amount) }));
  };

  return (
    <PlayerContext.Provider value={{ player, decreaseSeed }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
