import { createSignal } from './signal'
import { getId, parsePath, state } from './state'
import type { Reactive, Option } from './type'

export function createReactive<T>(path: string, parent: Option<any> | null): Reactive<T> {
  const opt: Option<T> = {
    reactiveMap: new Map(),
    effects: new Set(),
    parent,
    path,
    ...parsePath(path),
  }
  const signal = createSignal(opt)
  return new Proxy(signal, {
    get(target, key) {
      const value = opt.get()

      // 若属性的响应式对象已存在，直接返回
      const reactive = opt.reactiveMap.get(key as keyof T)
      if (reactive) return reactive

      // signal 函数上的属性
      const method = Reflect.get(target, key)
      if (method != void 0) return method

      // 非对象类型的值，不能索引出属性
      if (typeof value !== 'object' || value === null) return void 0

      // 对象本身的属性
      const property = Reflect.get(value as unknown as object, key)
      if (typeof property === 'function') {
        return (...args: any[]) => {
          const ret = property.call(value, ...args)
          target(value)
          return ret
        }
      }

      // 若对象不存在then属性，则不允许新增then属性
      // 若初始化时就有then属性，则不受影响
      if (key === 'then') return void 0

      // 生成属性的响应式对象，缓存并返回
      const react = createReactive(`${path}.${String(key)}`, opt)
      opt.reactiveMap.set(key as keyof T, react as any)
      return react
    },
  }) as Reactive<T>
}

export function useReactive<T>(value: T): Reactive<T> {
  const key = getId()
  state[key] = value
  return createReactive(key, null)
}
