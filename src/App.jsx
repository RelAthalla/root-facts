import { useCallback, useEffect, useRef, useState } from 'react';
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
    startCamera,
    stopCamera,
    toggleCamera,
  } = useCamera();
  const [fpsLimit, setFpsLimit] = useState(APP_CONFIG.defaultFpsLimit);
  const [lockedDetection, setLockedDetection] = useState(null);
  const attemptedGenerationKeysRef = useRef(new Set());
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
    resetFunFact,
  } = useTextGenerator();
  const { copyStatus, copyText } = useClipboard();
  const activeError = cameraError || detectionError || textState.error;
  const activeDetection = lockedDetection || detectionResult;
  const activeStableLabel = lockedDetection?.className || stableLabel;
  const activeGenerationKey = activeStableLabel ? `${activeStableLabel}:${persona}` : '';
  const needsRegenerate = Boolean(funFact && activeGenerationKey !== lastGeneratedKey);

  useEffect(() => {
    if (lockedDetection || !stableLabel || !detectionResult?.isValid) {
      return;
    }

    const lockedResult = {
      ...detectionResult,
      className: stableLabel,
      lockedAt: Date.now(),
    };

    setLockedDetection(lockedResult);
    stopCamera();
  }, [detectionResult, lockedDetection, stableLabel, stopCamera]);

  useEffect(() => {
    if (!lockedDetection || textState.isGenerating) {
      return;
    }

    const generationKey = `${lockedDetection.className}:${persona}`;

    if (lastGeneratedKey === generationKey || attemptedGenerationKeysRef.current.has(generationKey)) {
      return;
    }

    attemptedGenerationKeysRef.current.add(generationKey);
    generateFunFact(lockedDetection.className);
  }, [
    generateFunFact,
    lastGeneratedKey,
    lockedDetection,
    persona,
    textState.isGenerating,
  ]);

  const resetLockedDetection = useCallback(() => {
    attemptedGenerationKeysRef.current.clear();
    setLockedDetection(null);
    resetFunFact();
  }, [resetFunFact]);

  const handleCameraAction = useCallback(async () => {
    if (lockedDetection) {
      resetLockedDetection();
      await startCamera();
      return;
    }

    await toggleCamera();
  }, [lockedDetection, resetLockedDetection, startCamera, toggleCamera]);

  const handleScanAgain = useCallback(async () => {
    resetLockedDetection();
    await startCamera();
  }, [resetLockedDetection, startCamera]);

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
          onToggleCamera={handleCameraAction}
          modelState={modelState}
          cameraStatus={cameraStatus}
          facingMode={facingMode}
          onFacingModeChange={setFacingMode}
          fpsLimit={fpsLimit}
          onFpsLimitChange={setFpsLimit}
          error={cameraError || detectionError}
        />

        <InfoPanel
          detectionResult={activeDetection}
          stableLabel={activeStableLabel}
          stableCount={stableCount}
          stableTarget={stableTarget}
          isLocked={Boolean(lockedDetection)}
          persona={persona}
          activePersona={activePersona}
          onPersonaChange={setPersona}
          textState={textState}
          funFact={funFact}
          needsRegenerate={needsRegenerate}
          onGenerate={() => generateFunFact(activeStableLabel)}
          onScanAgain={handleScanAgain}
          onCopyFact={() => copyText(funFact?.text)}
          copyStatus={copyStatus}
          canGenerate={Boolean(activeStableLabel && !textState.isGenerating)}
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
