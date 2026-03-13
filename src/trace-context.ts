import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class TraceContext {
  constructor(private readonly cls: ClsService) {}

  get traceId(): string | null {
    return this.cls.get('traceId') ?? null;
  }

  set traceId(value: string) {
    this.cls.set('traceId', value);
  }

  get userId(): string | null {
    return this.cls.get('userId') ?? null;
  }

  set userId(value: string | null) {
    this.cls.set('userId', value ?? null);
  }

  get serviceName(): string {
    return this.cls.get('serviceName') ?? '';
  }

  set serviceName(value: string) {
    this.cls.set('serviceName', value);
  }

  get startTime(): number {
    return this.cls.get('startTime') ?? Date.now();
  }

  set startTime(value: number) {
    this.cls.set('startTime', value);
  }

  get logsApiUrl(): string {
    return this.cls.get('logsApiUrl') ?? '';
  }

  set logsApiUrl(value: string) {
    this.cls.set('logsApiUrl', value);
  }
}
