import { useEffect } from './effect'
import type { Getter } from './type'

export function useMemo<T>(getter: Getter<T>): Getter<T> {
  let data = null as T
  useEffect(() => data = getter())
  return () => data
}
