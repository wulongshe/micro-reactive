import { track, trigger } from './effect'
import type { Signal, Option } from './type'

const NULL = Symbol('NULL')

export function read<T>({ effects, reactiveMap, value }: Option<T>): T {
  track(effects)
  if (reactiveMap instanceof Map) {
    for (const [key, reactive] of reactiveMap) {
      value[key] = reactive() as T[typeof key]
    }
  }
  return value
}

export function write<T>({ effects, reactiveMap, value }: Option<T>) {
  if (reactiveMap instanceof Map) {
    for (const [key, reactive] of reactiveMap) {
      reactive(value[key])
    }
  }
  trigger(effects)
}

export function createSignal<T>(option: Option<T>): Signal<T> {
  /**
   * 函数重载
   * 没有参数时为读取操作
   * 有参数时为写入操作
   */
  function signal<T>(): T
  function signal<T>(value: T): void
  function signal(value = NULL as any) {
    return NULL === value
      ? read(option)
      : (option.value = value, write(option))
  }
  return signal
}
