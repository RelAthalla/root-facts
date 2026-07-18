export const logError = (context, error) => {
  console.error(`[Root Fact App] ${context}:`, error);
};

export const isWebGPUSupported = () => 'navigator' in globalThis && 'gpu' in navigator;

export const isMobileDevice = () => (
  navigator.userAgentData?.mobile ?? /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
);

export const createDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const validateModelMetadata = (metadata) => (
  metadata && metadata.labels && Array.isArray(metadata.labels)
);

export const getCameraErrorMessage = (error) => {
  const errorMessages = {
    NotAllowedError: 'Izin kamera ditolak. Harap izinkan akses kamera dari browser.',
    NotFoundError: 'Tidak ada kamera yang ditemukan pada perangkat ini.',
    NotReadableError: 'Kamera sedang digunakan oleh aplikasi lain.',
    OverconstrainedError: 'Kamera tidak cocok dengan pengaturan yang dipilih.',
    SecurityError: 'Akses kamera hanya tersedia pada HTTPS atau localhost.',
  };

  return errorMessages[error?.name] || 'Gagal memulai kamera. Periksa izin dan perangkat kamera.';
};

export const formatProgress = (value) => `${Math.round(value)}%`;
