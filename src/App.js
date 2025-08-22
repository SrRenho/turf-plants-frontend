import { BACKEND } from './config.js';
import useServerReady from './useServerReady.js';
import LoadingScreen from './LoadingScreen.js';
import AppContent from './AppContent.js'; 

export default function App() {
  const loading = useServerReady(`${BACKEND}/ping/`);

    return <AppContent />;
  return loading ? <LoadingScreen /> : <AppContent />;
}
