import build from 'pino-abstract-transport';
export interface PinoLogsApiTransportOptions {
    logsApiUrl: string;
    serviceName: string;
}
export default function (opts: PinoLogsApiTransportOptions): import("node:stream").Transform & build.OnUnknown;
//# sourceMappingURL=pino-logs-api-transport.d.ts.map