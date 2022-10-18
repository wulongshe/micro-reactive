import { EffectFunction } from './type'

let currentEffect: EffectFunction | null = null
const cache: Array<EffectFunction> = []

// 清空依赖缓存
export function clear() {
  while (cache.length) {
    cache.pop()?.()
  }
}

// 跟踪依赖
export function track(effects: Set<EffectFunction>) {
  if (currentEffect) {
    effects.add(currentEffect)
  }
}

// 触发依赖
export function trigger(effects: Set<EffectFunction>) {
  for (const effect of effects) {
    if (cache.includes(effect)) continue
    cache.push(effect)
  }
  clear()
}

export function useEffect<T extends [], R>(effect: EffectFunction<T, R>, ...args: T): R {
  currentEffect = effect
  const value = effect(...args)
  currentEffect = null
  return value
}
