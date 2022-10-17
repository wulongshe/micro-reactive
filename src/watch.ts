import { useEffect } from './effect'
import type { DependenciesType, Reactive } from './type'

export function watch<T extends Reactive<any>[]>(cb: (...values: DependenciesType<T>) => void, ...deps: T) {
  useEffect(() => {
    cb(...deps.map(dep => dep()) as any)
  })
}
