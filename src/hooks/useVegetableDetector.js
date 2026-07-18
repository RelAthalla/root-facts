import { useCallback, useEffect, useRef, useState } from 'react';
import { DetectionService } from '../services/DetectionService.js';
import { APP_CONFIG, isValidDetection } from '../utils/config.js';
import { logError } from '../utils/common.js';

const detectorService = new DetectionService();

function createInitialProgress() {
  return {
    status: 'Menunggu Model...',
    progress: 0,
    backend: 'unknown',
    isReady: false,
  };
}

export function useVegetableDetector({ videoRef, cameraService, isCameraActive, fpsLimit }) {
  const [modelState, setModelState] = useState(createInitialProgress);
  const [detectionResult, setDetectionResult] = useState(null);
  const [stableLabel, setStableLabel] = useState(null);
  const [stableCount, setStableCount] = useState(0);
  const [predictionCount, setPredictionCount] = useState(0);
  const [scanStartedAt, setScanStartedAt] = useState(null);
  const [detectionError, setDetectionError] = useState(null);
  const animationFrameRef = useRef(null);
  const lastPredictionTimeRef = useRef(0);
  const isPredictingRef = useRef(false);
  const isLoopActiveRef = useRef(false);
  const predictionWindowRef = useRef([]);

  useEffect(() => {
    let isMounted = true;

    detectorService
      .loadModel((update) => {
        if (!isMounted) {
          return;
        }

        setModelState((current) => ({
          ...current,
          status: update.status,
          progress: Math.min(100, Math.max(0, update.progress)),
        }));
      })
      .then(() => {
        if (!isMounted) {
          return;
        }

        setModelState({
          status: 'Model siap',
          progress: 100,
          backend: detectorService.backend,
          isReady: true,
        });
      })
      .catch((error) => {
        logError('Model deteksi gagal dimuat', error);
        if (isMounted) {
          setDetectionError(error.message);
          setModelState((current) => ({
            ...current,
            status: 'Model gagal dimuat',
            isReady: false,
          }));
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateStableLabel = useCallback((result) => {
    if (!isValidDetection(result)) {
      setStableCount((count) => Math.max(0, count - 1));
      setStableLabel(null);
      return;
    }

    predictionWindowRef.current = [
      ...predictionWindowRef.current,
      { className: result.className, score: result.score },
    ].slice(-APP_CONFIG.predictionWindowSize);

    const votes = predictionWindowRef.current.reduce((summary, item) => {
      const current = summary.get(item.className) || { count: 0, totalScore: 0 };
      summary.set(item.className, {
        count: current.count + 1,
        totalScore: current.totalScore + item.score,
      });
      return summary;
    }, new Map());
    const [bestLabel, bestVote] = [...votes.entries()].sort((first, second) => {
      if (second[1].count !== first[1].count) {
        return second[1].count - first[1].count;
      }

      return second[1].totalScore - first[1].totalScore;
    })[0] || [];
    const averageScore = bestVote ? bestVote.totalScore / bestVote.count : 0;
    const isStable = (
      bestLabel
      && bestVote.count >= APP_CONFIG.stablePredictionTarget
      && averageScore >= APP_CONFIG.detectionConfidenceThreshold
    );

    setStableCount(bestVote?.count || 0);
    setStableLabel(isStable ? bestLabel : null);
  }, []);

  useEffect(() => {
    if (!isCameraActive || !modelState.isReady) {
      isLoopActiveRef.current = false;
      setDetectionResult(null);
      setStableLabel(null);
      setStableCount(0);
      setPredictionCount(0);
      setScanStartedAt(null);
      predictionWindowRef.current = [];

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      return undefined;
    }

    isLoopActiveRef.current = true;
    setScanStartedAt(Date.now());
    const frameDuration = 1000 / Number(fpsLimit || APP_CONFIG.defaultFpsLimit);

    const loop = async (timestamp) => {
      if (!isLoopActiveRef.current) {
        return;
      }

      const video = videoRef.current;
      const canPredict = (
        video
        && cameraService.isReady()
        && !isPredictingRef.current
        && timestamp - lastPredictionTimeRef.current >= frameDuration
      );

      if (canPredict) {
        isPredictingRef.current = true;
        lastPredictionTimeRef.current = timestamp;

        try {
          const result = await detectorService.predict(video);
          setDetectionResult(result);
          setPredictionCount((count) => count + 1);
          updateStableLabel(result);
          setDetectionError(null);
        } catch (error) {
          logError('Prediksi gagal', error);
          setDetectionError(error.message);
        } finally {
          isPredictingRef.current = false;
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      isLoopActiveRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    cameraService,
    fpsLimit,
    isCameraActive,
    modelState.isReady,
    updateStableLabel,
    videoRef,
  ]);

  return {
    detectorService,
    modelState,
    detectionResult,
    stableLabel,
    stableCount,
    predictionCount,
    scanStartedAt,
    stableTarget: APP_CONFIG.stablePredictionTarget,
    detectionError,
  };
}
