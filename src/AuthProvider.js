import { createContext, useContext } from "react";
import { GoogleOAuthProvider, googleLogout } from "@react-oauth/google";
import { BACKEND, GOOGLE_CLIENT_ID } from "./config";
import { useLocalStorageState } from "./useLocalStorageState.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorageState("auth_user", null);

  const login = async (credentialResponse) => {
    try {
      const res = await fetch(`${BACKEND}/google-login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (data.access && data.user) {
        setUser({ ...data.user, access_token: data.access });
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const logout = () => {
    setUser(null);
    googleLogout();
  };


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {children}
      </GoogleOAuthProvider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
