import type { EffectFunction } from './type';

const effectStack: EffectFunction[] = [];
const cache: Array<EffectFunction> = [];

/**
 * 清空依赖缓存
 */
export function clear() {
  while (cache.length) {
    useEffect(cache.shift()!);
  }
}

/**
 * 跟踪依赖
 * @param effects - 依赖集合
 * @returns 是否跟踪成功
 */
export function track(effects: Set<EffectFunction>): boolean {
  if (effectStack.length) {
    const effect = effectStack[effectStack.length - 1];
    if (effects.has(effect)) return false;
    effects.add(effect);
  }
  return true;
}

/**
 * 触发依赖
 * @param effects - 依赖集合
 */
export function trigger(effects: Set<EffectFunction>) {
  for (const effect of effects) {
    if (cache.includes(effect)) continue;
    cache.push(effect);
  }
  clear();
}

/**
 * 收集依赖函数
 * @public
 * @param effect - 依赖函数
 * @param args - 依赖函数的参数
 * @returns - 依赖函数的返回值
 */
export function useEffect<T extends [], R>(effect: EffectFunction<T, R>, ...args: T): R {
  effectStack.push(effect);
  const value = effect(...args);
  effectStack.pop();
  return value;
}
