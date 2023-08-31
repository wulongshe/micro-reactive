import { test, expect } from 'vitest'
import { useReactive, useEffect } from '../src'
import type { Reactive } from '../src/type'

test('[reactive]: base type', async () => {
  const data = useReactive(1)

  let double = NaN
  useEffect(() => {
    double = data() * 2
  })

  expect(double).toEqual(2)
  expect(data()).toEqual(1)

  data(3)
  expect(data()).toBe(3)
  expect(double).toEqual(6)
})

test('[reactive]: undefined type', async () => {
  const data = useReactive<{ value: number | undefined } | null>(null)
  let clone: any
  useEffect(() => {
    clone = data()
  })
  expect(clone).toEqual(null)

  data({ value: undefined })
  const data2 = data as Reactive<{ value: number | undefined }>

  expect(data2.value()).toBe(undefined)
  expect(data2()).toEqual({ value: undefined })

  data2.value(4)
  expect(data2.value()).toBe(4)
  expect(data()).toEqual({ value: 4 })
})

test('[reactive]: object', async () => {
  const data = useReactive({ a: 1 })

  let data2 = { b: 2 }

  expect(data()).toEqual({ a: 1 })

  useEffect(() => {
    data2 = { ...data2, ...data() }
  })

  data({ a: 3 })

  expect(data()).toEqual({ a: 3 })
  expect(data2).toEqual({ a: 3, b: 2 })
})

test('[reactive]: object patch', async () => {
  const data = useReactive({ a: 1, b: 2 })
  data({ a: 3 }, true)
  expect(data()).toEqual({ a: 3, b: 2 })
})

test('[reactive]: object key', async () => {
  const data = useReactive({ a: 1, b: 1, c: 1 })
  let clone: any

  expect(data()).toEqual({ a: 1, b: 1, c: 1 })

  useEffect(() => {
    clone = {
      a: data.a() * 1,
      b: data.b() * 2,
      c: data.c() * 3,
    }
  })

  expect(clone).toEqual({ a: 1, b: 2, c: 3 })

  data.b(4)
  await Promise.resolve()
  expect(data.b()).toBe(4)
  expect(clone).toEqual({ a: 1, b: 8, c: 3 })
})

test('[reactive]: async function', async () => {
  const asyncFn = async () => useReactive({ a: 1 })

  const res = await asyncFn()

  expect(res()).toEqual({ a: 1 })
})
