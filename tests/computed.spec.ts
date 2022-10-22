import { test, expect } from 'vitest'
import { useReactive } from '../src/reactive'

test('[computed]', async () => {
  const firstName = useReactive('wulong')
  const secondName = useReactive('she')

  const fillName = () => firstName() + secondName()

  expect(fillName()).toBe('wulongshe')

  firstName('shiyu')
  expect(fillName()).toBe('shiyushe')
})
