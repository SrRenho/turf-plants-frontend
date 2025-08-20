import React, { useContext } from 'react';
import { UserContext } from './App';
import { BACKEND } from './config';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { useWebSocket } from "./WebSocketContext";

export default function LoginButton() {
    const { user, setUser } = useContext(UserContext);
    const { setWs } = useWebSocket();

    const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(`${BACKEND}/google-login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: credentialResponse.credential }),
      });

      const data = await res.json();

      if (data.access && data.user) {
        const newUser = { ...data.user, access_token: data.access };
        setUser(newUser); // store access token with user

        // get WS UUID ticket from backend
        const wsRes = await fetch(`${BACKEND}/api/auth/token/`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${data.access}`,
            "Content-Type": "application/json",
          },
        });
        const wsData = await wsRes.json();
        const ws_uuid = wsData.uuid;

        // open WebSocket
        const socket = new WebSocket(`${WS_BACKEND}/ws/game/?uuid=${ws_uuid}`);
        socket.onopen = () => console.log("WS connected!");
        socket.onmessage = (msg) => console.log("WS message:", msg.data);
        socket.onclose = () => console.log("WS closed");

        setWs(socket);
      }       
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    googleLogout();
  };

  return (
    <>
      {!user ? (
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => console.log('Login Failed')}
          useOneTap={false}
        />
      ) : (
        <button
          onClick={handleLogout}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
        >
          Logout
        </button>
      )}
    </>
  );
}

