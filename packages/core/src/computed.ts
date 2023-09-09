import { useEffect } from './effect'
import { useReactive } from './reactive'
import type { Getter, Accessor, Reactive, ReadonlyReactive } from './type'

/**
 * 使用计算属性
 * @public
 * @param getter - 计算属性的 getter 函数
 * @param accessor - 计算属性的 accessor 访问器对象
 * @returns 计算属性
 */
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
