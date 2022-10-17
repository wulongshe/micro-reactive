import { EffectFunction } from './type'

let currentEffect: (() => void) | null = null
const cache: Array<() => void> = []

// 清空依赖缓存
export function clear() {
  while (cache.length) {
    cache.pop()?.()
  }
}

// 跟踪依赖
export function track(effects: Set<() => void>) {
  if (currentEffect) {
    effects.add(currentEffect)
  }
}

// 触发依赖
export function trigger(effects: Set<() => void>) {
  for (const effect of effects) {
    if (cache.includes(effect)) continue
    cache.push(effect)
  }
  clear()
}

export function useEffect(effect: EffectFunction) {
  currentEffect = effect
  effect()
  currentEffect = null
}
