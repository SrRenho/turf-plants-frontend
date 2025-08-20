import React, { useState, useEffect, createContext } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './config';
import WelcomeBanner from './WelcomeBanner.js'
import LoginButton from './LoginButton.js';
import Game from './Game.js';
import { WebSocketProvider } from './WebSocketContext.js';
import { BACKEND } from './config';

export const UserContext = createContext(null);

export default function App() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      try {
        await fetch(`${BACKEND}/ping/`);
        setLoading(false);
      } catch (err) {
        console.error("Server not reachable", err);
      }
    };
    checkServer();
  }, []);

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Server loading...<br/>Free tier hosting may take a minute!<br/>Be patient</div>;


  return (
    <UserContext.Provider value={{ user, setUser }}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <WebSocketProvider>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <WelcomeBanner />
            <LoginButton />
            <div style={{ filter: !user ? 'blur(5px)' : 'none' }}>
              <Game />
            </div>
          </div>
        </WebSocketProvider>
      </GoogleOAuthProvider>
    </UserContext.Provider>
  );
}
