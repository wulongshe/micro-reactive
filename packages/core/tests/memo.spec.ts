import { test, expect } from 'vitest';
import { useReactive } from '../src/reactive';
import { useMemo } from '../src/memo';

test('[memo]', async () => {
  const width = useReactive(100);
  const height = useReactive(100);

  const area = useMemo(() => width() * height(), [width]);

  expect(area()).toBe(10000);
  height(200);
  expect(area()).toBe(10000);
  width(200);
  expect(area()).toBe(40000);
});
