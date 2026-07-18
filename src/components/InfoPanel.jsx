import {
  CheckCircle,
  ClipboardCheck,
  ClipboardCopy,
  History,
  Lightbulb,
  LoaderCircle,
  Sparkles,
} from 'lucide-react';
import { TONE_CONFIG } from '../utils/config.js';

function InfoPanel({
  detectionResult,
  stableLabel,
  stableCount,
  predictionCount,
  stableTarget,
  isLocked,
  persona,
  activePersona,
  onPersonaChange,
  textState,
  funFact,
  needsRegenerate,
  onGenerate,
  onScanAgain,
  onCopyFact,
  copyStatus,
  canGenerate,
  error,
}) {
  const confidence = detectionResult?.confidence ?? 0;
  const detectionName = detectionResult?.isValid ? detectionResult.className : 'Belum ada objek stabil';
  const hasFact = Boolean(funFact?.text);
  const copyText = copyStatus === 'copied' ? 'Tersalin' : 'Salin';

  return (
    <section className="results-section" aria-live="polite">
      <div className="result-card result-main">
        <div className="detected-badge">
          {stableLabel ? <CheckCircle size={14} /> : <Sparkles size={14} />}
          <span id="detected-name">{stableLabel || detectionName}</span>
        </div>

        <div className="confidence-bar">
          <span className="confidence-label">Confidence</span>
          <div className="confidence-track">
            <div
              id="confidence-fill"
              className="confidence-fill"
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
          <span id="detected-confidence" className="confidence-value">{confidence}%</span>
        </div>

        <div className="debug-grid">
          <span>Status label</span>
          <strong>{isLocked ? 'Terkunci' : stableLabel || `${stableCount}/${stableTarget}`}</strong>
          <span>Observasi</span>
          <strong>{isLocked ? 'Selesai' : `${predictionCount} frame`}</strong>
          <span>Persona aktif</span>
          <strong>{activePersona?.label}</strong>
        </div>

        <div className="persona-panel">
          <label htmlFor="tone-select">Persona fun fact</label>
          <select
            id="tone-select"
            value={persona}
            onChange={(event) => onPersonaChange(event.target.value)}
          >
            {TONE_CONFIG.availableTones.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className="primary-btn"
          onClick={onGenerate}
          disabled={!canGenerate}
        >
          {textState.isGenerating ? <LoaderCircle className="spin-icon" size={16} /> : <Lightbulb size={16} />}
          <span>{hasFact || needsRegenerate ? 'Regenerate Fun Fact' : 'Generate Fun Fact'}</span>
        </button>

        {isLocked && (
          <button className="secondary-btn" onClick={onScanAgain}>
            <Sparkles size={16} />
            <span>Scan sayuran lain</span>
          </button>
        )}

        <div className="fun-fact-card">
          <div className="fun-fact-header">
            <div className="fun-fact-icon">
              <Lightbulb size={22} />
            </div>
            <div>
              <h2>Si Otak</h2>
              <p>{textState.status}</p>
            </div>
          </div>

          <div className="progress-line">
            <div style={{ width: `${Math.round(textState.progress)}%` }}></div>
          </div>

          <div className="debug-grid compact">
            <span>Model teks</span>
            <strong>{Math.round(textState.progress)}%</strong>
            <span>Device</span>
            <strong>{textState.backend}</strong>
          </div>

          {textState.file && <p className="small-muted">File: {textState.file}</p>}

          <div id="fun-fact-text" className="fun-fact-text">
            {textState.isGenerating && !hasFact && (
              <span className="loading-copy">Memuat atau membuat fakta menarik...</span>
            )}
            {!textState.isGenerating && !hasFact && (
              <span className="loading-copy">
                {isLocked
                  ? 'Label sudah terkunci. Tekan Generate Fun Fact untuk membuat fakta.'
                  : 'Tunggu label stabil, lalu kamera akan mengunci hasil scan.'}
              </span>
            )}
            {hasFact && (
              <>
                {needsRegenerate && (
                  <span className="warning-copy">
                    Persona atau label berubah. Tekan regenerate untuk memperbarui.
                  </span>
                )}
                <span>{funFact.text}</span>
              </>
            )}
          </div>

          <button
            id="btn-copy"
            className={`copy-btn ${copyStatus === 'copied' ? 'copied' : ''}`}
            onClick={onCopyFact}
            disabled={!hasFact}
            title="Salin fakta"
          >
            {copyStatus === 'copied' ? <ClipboardCheck size={16} /> : <ClipboardCopy size={16} />}
            <span>{copyText}</span>
          </button>

          {copyStatus === 'unsupported' && (
            <p className="inline-error">Clipboard tidak tersedia di browser ini.</p>
          )}

          {copyStatus === 'error' && (
            <p className="inline-error">Gagal menyalin. Periksa izin clipboard browser.</p>
          )}
        </div>

        <div className="privacy-note">
          <History size={14} />
          <span>Deteksi berjalan lokal. Fun fact memakai model Transformers.js di browser.</span>
        </div>

        {error && <p className="inline-error">{error}</p>}
      </div>
    </section>
  );
}

export default InfoPanel;
