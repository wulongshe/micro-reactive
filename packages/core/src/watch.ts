import { useEffect } from './effect'
import type { DependenciesType, Reactive } from './type'

/**
 * 监听依赖项的变化
 * @public
 * @param cb - 回调函数
 * @param deps - 依赖项
 */
export function watch<T extends readonly Reactive<any>[]>(
  cb: (values: DependenciesType<T>, oldVal: DependenciesType<T>) => void,
  deps: T,
) {
  let oldVal = deps.map((dep) => dep()) as DependenciesType<T>
  useEffect(() => {
    const newVal = deps.map((dep) => dep()) as DependenciesType<T>
    cb(newVal, oldVal)
    oldVal = newVal
  })
}
