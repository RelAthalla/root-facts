export const APP_CONFIG = {
  detectionConfidenceThreshold: 0.6,
  stablePredictionTarget: 4,
  predictionWindowSize: 16,
  minimumScanDurationMs: 3000,
  minimumPredictionCountBeforeLock: 8,
  defaultFpsLimit: 10,
  fpsOptions: [5, 10, 15],
  modelUrl: '/model/model.json',
  metadataUrl: '/model/metadata.json',
  modelAssetUrls: [
    '/model/model.json',
    '/model/weights.bin',
    '/model/metadata.json',
  ],
};

export const TONE_CONFIG = {
  availableTones: [
    {
      value: 'funny',
      label: 'Lucu',
      instruction: 'Write in a playful and humorous style without inventing impossible claims.',
    },
    {
      value: 'history',
      label: 'Sejarah',
      instruction: 'Focus on historical origin, traditional use, or cultural context.',
    },
    {
      value: 'science',
      label: 'Ilmiah',
      instruction: 'Focus on an easy-to-understand scientific or nutrition-related fact.',
    },
    {
      value: 'kids',
      label: 'Anak-anak',
      instruction: 'Use simple, cheerful language suitable for children.',
    },
  ],
  defaultTone: 'funny',
};

export const TEXT_GENERATION_CONFIG = {
  modelId: 'Xenova/LaMini-Flan-T5-77M',
  task: 'text2text-generation',
  max_new_tokens: 55,
  temperature: 0.4,
  top_p: 0.85,
  do_sample: false,
};

export const isValidDetection = (result) => {
  const { detectionConfidenceThreshold } = APP_CONFIG;
  return result && result.isValid && result.score >= detectionConfidenceThreshold;
};
