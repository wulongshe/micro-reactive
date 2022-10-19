import { track, trigger } from './effect'
import type { Signal, Option } from './type'

const NULL = Symbol('NULL') as any
const onlyTrigger = Symbol('onlyTrigger') as any

export function read<T>({ effects, reactiveMap, get }: Option<T>): T {
  if (!track(effects)) {
    return get()
  }
  if (reactiveMap instanceof Map) {
    for (const [, reactive] of reactiveMap) {
      reactive()
    }
  }
  return get()
}

export function write<T>({ effects, reactiveMap, set }: Option<T>, value: T) {
  if (value !== onlyTrigger) {
    set(value)
  }
  if (reactiveMap instanceof Map) {
    for (const [, reactive] of reactiveMap) {
      reactive(onlyTrigger)
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
  function signal(value = NULL) {
    return NULL === value
      ? read(option)
      : write(option, value)
  }
  return signal
}
