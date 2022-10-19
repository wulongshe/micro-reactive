import { test, expect } from 'vitest'
import { getId, parsePath } from '../src/utils'

test('[utils]: getId', async () => {
  expect(getId()).toBe('0')
  expect(getId()).toBe('1')
  expect(getId()).toBe('2')
})

test('[utils]: parsePath', async () => {
  const a = parsePath('a')
  a.set({ b: 1 })
  expect(a.get()).toEqual({ b: 1 })

  const b = parsePath('a.b')
  b.set(5)
  expect(a.get()).toEqual({ b: 5 })

  expect(parsePath('').get()).toEqual({ 'a': { b: 5 } })
})
