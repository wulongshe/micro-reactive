import { test, expect } from 'vitest';
import { useEffect, track, trigger } from '../src/effect';
import type { EffectFunction } from '../src/type';

test('[effect]: useEffect, track, trigger, clear', async () => {
  let count = 0;

  const effects = new Set<EffectFunction>();
  useEffect(() => {
    count++;
    track(effects);
  });
  trigger(effects);

  expect(count).toBe(2);
});
