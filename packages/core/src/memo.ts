import { useComputed } from './computed'
import { useEffect } from './effect'
import type { Getter } from './type'

export function useMemo<T>(getter: Getter<T>): Getter<T> {
  const data = useComputed(getter)
  return () => data()
}
