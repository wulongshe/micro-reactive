import { test, expect } from 'vitest'
import { getId, createAccessor } from '../src/state'

test('[utils]: getId', async () => {
  expect(getId()).toBe('0')
  expect(getId()).toBe('1')
  expect(getId()).toBe('2')
})

test('[utils]: createAccessor', async () => {
  const a = createAccessor('a')
  a.set({ b: 1 })
  expect(a.get()).toEqual({ b: 1 })

  const b = createAccessor('a.b')
  b.set(5)
  expect(a.get()).toEqual({ b: 5 })

  expect(createAccessor('').get()).toEqual({ 'a': { b: 5 } })
})
