import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "./AuthProvider";

export default function LoginButton() {
  const { user, login, logout } = useAuth();

  return !user ? (
    <GoogleLogin
      onSuccess={login}
      onError={() => console.log("Login Failed")}
      useOneTap={false}
    />
  ) : (
    <button onClick={logout} style={{ marginRight: 'auto', marginTop: "1rem", padding: "0.5rem 1rem" }}>
      Logout
    </button>
  );
}


