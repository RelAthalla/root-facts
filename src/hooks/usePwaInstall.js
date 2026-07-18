import { useCallback, useEffect, useState } from 'react';

export function usePwaInstall() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(
    () => window.matchMedia?.('(display-mode: standalone)').matches || navigator.standalone,
  );
  const [installStatus, setInstallStatus] = useState('Menunggu dukungan install');

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
      setInstallStatus('Aplikasi siap diinstal');
    };

    const handleInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
      setInstallStatus('Aplikasi sudah terpasang');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const installApp = useCallback(async () => {
    if (!installPrompt) {
      setInstallStatus('Install prompt belum tersedia di browser ini');
      return;
    }

    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    setInstallPrompt(null);
    setInstallStatus(
      result.outcome === 'accepted' ? 'Install diterima' : 'Install dibatalkan',
    );
  }, [installPrompt]);

  return {
    canInstall: Boolean(installPrompt) && !isInstalled,
    isInstalled,
    installStatus,
    installApp,
  };
}
