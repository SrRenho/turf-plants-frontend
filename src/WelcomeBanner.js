import { useAuth } from "./AuthProvider";
import { usePlayer } from "./PlayerProvider";

export default function WelcomeBanner() {
    const { user } = useAuth();
    const { player } = usePlayer();
    return (
        <h3 style={{ textAlign: "left" }}>
            {user
            ? `Hello ${user.first_name || user.username || user.name}. ${
                player?.seeds > 0
                    ? `You have ${player?.seeds} seeds left. Click anywhere to plant!`
                    : "You've planted all your seeds. Thanks for leaving your mark in Turf Plants!"
                }`
            : "Login to plant!"
            }
        </h3>
    );
}