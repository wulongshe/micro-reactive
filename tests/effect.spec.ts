import { test, expect } from 'vitest'
import { useEffect, track, trigger } from '../src/effect'

test('[effect]: useEffect, track, trigger, clear', async () => {
  let count = 0

  const effects = new Set<() => void>()
  useEffect(() => {
    count++
    track(effects)
  })
  trigger(effects)

  expect(count).toBe(2)
})
