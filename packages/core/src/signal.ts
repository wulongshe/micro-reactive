import { track, trigger } from './effect'
import type { Signal, Option, ReactiveMap } from './type'

const NULL = Symbol('NULL') as any
const TriggerChildren = Symbol('triggerChildren') as any

export function read<T>({ effects, get }: Option<T>): T {
  track(effects)
  return get()
}

export function write<T>({ effects, reactiveMap, parent, set }: Option<T>, value: T, patch: boolean) {
  if (value !== TriggerChildren) {
    triggerParent(parent)
    set(value, patch)
  }
  trigger(effects)
  triggerChildren(reactiveMap)
}

export function triggerParent(option: Option<any> | null) {
  if (!option) return
  const { parent, effects } = option
  triggerParent(parent)
  trigger(effects)
}

export function triggerChildren<T>(reactiveMap: ReactiveMap<T>) {
  if (reactiveMap instanceof Map) {
    for (const [, reactive] of reactiveMap) {
      reactive(TriggerChildren)
    }
  }
}

export function createSignal<T>(option: Option<T>): Signal<T> {
  /**
   * 函数重载
   * 没有参数时为读取操作
   * 有参数时为写入操作
   */
  function signal<T>(): T
  function signal<T>(value: T): void
  function signal<T>(value: Partial<T>, patch: boolean): void
  function signal(value = NULL, patch = false) {
    return NULL === value
      ? read(option)
      : write(option, value, patch)
  }
  return signal
}
