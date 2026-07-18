import { getCameraErrorMessage } from '../utils/common.js';

export class CameraService {
  constructor() {
    this.stream = null;
    this.video = null;
    this.canvas = null;
    this.fps = 10;
    this.devices = [];
  }

  setVideoElement(videoElement) {
    this.video = videoElement;
  }

  setCanvasElement(canvasElement) {
    this.canvas = canvasElement;
  }

  async loadCameras() {
    if (!navigator.mediaDevices?.enumerateDevices) {
      return [];
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    this.devices = devices.filter((device) => device.kind === 'videoinput');
    return this.devices;
  }

  async startCamera(selectedCamera = 'environment') {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Browser ini belum mendukung akses kamera.');
    }

    if (!this.video) {
      throw new Error('Elemen video belum siap.');
    }

    this.stopCamera();

    const facingMode = selectedCamera === 'front' ? 'user' : 'environment';
    const constraints = {
      audio: false,
      video: {
        facingMode: { ideal: facingMode },
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
    };

    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.video.srcObject = this.stream;
      await this.video.play();
      await this.loadCameras();
      return this.stream;
    } catch (error) {
      this.stopCamera();
      throw new Error(getCameraErrorMessage(error));
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.video) {
      this.video.pause();
      this.video.srcObject = null;
    }
  }

  setFPS(fps) {
    this.fps = Number(fps);
  }

  isActive() {
    return Boolean(this.stream?.active);
  }

  isReady() {
    return Boolean(
      this.video
      && this.video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
      && this.video.videoWidth > 0
      && this.video.videoHeight > 0,
    );
  }
}
