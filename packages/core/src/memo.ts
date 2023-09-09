import { useComputed } from './computed'
import type { Getter } from './type'

/**
 * 使用记忆化函数
 * @public
 * @param getter - 记忆化函数的 getter 函数
 * @returns 记忆化函数
 */
export function useMemo<T>(getter: Getter<T>): Getter<T> {
  const data = useComputed(getter)
  return () => data()
}
