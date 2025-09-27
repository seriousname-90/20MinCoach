// src/tests/logger.test.ts
import { Logger, MemoryProvider } from '@/src/utils/logger';

describe('Logger (Strategy)', () => {
  test('usa el provider para registrar', () => {
    const mem = new MemoryProvider();
    const logger = new Logger(mem);

    logger.info('hello', { a: 1 });
    expect(mem.records).toHaveLength(1);
    expect(mem.records[0]).toMatchObject({ level: 'info', message: 'hello' });
    expect((mem.records[0] as any).ctx).toEqual({ a: 1 });
  });

  test('cambia de provider en runtime', () => {
    const p1 = new MemoryProvider();
    const p2 = new MemoryProvider();
    const logger = new Logger(p1);

    logger.warn('w1');
    logger.setProvider(p2);
    logger.error('e2');

    expect(p1.records).toHaveLength(1);
    expect(p1.records[0].level).toBe('warn');

    expect(p2.records).toHaveLength(1);
    expect(p2.records[0].level).toBe('error');
  });
});
