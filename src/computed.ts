import { useEffect } from './effect'
import { useReactive } from './reactive'
import type { Accessor, Reactive } from './type'

export function useComputed<T>({ get, set }: Accessor<T>): Reactive<T> {
  const data = useReactive<T>(null as unknown as T)
  useEffect(() => data(get()))
  set && useEffect(() => set(data()))
  return data
}
