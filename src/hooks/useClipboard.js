import { useCallback, useState } from 'react';
import { logError } from '../utils/common.js';

export function useClipboard() {
  const [copyStatus, setCopyStatus] = useState('idle');

  const copyText = useCallback(async (text) => {
    if (!text) {
      return;
    }

    if (!navigator.clipboard?.writeText) {
      setCopyStatus('unsupported');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('copied');
      window.setTimeout(() => setCopyStatus('idle'), 1800);
    } catch (error) {
      logError('Clipboard gagal', error);
      setCopyStatus('error');
    }
  }, []);

  return { copyStatus, copyText };
}
