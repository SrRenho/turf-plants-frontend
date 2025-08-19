import React, { useState, createContext } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './config';
import WelcomeBanner from './WelcomeBanner.js'
import LoginButton from './LoginButton.js';
import Game from './Game.js';

export const UserContext = createContext(null);

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <WelcomeBanner />
          <LoginButton />
          <div style={{ filter: !user ? 'blur(5px)' : 'none' }}>
            <Game />
          </div>
        </div>
      </GoogleOAuthProvider>
    </UserContext.Provider>
  );
}
