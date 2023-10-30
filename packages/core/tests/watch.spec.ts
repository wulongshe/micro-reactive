import { test, expect } from 'vitest';
import { useReactive } from '../src/reactive';
import { watch } from '../src/watch';

test('watch', async () => {
  const data1 = useReactive(1);
  const data2 = useReactive('2');

  const ret1: number[] = [];
  watch(
    ([value]) => {
      ret1.push(value);
    },
    [data1],
  );

  const ret2: [number, string][] = [];
  watch(
    (value1) => {
      ret2.push(value1);
    },
    [data1, data2] as const,
  );

  data1(4);
  expect(ret1).toEqual([1, 4]);

  data2('8');
  expect(ret2).toEqual([
    [1, '2'],
    [4, '2'],
    [4, '8'],
  ]);
});
