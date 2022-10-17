import { test, expect } from 'vitest'
import { createSignal } from '../src/signal'
import { Option, ReactiveMap } from '../src/type'

test('[signal]', async () => {
  const value = { a: 1 }
  const option: Option<typeof value> = {
    reactiveMap: {} as ReactiveMap<typeof value>,
    effects: new Set(),
    value
  }
  const signal = createSignal(option)

  expect(signal()).toEqual({ a: 1 })

  signal({ a: 4 })
  expect(signal()).toEqual({ a: 4 })

  signal(null as any)
  expect(signal()).toEqual(null)
})
