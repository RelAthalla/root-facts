import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgpu';
import '@tensorflow/tfjs-backend-webgl';
import { APP_CONFIG } from '../utils/config.js';
import { isWebGPUSupported, validateModelMetadata } from '../utils/common.js';

let backendInitializationPromise = null;

export async function initializeTensorFlowBackend(onProgress) {
  if (backendInitializationPromise) {
    return backendInitializationPromise;
  }

  backendInitializationPromise = (async () => {
    onProgress?.({ status: 'Memuat backend TensorFlow.js...', progress: 10 });

    if (isWebGPUSupported()) {
      try {
        await tf.setBackend('webgpu');
        await tf.ready();
        return tf.getBackend();
      } catch (error) {
        console.warn('TensorFlow.js WebGPU gagal, fallback ke WebGL.', error);
      }
    }

    try {
      await tf.setBackend('webgl');
      await tf.ready();
      return tf.getBackend();
    } catch (error) {
      console.warn('TensorFlow.js WebGL gagal, fallback terakhir ke CPU.', error);
      await tf.setBackend('cpu');
      await tf.ready();
      return tf.getBackend();
    }
  })();

  return backendInitializationPromise;
}

export class DetectionService {
  constructor() {
    this.model = null;
    this.labels = [];
    this.inputSize = 224;
    this.backend = 'unknown';
    this.loadPromise = null;
  }

  async loadModel(onProgress) {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = (async () => {
      onProgress?.({ status: 'Menunggu Model...', progress: 5 });
      this.backend = await initializeTensorFlowBackend(onProgress);
      onProgress?.({
        status: `Backend TensorFlow aktif: ${this.backend}`,
        progress: 25,
      });

      const metadataRequest = fetch(APP_CONFIG.metadataUrl).then(async (response) => {
        if (!response.ok) {
          throw new Error(`Metadata gagal dimuat (${response.status}).`);
        }

        return response.json();
      });

      const modelRequest = tf.loadLayersModel(APP_CONFIG.modelUrl, {
        onProgress: (fraction) => {
          const progress = 25 + (fraction * 70);
          onProgress?.({ status: 'Memuat Model...', progress });
        },
      });

      const [metadata, model] = await Promise.all([metadataRequest, modelRequest]);

      if (!validateModelMetadata(metadata)) {
        throw new Error('Format metadata model tidak valid.');
      }

      this.model = model;
      this.labels = metadata.labels;
      this.inputSize = metadata.imageSize || model.inputs?.[0]?.shape?.[1] || 224;
      onProgress?.({ status: 'Model siap', progress: 100 });
      return this;
    })();

    return this.loadPromise;
  }

  async predict(imageElement) {
    if (!this.isLoaded()) {
      throw new Error('Model deteksi belum siap.');
    }

    const predictionTensor = tf.tidy(() => {
      const frame = tf.browser.fromPixels(imageElement);
      const resized = tf.image.resizeBilinear(frame, [this.inputSize, this.inputSize]);
      const normalized = resized.toFloat().div(255);
      const batched = normalized.expandDims(0);
      const output = this.model.predict(batched);
      return Array.isArray(output) ? output[0] : output;
    });

    try {
      const scores = Array.from(await predictionTensor.data());
      const best = scores.reduce(
        (currentBest, score, index) => (
          score > currentBest.score ? { score, index } : currentBest
        ),
        { score: 0, index: -1 },
      );
      const className = this.labels[best.index] || 'Tidak dikenal';

      return {
        className,
        index: best.index,
        score: best.score,
        confidence: Math.round(best.score * 100),
        isValid: best.score >= APP_CONFIG.detectionConfidenceThreshold,
        backend: this.backend,
        timestamp: Date.now(),
      };
    } finally {
      predictionTensor.dispose();
    }
  }

  isLoaded() {
    return Boolean(this.model && this.labels.length > 0);
  }
}
