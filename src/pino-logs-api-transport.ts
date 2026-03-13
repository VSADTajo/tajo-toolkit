import build from 'pino-abstract-transport';
import axios from 'axios';

const PINO_LEVELS: Record<number, string> = {
  10: 'debug',
  20: 'debug',
  30: 'info',
  40: 'warning',
  50: 'error',
  60: 'error',
};

function mapLevel(pinoLevel: number): string {
  return PINO_LEVELS[pinoLevel] || 'info';
}

export interface PinoLogsApiTransportOptions {
  logsApiUrl: string;
  serviceName: string;
}

export default function (opts: PinoLogsApiTransportOptions) {
  return build(async function (source) {
    for await (const obj of source) {
      const level = mapLevel(obj.level);
      const message = obj.msg || obj.message || '';
      const reqId = obj.req?.id || obj.reqId || null;

      // Skip health endpoint logs
      const reqUrl = obj.req?.url || '';
      if (reqUrl === '/health' || reqUrl === '/api/health') {
        continue;
      }

      const payload = {
        level,
        entity: opts.serviceName,
        message: message || `[${obj.req?.method || 'LOG'}] ${reqUrl || 'system'} ${obj.res?.statusCode || ''}`.trim(),
        source: opts.serviceName,
        correlationId: reqId,
        meta: {
          pinoLevel: obj.level,
          ...(obj.req ? { method: obj.req.method, path: obj.req.url } : {}),
          ...(obj.res ? { statusCode: obj.res.statusCode } : {}),
          ...(obj.responseTime ? { duration: obj.responseTime } : {}),
          ...(obj.err ? { error: obj.err.message, stack: obj.err.stack } : {}),
        },
      };

      axios.post(`${opts.logsApiUrl}/api/logs/ingest`, payload).catch(() => {});
    }
  });
}
