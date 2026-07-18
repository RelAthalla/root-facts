import { TEXT_GENERATION_CONFIG, TONE_CONFIG } from '../utils/config.js';

function getProgressPercentage(event) {
  if (typeof event?.progress === 'number') {
    return event.progress;
  }

  if (typeof event?.loaded === 'number' && typeof event?.total === 'number' && event.total > 0) {
    return (event.loaded / event.total) * 100;
  }

  return null;
}

function getRawGeneratedText(output, prompt) {
  const firstResult = Array.isArray(output) ? output[0] : output;

  if (Array.isArray(firstResult?.generated_text)) {
    const assistantMessage = [...firstResult.generated_text]
      .reverse()
      .find((message) => message.role === 'assistant');
    return assistantMessage?.content || '';
  }

  return firstResult?.generated_text || firstResult?.summary_text || String(firstResult || '');
}

function normalizeGeneratedText(output, prompt) {
  const rawText = getRawGeneratedText(output, prompt);
  const promptText = typeof prompt === 'string'
    ? prompt
    : prompt.map((message) => message.content).join(' ');
  let text = rawText.replace(promptText, '').trim();

  text = text
    .replace(/^Fun fact:\s*/i, '')
    .replace(/^Answer:\s*/i, '')
    .replace(/^Assistant:\s*/i, '')
    .replace(/<\|.*?\|>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text || /do not repeat|answer with exactly|question:|task:|use a simple|write in a playful/i.test(text)) {
    return 'Fun fact belum berhasil dibentuk. Coba generate ulang dengan label yang lebih stabil.';
  }

  const sentences = text.match(/[^.!?]+[.!?]+/g);
  const conciseText = sentences?.slice(0, 2).join(' ') || text;
  return conciseText.slice(0, 420);
}

function isReadableGeneratedText(text) {
  if (!text || text.length < 24) {
    return false;
  }

  const letters = text.match(/[a-z]/gi)?.length || 0;
  const spaces = text.match(/\s/g)?.length || 0;
  const repeatedChunk = /(.{4,18})\1{2,}/i.test(text.replace(/\s+/g, ''));
  const longSingleToken = text.split(/\s+/).some((token) => token.length > 34);
  const unsafeForKids = /\bsexy\b|\bpassion\b|\bcancer prevention\b/i.test(text);
  const obviousWrongFact = /\bcontains seeds and nuts\b|\bgreek word\b|\bseriously\b/i.test(text);

  return (
    letters >= 18
    && spaces >= 3
    && !repeatedChunk
    && !longSingleToken
    && !unsafeForKids
    && !obviousWrongFact
  );
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

      this.generator = await createPipeline({ dtype: 'q4' });
      this.currentBackend = 'wasm/default';

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
      `Vegetable: ${vegetableName}.`,
      'Write one short, factual, family-friendly fun fact about this vegetable.',
      personaInstruction,
      'Output only one natural sentence.',
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
      const generationOptions = {
        max_new_tokens: TEXT_GENERATION_CONFIG.max_new_tokens,
        temperature: TEXT_GENERATION_CONFIG.temperature,
        top_p: TEXT_GENERATION_CONFIG.top_p,
        do_sample: TEXT_GENERATION_CONFIG.do_sample,
        repetition_penalty: 1.25,
        no_repeat_ngram_size: 3,
      };
      let output = await this.generator(prompt, generationOptions);
      let text = normalizeGeneratedText(output, prompt);

      if (!isReadableGeneratedText(text)) {
        const retryPrompt = `Give one accurate, short fun fact about ${vegetableName}.`;

        output = await this.generator(retryPrompt, {
          ...generationOptions,
          max_new_tokens: 40,
          do_sample: false,
        });
        text = normalizeGeneratedText(output, retryPrompt);
      }

      if (!isReadableGeneratedText(text)) {
        throw new Error('Model teks belum menghasilkan fun fact yang valid. Coba regenerate.');
      }

      return {
        text,
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
