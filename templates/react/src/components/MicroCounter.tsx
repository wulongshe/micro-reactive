import { useReactive } from 'micro-reactive'
import { defineState } from '../hacks/defineState'

export default function Counter() {
  const [count] = defineState(() => [
    useReactive(0)
  ])

  return (
    <button onClick={() => count(count() + 1)}>
      count is {count()}
    </button>
  )
}
