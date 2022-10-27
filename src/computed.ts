import { useEffect } from './effect'
import { useReactive } from './reactive'
import type { Getter, Accessor, Reactive, ReadonlyReactive } from './type'

export function useComputed<T>(getter: Getter<T>): ReadonlyReactive<T>
export function useComputed<T>(accessor: Accessor<T>): Reactive<T>
export function useComputed(accessor: any) {
  const data = useReactive(null)
  if (typeof accessor === 'function') {
    useEffect(() => data(accessor()))
  } else {
    const { get, set } = accessor
    useEffect(() => data(get()))
    useEffect(() => set(data()))
  }
  return data
}
