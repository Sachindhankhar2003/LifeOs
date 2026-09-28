/**
 * Simple structured JSON logger for production metrics tracking.
 * Redacts sensitive fields, strips out user-specific conversation context naturally.
 */

type LogLevel = 'info' | 'warn' | 'error';

interface LogPayload {
    event: string;
    userId?: string;
    latencyMs?: number;
    provider?: string;
    errorMessage?: string;
    [key: string]: any;
}

export const logger = {
    _log: (level: LogLevel, payload: LogPayload) => {
        // Redact any mistakenly provided keys
        const safePayload = { ...payload };
        
        // Remove PII or raw secrets if accidentally attached
        delete safePayload.prompt;
        delete safePayload.password;
        delete safePayload.token;
        
        const output = {
            timestamp: new Date().toISOString(),
            level,
            ...safePayload
        };

        if (process.env.NODE_ENV === 'production') {
            // In production, write structured NDJSON for log aggregators (e.g. Axiom or Datadog)
            console[level](JSON.stringify(output));
        } else {
            // Local dev fallback
            console[level](`[${level.toUpperCase()}] ${output.event}`, output);
        }
    },
    
    info: (payload: LogPayload) => logger._log('info', payload),
    warn: (payload: LogPayload) => logger._log('warn', payload),
    error: (payload: LogPayload) => logger._log('error', payload)
};
