import { test, expect } from 'vitest'
import { useReactive } from '../src/reactive'
import { useMemo } from '../src/memo'

test('[memo]', async () => {
  const count = useReactive(0)
  const double = useMemo(() => count() * 2)

  expect(double()).toBe(0)
  count(1)
  expect(double()).toBe(2)
  expect(double()).toBe(2)
})
