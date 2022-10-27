export type Getter<T> = () => T
export type Setter<T> = (value: T) => void

export type Accessor<T> = {
  get: Getter<T>
  set: Setter<T>
}

export interface Signal<T> {
  (): T
  (value: T): void
}

export type Reactive<T> = Signal<T> &
  (T extends object
    ? { readonly [key in keyof T]: Reactive<T[key]> }
    : {})

export type ReadonlyReactive<T> = Getter<T> &
  (T extends object
    ? { readonly [key in keyof T]: ReadonlyReactive<T[key]> }
    : {})

export type ReactiveMap<T> = Map<keyof T, Reactive<T[keyof T]>>

export type EffectFunction<T extends any[] = [], R = void> = (...args: T) => R

export type Option<T> = {
  reactiveMap: ReactiveMap<T>
  parent: Option<T> | null
  effects: Set<EffectFunction>
  path: string
  get: Getter<T>
  set: Setter<T>
}

export type ReactiveType<T> =
  T extends Reactive<infer V> ? V : never

export type DependenciesType<T> =
  T extends [infer F, ...infer N]
  ? [ReactiveType<F>, ...DependenciesType<N>]
  : []
