"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const pino_abstract_transport_1 = __importDefault(require("pino-abstract-transport"));
const axios_1 = __importDefault(require("axios"));
const PINO_LEVELS = {
    10: 'debug',
    20: 'debug',
    30: 'info',
    40: 'warning',
    50: 'error',
    60: 'error',
};
function mapLevel(pinoLevel) {
    return PINO_LEVELS[pinoLevel] || 'info';
}
function default_1(opts) {
    return (0, pino_abstract_transport_1.default)(async function (source) {
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
            axios_1.default.post(`${opts.logsApiUrl}/api/logs/ingest`, payload).catch(() => { });
        }
    });
}
//# sourceMappingURL=pino-logs-api-transport.js.map