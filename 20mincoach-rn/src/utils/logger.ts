// src/utils/logger.ts

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogProvider {
  log(level: LogLevel, message: string, ctx?: unknown): void;
}

export class ConsoleProvider implements LogProvider {
  log(level: LogLevel, message: string, ctx?: unknown) {
    const tag = `[${level}] ${message}`;
    // eslint-disable-next-line no-console
    if (level === 'info') ctx ? console.log(tag, ctx) : console.log(tag);
    // eslint-disable-next-line no-console
    else if (level === 'warn') ctx ? console.warn(tag, ctx) : console.warn(tag);
    // eslint-disable-next-line no-console
    else ctx ? console.error(tag, ctx) : console.error(tag);
  }
}

export class MemoryProvider implements LogProvider {
  records: Array<{ level: LogLevel; message: string; ctx?: unknown }> = [];
  log(level: LogLevel, message: string, ctx?: unknown) {
    this.records.push({ level, message, ctx });
  }
  clear() {
    this.records = [];
  }
}

export class Logger {
  private provider: LogProvider;
  constructor(provider: LogProvider = new ConsoleProvider()) {
    this.provider = provider;
  }
  setProvider(p: LogProvider) {
    this.provider = p;
  }
  info(msg: string, ctx?: unknown) {
    this.provider.log('info', msg, ctx);
  }
  warn(msg: string, ctx?: unknown) {
    this.provider.log('warn', msg, ctx);
  }
  error(msg: string, ctx?: unknown) {
    this.provider.log('error', msg, ctx);
  }
}
