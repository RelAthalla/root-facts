import { registerSW } from 'virtual:pwa-register';

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.info('Service worker tidak didukung browser ini.');
    return;
  }

  const updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh() {
      updateServiceWorker(true);
    },
    onOfflineReady() {
      console.info('Root Fact App siap dipakai offline setelah cache terisi.');
    },
    onRegisterError(error) {
      console.error('[Root Fact App] Registrasi service worker gagal:', error);
    },
  });
}
