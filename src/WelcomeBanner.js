import { useAuth } from "./AuthProvider";

export default function WelcomeBanner() {
    const { user } = useAuth();
    return (
        <h3  style={{ textAlign: "left" }}>{user ? `Hello ${user.first_name || user.username || user.name}` : 'Login to plant!'}</h3>
    );
}