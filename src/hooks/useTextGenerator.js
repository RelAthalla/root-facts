import { useCallback, useMemo, useRef, useState } from 'react';
import { RootFactsService } from '../services/RootFactsService.js';
import { TEXT_GENERATION_CONFIG, TONE_CONFIG } from '../utils/config.js';
import { logError } from '../utils/common.js';

const rootFactsService = new RootFactsService();

function waitForNextPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

export function useTextGenerator() {
  const [persona, setPersona] = useState(TONE_CONFIG.defaultTone);
  const [textState, setTextState] = useState({
    status: 'Model teks belum dimuat',
    progress: 0,
    file: '',
    backend: 'belum dimuat',
    isReady: false,
    isGenerating: false,
    error: null,
  });
  const [funFact, setFunFact] = useState(null);
  const [lastGeneratedKey, setLastGeneratedKey] = useState('');
  const generationLockRef = useRef(false);

  const activePersona = useMemo(
    () => TONE_CONFIG.availableTones.find((item) => item.value === persona),
    [persona],
  );

  const generateFunFact = useCallback(async (vegetableName) => {
    if (!vegetableName || generationLockRef.current) {
      return;
    }

    generationLockRef.current = true;
    const generationKey = `${vegetableName}:${persona}`;
    setTextState((current) => ({
      ...current,
      isGenerating: true,
      error: null,
      status: rootFactsService.isReady() ? 'Membuat fun fact...' : 'Memuat model teks...',
    }));

    try {
      await waitForNextPaint();

      await rootFactsService.loadModel((update) => {
        setTextState((current) => ({
          ...current,
          status: update.status.includes('siap') ? update.status : 'Memuat model teks...',
          progress: Math.max(current.progress, Math.min(100, Math.max(0, update.progress))),
          file: update.status.includes('siap')
            ? update.file || current.file
            : TEXT_GENERATION_CONFIG.modelId,
          backend: rootFactsService.currentBackend,
        }));
      });

      setTextState((current) => ({
        ...current,
        isGenerating: true,
        status: 'Membuat fun fact...',
      }));
      await waitForNextPaint();

      const result = await rootFactsService.generateFacts(vegetableName, persona);
      setFunFact(result);
      setLastGeneratedKey(generationKey);
      setTextState((current) => ({
        ...current,
        status: 'Fun fact siap',
        progress: 100,
        backend: result.backend,
        isReady: true,
        isGenerating: false,
        error: null,
      }));
    } catch (error) {
      logError('Fun fact gagal dibuat', error);
      setTextState((current) => ({
        ...current,
        status: 'Fun fact gagal dibuat',
        isGenerating: false,
        error: error.message,
      }));
    } finally {
      generationLockRef.current = false;
    }
  }, [persona]);

  const resetFunFact = useCallback(() => {
    setFunFact(null);
    setLastGeneratedKey('');
    setTextState((current) => ({
      ...current,
      status: rootFactsService.isReady() ? 'Model teks siap' : 'Model teks belum dimuat',
      isGenerating: false,
      error: null,
    }));
  }, []);

  return {
    persona,
    setPersona,
    activePersona,
    textState,
    funFact,
    lastGeneratedKey,
    generateFunFact,
    resetFunFact,
  };
}
