import { track, trigger } from './effect'
import { createSignal } from './signal'
import type { EffectFunction, Reactive } from './type'
import { DELETE, READ, getId, ownKeys } from './utils'

/**
 * 使用响应式对象
 * @public
 * @param data - 响应式对象的初始值
 * @returns 响应式对象
 */
export function useReactive<T>(data: T): Reactive<T> {
  return createReactive(data, getId())
}

function createReactive<T>(value: T, path: string): Reactive<T> {
  const effects = new Set<EffectFunction>()
  const children = new Map<string | symbol, Reactive<any>>()
  const signal = createSignal(value, path)

  return new Proxy(signal, {
    get(target, key, receiver) {
      const data = target()

      // 非对象类型的值，不能索引出属性
      if (!(typeof data === 'object' && data !== null)) return void 0

      // signal 函数上的实例属性
      if (key in target) return Reflect.get(target, key)

      // 对象上的方法
      if (Reflect.has(data, key)) {
        const property = Reflect.get(data, key)
        if (typeof property === 'function') {
          return (...args: any[]) => {
            const ret = property.call(target(), ...args)
            receiver(target())
            return ret
          }
        }
      }

      // children 子属性
      if (children.has(key)) return children.get(key)!

      // 未初始化then，不能索引出属性
      if (key === 'then' && !Reflect.has(data, key)) return void 0

      // 生成属性的响应式对象，缓存并返回
      const reactive = createReactive(Reflect.get(data, key), `${path}.${String(key)}`)
      children.set(key, reactive)
      return reactive
    },
    apply(target, thisArg, argArray) {
      argArray = argArray.length ? argArray : [READ]
      const result = Reflect.apply(target, thisArg, argArray)
      if (argArray[0] === READ) {
        // read
        track(effects)
      } else if (argArray[0] === DELETE) {
        // delete
        trigger(effects)
        return
      } else {
        // write
        const newKeys = new Set(ownKeys(result))
        for (const key of children.keys()) {
          const child = children.get(key)!
          if (newKeys.has(key)) {
            // update
            child(Reflect.get(result, key))
          } else {
            // delete
            child(DELETE) && children.delete(key)
          }
        }
        trigger(effects)
      }
      return result
    },
  }) as Reactive<T>
}
