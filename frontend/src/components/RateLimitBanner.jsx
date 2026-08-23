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
      top: 0,
      left: 0,
      right: 0,
      background: '#dc2626',
      color: '#fff',
      padding: '0.75rem 1rem',
      textAlign: 'center',
      zIndex: 2000,
      fontWeight: 600
    }}>
      Too many requests. Please wait {minutes}:{seconds.toString().padStart(2, '0')} before trying again.
    </div>
  );
}
