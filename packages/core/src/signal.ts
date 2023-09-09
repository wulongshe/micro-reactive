import { track, trigger } from './effect'
import type { Signal, Option } from './type'

/**
 * symbol类型的空值，用于区分读取和写入操作
 */
const NULL = Symbol('NULL') as any
/**
 * symbol类型的触发子级信号函数的值
 */
const TriggerChildren = Symbol('triggerChildren') as any

/**
 * 读取值
 * @param option - 信号函数的选项
 * @returns 读取的值
 */
export function read<T>(option: Option<T>): T {
  const { effects, get } = option
  track(effects)
  return get()
}

/**
 * 写入值
 * @param option - 信号函数的选项
 * @param value - 写入的值
 * @param patch - 是否为局部更新
 */
export function write<T>(option: Option<T>, value: T, patch: boolean) {
  const { effects, parent, set } = option
  if (value !== TriggerChildren) {
    triggerParent(parent)
    set(value, patch)
  }
  trigger(effects)
  triggerChildren(option)
}

/**
 * 触发父级信号函数
 * @param option - 信号函数的选项
 */
export function triggerParent<T>(option: Option<T> | null) {
  if (!option) return
  const { parent, effects } = option
  triggerParent(parent)
  trigger(effects)
}

/**
 * 触发子级信号函数
 * @param reactiveMap - 子级响应式对象的Map集合
 */
export function triggerChildren<T>(option: Option<T>) {
  const { reactiveMap } = option
  if (reactiveMap instanceof Map) {
    for (const [, reactive] of reactiveMap) {
      reactive(TriggerChildren)
    }
  }
}

/**
 * 创建信号函数，
 * 信号函数没有参数时为读取操作，
 * 信号函数有参数时为写入操作。
 * @param option - 信号函数的选项
 * @returns 信号函数
 */
export function createSignal<T>(option: Option<T>): Signal<T> {
  function signal<T>(): T
  function signal<T>(value: T): void
  function signal<T>(value: Partial<T>, patch: boolean): void
  function signal(value = NULL, patch = false) {
    return NULL === value ? read(option) : write(option, value, patch)
  }
  return signal
}
