import { skipEffect, useEffect } from './effect';
import type { Getter, Reactive } from './type';

/**
 * 使用记忆化函数
 * @public
 * @param getter - 记忆化函数的 getter 函数
 * @param deps - 依赖项，不填则表示依赖项为 getter 函数内部的响应式对象
 * @returns 记忆化函数
 */
export function useMemo<T, D extends readonly Reactive<any>[]>(getter: Getter<T>, deps: D): Getter<T> {
  let value: T;
  useEffect(() => {
    deps.map((dep) => dep());
    return skipEffect(() => (value = getter()));
  });
  return () => value;
}
