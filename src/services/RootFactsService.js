import { TEXT_GENERATION_CONFIG, TONE_CONFIG } from '../utils/config.js';
import { isWebGPUSupported } from '../utils/common.js';

function getProgressPercentage(event) {
  if (typeof event?.progress === 'number') {
    return event.progress;
  }

  if (typeof event?.loaded === 'number' && typeof event?.total === 'number' && event.total > 0) {
    return (event.loaded / event.total) * 100;
  }

  return null;
}

function normalizeGeneratedText(output, prompt) {
  const firstResult = Array.isArray(output) ? output[0] : output;
  const rawText = firstResult?.generated_text || firstResult?.summary_text || String(firstResult || '');
  let text = rawText.replace(prompt, '').trim();

  text = text
    .replace(/^Fun fact:\s*/i, '')
    .replace(/^Answer:\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) {
    return 'Fun fact belum berhasil dibentuk. Coba generate ulang dengan label yang lebih stabil.';
  }

  const sentences = text.match(/[^.!?]+[.!?]+/g);
  const conciseText = sentences?.slice(0, 2).join(' ') || text;
  return conciseText.slice(0, 420);
}

export class RootFactsService {
  constructor() {
    this.generator = null;
    this.isModelLoaded = false;
    this.isGenerating = false;
    this.loadPromise = null;
    this.currentBackend = 'belum dimuat';
    this.currentTone = TONE_CONFIG.defaultTone;
  }

  async loadModel(onProgress) {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = (async () => {
      const { env, pipeline } = await import('@huggingface/transformers');

      env.useBrowserCache = true;
      env.allowRemoteModels = true;
      onProgress?.({
        status: 'Menunggu model teks...',
        progress: 5,
        file: TEXT_GENERATION_CONFIG.modelId,
      });

      const progressCallback = (event) => {
        const percentage = getProgressPercentage(event);
        onProgress?.({
          status: event?.status || 'Memuat model teks...',
          progress: percentage ?? 15,
          file: event?.file || event?.name || TEXT_GENERATION_CONFIG.modelId,
        });
      };

      const createPipeline = async (options) => pipeline(
        TEXT_GENERATION_CONFIG.task,
        TEXT_GENERATION_CONFIG.modelId,
        {
          ...options,
          progress_callback: progressCallback,
        },
      );

      if (isWebGPUSupported()) {
        try {
          this.generator = await createPipeline({ device: 'webgpu', dtype: 'q8' });
          this.currentBackend = 'webgpu';
        } catch (error) {
          console.warn('Transformers.js WebGPU gagal, fallback ke runtime default/WASM.', error);
        }
      }

      if (!this.generator) {
        this.generator = await createPipeline({ dtype: 'q8' });
        this.currentBackend = 'wasm/default';
      }

      this.isModelLoaded = true;
      onProgress?.({
        status: 'Model teks siap',
        progress: 100,
        file: TEXT_GENERATION_CONFIG.modelId,
      });

      return this;
    })();

    return this.loadPromise;
  }

  setTone(tone) {
    const toneExists = TONE_CONFIG.availableTones.some((item) => item.value === tone);
    this.currentTone = toneExists ? tone : TONE_CONFIG.defaultTone;
  }

  buildPrompt(vegetableName) {
    const persona = TONE_CONFIG.availableTones.find((item) => item.value === this.currentTone);
    const personaInstruction = persona?.instruction || TONE_CONFIG.availableTones[0].instruction;

    return [
      'You are a friendly educational assistant.',
      `The detected vegetable is: ${vegetableName}.`,
      'Write one short, interesting, relevant, and factual fun fact about this vegetable.',
      personaInstruction,
      'Keep the answer concise and do not repeat these instructions.',
    ].join(' ');
  }

  async generateFacts(vegetableName, tone = this.currentTone) {
    if (!vegetableName) {
      throw new Error('Label sayuran belum tersedia.');
    }

    if (this.isGenerating) {
      throw new Error('Generasi fakta masih berjalan.');
    }

    if (!this.isReady()) {
      await this.loadModel();
    }

    this.setTone(tone);
    this.isGenerating = true;
    const prompt = this.buildPrompt(vegetableName);

    try {
      const output = await this.generator(prompt, {
        max_new_tokens: TEXT_GENERATION_CONFIG.max_new_tokens,
        temperature: TEXT_GENERATION_CONFIG.temperature,
        top_p: TEXT_GENERATION_CONFIG.top_p,
        do_sample: TEXT_GENERATION_CONFIG.do_sample,
      });

      return {
        text: normalizeGeneratedText(output, prompt),
        prompt,
        vegetableName,
        tone: this.currentTone,
        backend: this.currentBackend,
      };
    } finally {
      this.isGenerating = false;
    }
  }

  isReady() {
    return Boolean(this.generator && this.isModelLoaded);
  }
}
