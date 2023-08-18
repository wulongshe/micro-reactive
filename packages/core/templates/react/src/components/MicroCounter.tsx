import { useComputed, useReactive } from 'micro-reactive'
import { defineState } from '../hacks/defineState'

export default function Counter() {
  const [count] = defineState(() => [useReactive(0)])
  const double = useComputed(() => count() * 2)

  return (
    <button onClick={() => count(count() + 1)}>
      double count is {double()}
    </button>
  )
}
