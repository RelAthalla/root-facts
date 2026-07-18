import { useCallback, useMemo, useState } from 'react';
import { RootFactsService } from '../services/RootFactsService.js';
import { TONE_CONFIG } from '../utils/config.js';
import { logError } from '../utils/common.js';

const rootFactsService = new RootFactsService();

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

  const activePersona = useMemo(
    () => TONE_CONFIG.availableTones.find((item) => item.value === persona),
    [persona],
  );

  const generateFunFact = useCallback(async (vegetableName) => {
    if (!vegetableName || textState.isGenerating) {
      return;
    }

    const generationKey = `${vegetableName}:${persona}`;
    setTextState((current) => ({
      ...current,
      isGenerating: true,
      error: null,
      status: rootFactsService.isReady() ? 'Membuat fun fact...' : 'Memuat model teks...',
    }));

    try {
      await rootFactsService.loadModel((update) => {
        setTextState((current) => ({
          ...current,
          status: update.status,
          progress: Math.min(100, Math.max(0, update.progress)),
          file: update.file || current.file,
          backend: rootFactsService.currentBackend,
        }));
      });

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
      }));
    } catch (error) {
      logError('Fun fact gagal dibuat', error);
      setTextState((current) => ({
        ...current,
        status: 'Fun fact gagal dibuat',
        isGenerating: false,
        error: error.message,
      }));
    }
  }, [persona, textState.isGenerating]);

  return {
    persona,
    setPersona,
    activePersona,
    textState,
    funFact,
    lastGeneratedKey,
    generateFunFact,
  };
}
