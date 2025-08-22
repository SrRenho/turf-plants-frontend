import { useAuth } from "./AuthProvider";

export default function WelcomeBanner() {
    const { user } = useAuth();
    return (
        <h3>{user ? `Hello ${user.first_name || user.username || user.name}` : 'Hello. Login to play.'}</h3>
    );
}