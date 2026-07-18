import { Download, Sprout, Wifi, WifiOff } from 'lucide-react';
import { formatProgress } from '../utils/common.js';

function Header({ modelState, isOnline, install }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" aria-label="Root Fact App">
          <Sprout size={20} />
          <span>Root Fact App</span>
        </div>

        <div className="header-actions">
          <div className={`network-pill ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {install.canInstall && (
            <button
              className="icon-btn"
              onClick={install.installApp}
              title="Instal PWA"
              aria-label="Instal PWA"
            >
              <Download size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="model-strip">
        <div className="status-pill">
          <span className={`status-dot ${modelState.isReady ? 'active' : ''}`}></span>
          <span>{modelState.status}</span>
        </div>
        <span className="progress-text">{formatProgress(modelState.progress)}</span>
      </div>
    </header>
  );
}

export default Header;
