import { createSignal } from './signal'
import type { Reactive, Signal, Option } from './type'

export function createProxy<T>(signal: Signal<T>, option: Option<T>) {
  return new Proxy(signal, {
    get(target, key) {
      const { reactiveMap, value } = option

      // 若属性的响应式对象已存在，直接返回
      const reactive = reactiveMap.get(key as keyof T)
      if (reactive) return reactive

      // signal 函数上的属性
      const method = Reflect.get(target, key)
      if (method != void 0) return method

      // 非对象类型的值，不能索引出属性
      if (typeof value !== 'object' || value === null) return void 0

      // 生成属性的响应式对象，缓存并返回
      const react = useReactive(value[key as keyof T])
      reactiveMap.set(key as keyof T, react as any)
      return react
    }
  }) as Reactive<T>
}

export function useReactive<T>(value: T): Reactive<T> {
  const option: Option<T> = {
    reactiveMap: new Map(),
    effects: new Set(),
    self: null as any,
    value
  }
  const signal = createSignal(option)
  return option.self = createProxy(signal, option)
}
