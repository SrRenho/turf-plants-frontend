import { createContext, useContext, useState, useEffect } from "react";
import { GoogleOAuthProvider, googleLogout } from "@react-oauth/google";
import { BACKEND, GOOGLE_CLIENT_ID } from "./config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // load user from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("auth_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (credentialResponse) => {
    try {
      const res = await fetch(`${BACKEND}/google-login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (data.access && data.user) {
        const userData = { ...data.user, access_token: data.access };
        setUser(userData);
        localStorage.setItem("auth_user", JSON.stringify(userData)); // persist
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user"); // clear storage
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
  return ctx; // { user, login, logout }
}
