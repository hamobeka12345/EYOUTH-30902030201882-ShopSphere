const util = require('util');

const LEVELS = {
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR',
  debug: 'DEBUG'
};

function formatMessage(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const base = { timestamp, level: LEVELS[level] || level.toUpperCase(), message };
  return JSON.stringify({ ...base, ...meta });
}

function logRequest(req) {
  return {
    method: req.method,
    path: req.originalUrl || req.url,
    userAgent: req.get('user-agent'),
    ip: req.ip || req.connection.remoteAddress
  };
}

function createLogger() {
  return {
    info: (message, meta = {}) => console.log(formatMessage('info', message, meta)),
    warn: (message, meta = {}) => console.warn(formatMessage('warn', message, meta)),
    error: (message, meta = {}) => console.error(formatMessage('error', message, meta)),
    debug: (message, meta = {}) => console.debug(formatMessage('debug', message, meta)),
    http: (req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
        logger[level](`${req.method} ${req.originalUrl || req.url} ${res.statusCode}`, {
          ...logRequest(req),
          statusCode: res.statusCode,
          durationMs: duration
        });
      });
      next();
    },
    request: (req) => formatMessage('info', 'request_received', logRequest(req)),
    error: (err, req) => formatMessage('error', err.message || 'Internal server error', {
      ...logRequest(req),
      stack: err.stack
    })
  };
}

const logger = createLogger();

module.exports = logger;
