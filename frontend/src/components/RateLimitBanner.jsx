import { useState, useEffect } from 'react';
import api from '../services/api';

const RETRY_AT_KEY = 'ratelimit_retryAt';

function readPersistedRetryAt() {
  try {
    const stored = localStorage.getItem(RETRY_AT_KEY);
    if (!stored) return null;
    const retryAt = Number(stored);
    if (Number.isNaN(retryAt)) return null;
    const secondsLeft = Math.max(0, Math.ceil((retryAt - Date.now()) / 1000));
    return secondsLeft > 0 ? retryAt : null;
  } catch {
    return null;
  }
}

function persistRetryAt(retryAt) {
  try {
    localStorage.setItem(RETRY_AT_KEY, String(retryAt));
  } catch {
    // ignore
  }
}

function clearPersistedRetryAt() {
  try {
    localStorage.removeItem(RETRY_AT_KEY);
  } catch {
    // ignore
  }
}

export function getRetryStatus() {
  const retryAt = api.defaults.retryAt || readPersistedRetryAt() || null;
  if (!retryAt) return { blocked: false, secondsLeft: 0 };
  const secondsLeft = Math.max(0, Math.ceil((retryAt - Date.now()) / 1000));
  return { blocked: secondsLeft > 0, secondsLeft };
}

export function clearRetryStatus() {
  delete api.defaults.retryAt;
  delete api.defaults.retryAfter;
  clearPersistedRetryAt();
}

export default function RateLimitBanner() {
  const [status, setStatus] = useState(getRetryStatus);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = getRetryStatus();
      setStatus(next);
      if (!next.blocked) clearPersistedRetryAt();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!status.blocked) return null;

  const minutes = Math.floor(status.secondsLeft / 60);
  const seconds = status.secondsLeft % 60;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(245, 247, 250, 0.95)',
      color: '#1f2937',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '40px',
        maxWidth: '520px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h2 style={{ margin: '0 0 12px', color: '#1f2937', fontSize: '24px' }}>Too many requests</h2>
        <p style={{ margin: '0 0 24px', fontSize: '16px', lineHeight: 1.5, color: '#4b5563' }}>
          Please wait <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{minutes}m {seconds.toString().padStart(2, '0')}s</span> before trying again.
        </p>
        <div style={{
          backgroundColor: '#f3f4f6',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          padding: '12px',
          fontWeight: 'bold',
          fontSize: '14px',
          color: '#1f2937'
        }}>
          You have exceeded the rate limit of 20 requests per 2 minutes.
        </div>
      </div>
    </div>
  );
}
