import { test, expect } from 'vitest';
import { useReactive } from '../src/reactive';
import { useComputed } from '../src/computed';

test('[computed]', async () => {
  const firstName = useReactive('wulong');
  const secondName = useReactive('she');

  const fillName = useComputed(() => firstName() + secondName());

  expect(fillName()).toBe('wulongshe');

  firstName('shiyu');
  expect(fillName()).toBe('shiyushe');

  const one = useReactive({ one: 1 });
  const two = useReactive({ two: 2 });
  const three = useComputed(() => ({ ...one(), ...two() }));
  expect(three()).toEqual({ one: 1, two: 2 });
});
