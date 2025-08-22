import { AuthProvider, useAuth } from './AuthProvider.js';
import WelcomeBanner from './WelcomeBanner.js'
import LoginButton from './LoginButton.js';
import Game from './Game.js';
import { WebSocketProvider } from './WebSocketContext.js';
import { AuthGate } from './AuthGate.js';
import Footer from './Footer.js';


export default function AppContent() {
    return (
        <AuthProvider>
            <div style={{ padding: '2rem' }}>
                <WelcomeBanner />
                <LoginButton />
                <AuthGate>
                    <WebSocketProvider>
                        <Game />
                    </WebSocketProvider>
                </AuthGate>
            </div>
            <Footer />
        </AuthProvider>
  );
}