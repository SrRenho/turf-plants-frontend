import { useAuth } from "./AuthProvider";

export default function WelcomeBanner() {
    const { user } = useAuth();
    return (
        <h3 style={{ textAlign: "left" }}>
            {user
            ? `Hello ${user.first_name || user.username || user.name}. ${
                user.seeds > 0
                    ? `You have ${user.seeds} seeds left. Click anywhere to plant!`
                    : "You've planted all your seeds. Thanks for leaving your mark in Turf Plants!"
                }`
            : "Login to plant!"
            }
        </h3>
    );
}