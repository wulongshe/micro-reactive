import { test, expect } from 'vitest'
import { createSignal } from '../src/signal'
import { createAccessor } from '../src/state'
import type { Option } from '../src/type'

test('[signal]', async () => {
  const value = { a: 1 }
  const option: Option<typeof value> = {
    reactiveMap: new Map(),
    effects: new Set(),
    parent: null,
    path: '0',
    ...createAccessor('0'),
  }
  const signal = createSignal(option)

  signal(value)
  expect(createAccessor('').get()).toEqual({ '0': { a: 1 } })

  expect(signal()).toEqual({ a: 1 })

  signal({ a: 4 })
  expect(signal()).toEqual({ a: 4 })

  signal(null as any)
  expect(signal()).toEqual(null)
})
