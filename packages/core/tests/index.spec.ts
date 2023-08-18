import { test, expect } from 'vitest'
import { useReactive, useComputed } from '../src'

test('Destructuring', async () => {
  const state = useReactive({ count: 1, value: 'value' })
  // 只读计算属性
  const double = () => state.count() * 2
  const { count } = state

  expect(state()).toEqual({ count: 1, value: 'value' })
  expect(double()).toBe(2)
  expect(count()).toBe(1)

  count(3)
  expect(state()).toEqual({ count: 3, value: 'value' })
  expect(double()).toBe(6)
  expect(count()).toBe(3)

  state({ count: 5, value: 'string' })
  expect(state()).toEqual({ count: 5, value: 'string' })
  expect(double()).toBe(10)
  expect(count()).toBe(5)

  // 可写计算属性
  const cube = useComputed({
    get: () => Math.pow(state.count(), 3),
    set: (value) => state.value(String(Math.pow(value, 1 / 3)))
  })
  cube(27)
  expect(state()).toEqual({ count: 5, value: '3' })
  expect(double()).toBe(10)
  expect(count()).toBe(5)
  expect(cube()).toBe(27)
})

test('Array', async () => {
  const arr = useReactive([0, 1, 2, 3, 4, 5])

  expect(arr()).toEqual([0, 1, 2, 3, 4, 5])

  arr[3](8)
  expect(arr()).toEqual([0, 1, 2, 8, 4, 5])

  expect(arr[6]()).toBe(undefined)
  arr[6](6)
  expect(arr()).toEqual([0, 1, 2, 8, 4, 5, 6])
})
