import { test, expect } from 'vitest';
import { createSignal } from '../src/signal';
import { DELETE } from '../src/utils';

test('[signal]', async () => {
  const signal = createSignal({ a: 1, b: 0 }, '0');

  expect(signal()).toEqual({ a: 1, b: 0 });

  signal({ a: 4, b: 1 });
  expect(signal()).toEqual({ a: 4, b: 1 });

  signal({ b: 2 }, true);
  expect(signal()).toEqual({ a: 4, b: 2 });

  signal(null as any);
  expect(signal()).toBe(null);

  signal(DELETE);
  expect(signal()).toBe(undefined);
});
