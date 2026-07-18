import { Camera, Gauge, RefreshCcw, ScanLine, Video } from 'lucide-react';
import { APP_CONFIG } from '../utils/config.js';

function CameraSection({
  videoRef,
  canvasRef,
  isRunning,
  onToggleCamera,
  modelState,
  cameraStatus,
  facingMode,
  onFacingModeChange,
  fpsLimit,
  onFpsLimitChange,
  error,
}) {
  const buttonDisabled = !modelState.isReady;
  const buttonText = isRunning ? 'Stop Scan' : 'Mulai Scan';

  return (
    <section className="camera-section" aria-label="Area kamera dan kontrol deteksi">
      <div className="camera-container">
        <div className="camera-wrapper">
          <video
            ref={videoRef}
            id="media-video"
            autoPlay
            muted
            playsInline
            className={isRunning ? '' : 'hidden'}
          />

          <canvas
            ref={canvasRef}
            id="media-canvas"
            className="hidden"
          />

          <div className={`camera-overlay ${isRunning ? 'active' : ''}`}>
            <div className="overlay-frame"></div>
          </div>

          {!isRunning && (
            <div className="camera-placeholder">
              <Video size={48} />
              <p>{buttonDisabled ? 'Tunggu model siap sebelum scan' : 'Kamera tidak aktif'}</p>
              {error && <p className="inline-error">{error}</p>}
            </div>
          )}
        </div>

        <div className="camera-controls">
          <button
            id="btn-toggle"
            className={`capture-btn ${isRunning ? 'scanning' : ''}`}
            onClick={onToggleCamera}
            disabled={buttonDisabled}
            aria-label={buttonText}
            title={buttonText}
          >
            <ScanLine size={24} />
          </button>
        </div>

        <div className="settings-bar">
          <div className="setting-row">
            <div className="setting-item">
              <Camera size={16} />
              <select
                id="camera-select"
                value={facingMode}
                onChange={(event) => onFacingModeChange(event.target.value)}
                disabled={isRunning}
                aria-label="Pilih kamera"
              >
                <option value="environment">Belakang</option>
                <option value="front">Depan</option>
              </select>
            </div>

            <div className="setting-item">
              <Gauge size={16} />
              <select
                id="fps-select"
                value={fpsLimit}
                onChange={(event) => onFpsLimitChange(Number(event.target.value))}
                aria-label="Batas FPS"
              >
                {APP_CONFIG.fpsOptions.map((option) => (
                  <option key={option} value={option}>{option} FPS</option>
                ))}
              </select>
            </div>
          </div>

          <div className="debug-grid">
            <span>Status kamera</span>
            <strong>{cameraStatus}</strong>
            <span>TensorFlow backend</span>
            <strong>{modelState.backend}</strong>
            <span>Progress model</span>
            <strong>{Math.round(modelState.progress)}%</strong>
          </div>

          {isRunning && (
            <button className="secondary-btn" onClick={onToggleCamera}>
              <RefreshCcw size={16} />
              <span>Hentikan kamera</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default CameraSection;
