import React, { useState, useEffect, createContext } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './config';
import WelcomeBanner from './WelcomeBanner.js'
import LoginButton from './LoginButton.js';
import Game from './Game.js';
import { WebSocketProvider } from './WebSocketContext.js';
import { BACKEND } from './config';
import useServerReady from './useServerReady.js';
import LoadingScreen from './LoadingScreen.js';

export const UserContext = createContext(null);

export default function App() {
  const [user, setUser] = useState(null);


  const loading = useServerReady(`${BACKEND}/ping/`);


  if (loading) return <LoadingScreen />;

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
