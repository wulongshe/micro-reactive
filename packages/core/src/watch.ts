import { useEffect } from './effect'
import type { DependenciesType, Reactive } from './type'

/**
 * 监听依赖项的变化
 * @public
 * @param cb - 回调函数
 * @param deps - 依赖项
 */
export function watch<T extends Reactive<any>[]>(cb: (...values: DependenciesType<T>) => void, ...deps: T) {
  useEffect(() => {
    cb(...(deps.map((dep) => dep()) as any))
  })
}
