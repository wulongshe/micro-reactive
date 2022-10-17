import { useEffect } from './effect'
import { useReactive } from './reactive'
import type { Getter, Setter, ComputedProp, Computed } from './type'

export function useComputed<T>(accessor: ComputedProp<T>): Computed<ComputedProp<T>> {
  const data = useReactive<T>(null as unknown as T)
  let get: Getter<T>, set: Setter<T>
  if (typeof accessor === 'function') {
    get = accessor
    set = () => { }
  } else if (typeof accessor === 'object') {
    ({
      get = () => null as unknown as T,
      set = () => { }
    } = accessor)
  }
  useEffect(() => {
    data(get())
  })
  useEffect(() => {
    set(data())
  })
  return data
}
