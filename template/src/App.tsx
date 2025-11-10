import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [version, setVersion] = useState<string>('');
  const [platform, setPlatform] = useState<string>('');

  useEffect(() => {
    // Example: Get app info from Electron main process
    if (window.electronAPI) {
      window.electronAPI.getVersion().then(setVersion);
      window.electronAPI.getPlatform().then(setPlatform);
    }
  }, []);

  return (
    <div className="app">
      <div className="app-content">
        <h1>⚡ Electron + Vite</h1>
        <p>Welcome to your new Electron application!</p>
        {version && (
          <div className="info">
            <p>Version: {version}</p>
            <p>Platform: {platform}</p>
          </div>
        )}
        <div className="card">
          <h2>Getting Started</h2>
          <ul>
            <li>Edit <code>src/App.tsx</code> to start building your app</li>
            <li>Run <code>pnpm dev</code> for development with hot reload</li>
            <li>Run <code>pnpm build</code> to build for production</li>
            <li>Run <code>pnpm start</code> to launch the Electron app</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;


