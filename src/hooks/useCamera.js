import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CameraService } from '../services/CameraService.js';
import { logError } from '../utils/common.js';

export function useCamera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const service = useMemo(() => new CameraService(), []);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStatus, setCameraStatus] = useState('Kamera tidak aktif');
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');

  useEffect(() => {
    if (videoRef.current) {
      service.setVideoElement(videoRef.current);
    }

    if (canvasRef.current) {
      service.setCanvasElement(canvasRef.current);
    }
  }, [service]);

  const startCamera = useCallback(async () => {
    setCameraStatus('Meminta izin kamera...');
    setCameraError(null);

    try {
      await service.startCamera(facingMode);
      setIsCameraActive(true);
      setCameraStatus('Kamera aktif');
    } catch (error) {
      logError('Kamera gagal dimulai', error);
      setIsCameraActive(false);
      setCameraStatus('Kamera gagal aktif');
      setCameraError(error.message);
    }
  }, [facingMode, service]);

  const stopCamera = useCallback(() => {
    service.stopCamera();
    setIsCameraActive(false);
    setCameraStatus('Kamera tidak aktif');
  }, [service]);

  const toggleCamera = useCallback(async () => {
    if (service.isActive()) {
      stopCamera();
      return;
    }

    await startCamera();
  }, [service, startCamera, stopCamera]);

  useEffect(() => () => {
    service.stopCamera();
  }, [service]);

  return {
    videoRef,
    canvasRef,
    cameraService: service,
    isCameraActive,
    cameraStatus,
    cameraError,
    facingMode,
    setFacingMode,
    startCamera,
    stopCamera,
    toggleCamera,
  };
}
