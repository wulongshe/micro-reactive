import { test, expect } from 'vitest'
import { createSignal } from '../src/signal'
import { parsePath } from '../src/utils'
import { Option, ReactiveMap } from '../src/type'

test('[signal]', async () => {
  const value = { a: 1 }
  const option: Option<typeof value> = {
    reactiveMap: {} as ReactiveMap<typeof value>,
    effects: new Set(),
    path: '0',
    ...parsePath('0'),
  }
  const signal = createSignal(option)

  signal(value)
  expect(parsePath('').get()).toEqual({ '0': { a: 1 } })

  expect(signal()).toEqual({ a: 1 })

  signal({ a: 4 })
  expect(signal()).toEqual({ a: 4 })

  signal(null as any)
  expect(signal()).toEqual(null)
})
