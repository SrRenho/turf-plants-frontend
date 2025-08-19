import React, { useContext } from 'react';
import { UserContext } from './App';
import { BACKEND } from './config';
import { GoogleLogin, googleLogout } from '@react-oauth/google';

export default function LoginButton() {
    const { user, setUser } = useContext(UserContext);

    const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(`${BACKEND}/google-login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: credentialResponse.credential }),
      });

      const data = await res.json();

      if (data.user) setUser(data.user);
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

