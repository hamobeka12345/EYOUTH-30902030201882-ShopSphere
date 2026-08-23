import { useState, useEffect } from 'react';
import api from '../services/api';

export function getRetryStatus() {
  const retryAt = api.defaults.retryAt || null;
  if (!retryAt) return { blocked: false, secondsLeft: 0 };
  const secondsLeft = Math.max(0, Math.ceil((retryAt - Date.now()) / 1000));
  return { blocked: secondsLeft > 0, secondsLeft };
}

export function clearRetryStatus() {
  delete api.defaults.retryAt;
  delete api.defaults.retryAfter;
}

export default function RateLimitBanner() {
  const [status, setStatus] = useState(getRetryStatus());

  useEffect(() => {
    api.post('/auth/login', { email: 'ratecheck@test.com', password: 'ratecheck' }).catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = getRetryStatus();
      setStatus(next);
      if (!next.blocked) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!status.blocked) return null;

  const minutes = Math.floor(status.secondsLeft / 60);
  const seconds = status.secondsLeft % 60;

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 2000,
      maxWidth: '90%',
      width: 'auto'
    }}>
      <div style={{
        background: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb',
        padding: '12px',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          ⚠️ Too many requests
        </div>
        <div>
          Please wait <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{minutes}m {seconds.toString().padStart(2, '0')}s</span> before trying again.
        </div>
      </div>
    </div>
  );
}
