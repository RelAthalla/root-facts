import { useState } from 'react';
import Header from './components/Header.jsx';
import CameraSection from './components/CameraSection.jsx';
import InfoPanel from './components/InfoPanel.jsx';
import { useCamera } from './hooks/useCamera.js';
import { useClipboard } from './hooks/useClipboard.js';
import { useOnlineStatus } from './hooks/useOnlineStatus.js';
import { usePwaInstall } from './hooks/usePwaInstall.js';
import { useTextGenerator } from './hooks/useTextGenerator.js';
import { useVegetableDetector } from './hooks/useVegetableDetector.js';
import { APP_CONFIG } from './utils/config.js';

function App() {
  const {
    videoRef,
    canvasRef,
    cameraService,
    isCameraActive,
    cameraStatus,
    cameraError,
    facingMode,
    setFacingMode,
    toggleCamera,
  } = useCamera();
  const [fpsLimit, setFpsLimit] = useState(APP_CONFIG.defaultFpsLimit);
  const isOnline = useOnlineStatus();
  const pwaInstall = usePwaInstall();
  const {
    modelState,
    detectionResult,
    stableLabel,
    stableCount,
    stableTarget,
    detectionError,
  } = useVegetableDetector({
    videoRef,
    cameraService,
    isCameraActive,
    fpsLimit,
  });
  const {
    persona,
    setPersona,
    activePersona,
    textState,
    funFact,
    lastGeneratedKey,
    generateFunFact,
  } = useTextGenerator();
  const { copyStatus, copyText } = useClipboard();
  const activeError = cameraError || detectionError || textState.error;
  const activeGenerationKey = stableLabel ? `${stableLabel}:${persona}` : '';
  const needsRegenerate = Boolean(funFact && activeGenerationKey !== lastGeneratedKey);

  return (
    <div className="app-container">
      <Header
        modelState={modelState}
        isOnline={isOnline}
        install={pwaInstall}
      />

      <main className="main-content">
        <CameraSection
          videoRef={videoRef}
          canvasRef={canvasRef}
          isRunning={isCameraActive}
          onToggleCamera={toggleCamera}
          modelState={modelState}
          cameraStatus={cameraStatus}
          facingMode={facingMode}
          onFacingModeChange={setFacingMode}
          fpsLimit={fpsLimit}
          onFpsLimitChange={setFpsLimit}
          error={cameraError || detectionError}
        />

        <InfoPanel
          detectionResult={detectionResult}
          stableLabel={stableLabel}
          stableCount={stableCount}
          stableTarget={stableTarget}
          persona={persona}
          activePersona={activePersona}
          onPersonaChange={setPersona}
          textState={textState}
          funFact={funFact}
          needsRegenerate={needsRegenerate}
          onGenerate={() => generateFunFact(stableLabel)}
          onCopyFact={() => copyText(funFact?.text)}
          copyStatus={copyStatus}
          canGenerate={Boolean(stableLabel && !textState.isGenerating)}
          error={activeError}
        />
      </main>

      <footer className="footer">
        <p>Inference kamera berjalan lokal di perangkat. Tidak ada frame kamera yang diunggah.</p>
      </footer>
    </div>
  );
}

export default App;
