import { AuthProvider, useAuth } from './AuthProvider.js';
import WelcomeBanner from './WelcomeBanner.js'
import LoginButton from './LoginButton.js';
import Game from './Game.js';
import { WebSocketProvider } from './WebSocketContext.js';
import { AuthGate } from './AuthGate.js';
import Footer from './Footer.js';
import { GameUIProvider } from "./GameUIContext";

export default function AppContent() {
    return (
        <AuthProvider>
            <AuthGate>
            <div style={{ padding: '1rem' }}>
                <WelcomeBanner />
                <LoginButton />
                <WebSocketProvider>
                    <GameUIProvider>
                        <Game />
                    </GameUIProvider>
                </WebSocketProvider>
            </div>
            </AuthGate>
            <Footer />
        </AuthProvider>
  );
}