import { useReactive } from '@micro-cube/reactive'

export default function Counter() {
  const count = useReactive(0)
  const increase = () => count(count() + 1)
  return (
    <button id="counter" type="button" onClick={increase}>count is {count()}</button>
  )
}
