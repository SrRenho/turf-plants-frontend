import { useAuth } from "./AuthProvider";

export default function WelcomeBanner() {
    const { user } = useAuth();
    return (
        <h3  style={{ textAlign: "left" }}>{user ? `Hello ${user.first_name || user.username || user.name}. Click anywhere to plant!` : 'Login to plant!'}</h3>
    );
}