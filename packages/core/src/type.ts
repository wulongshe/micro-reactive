/**
 * 读取值的函数
 * @public
 */
export type Getter<T> = () => T;

/**
 * 写入值的函数
 * @public
 */
export type Setter<T> = (value: T, patch?: boolean) => void;

/**
 * 访问器对象
 * @public
 */
export type Accessor<T> = {
  get: Getter<T>;
  set: Setter<T>;
};

/**
 * 信号函数
 * @public
 */
export type Signal<T> = (() => T) &
  ((value: T) => T) &
  (T extends object ? (value: Partial<T>, patch: boolean) => T : unknown);

/**
 * 响应式对象
 * @public
 */
export type Reactive<T> = Signal<T> &
  (T extends object
    ? { readonly [key in keyof T]: Reactive<T[key]> } & (T extends Array<any> ? Array<unknown> : {})
    : {});

/**
 * 只读响应式对象
 * @public
 */
export type ReadonlyReactive<T> = Getter<T> &
  (T extends object ? { readonly [key in keyof T]: ReadonlyReactive<T[key]> } : {});

/**
 * 依赖函数的类型
 * @public
 */
export type EffectFunction<T extends any[] = [], R = void> = (...args: T) => R;

/**
 * 响应式对象的内部值
 * @public
 */
export type ReactiveType<T> = T extends Reactive<infer V> ? V : never;

/**
 * 依赖函数的依赖项类型
 * @public
 */
export type DependenciesType<T> = T extends readonly [infer F, ...infer N]
  ? [ReactiveType<F>, ...DependenciesType<Readonly<N>>]
  : T extends Reactive<infer G>[]
  ? G[]
  : [];

/**
 * class store 的 getter 属性
 * @public
 */
export type Getters<T = Record<string | symbol, any>> = {
  [key in keyof T]: Getter<T[key]>;
};

/**
 * class store 的 action 属性，函数的 this 指向 store
 * @public
 */
export type Actions = {
  [key: string]: (...args: any[]) => void;
};

/**
 * class store 的 option 选项
 * @public
 * @param Id - option 的 id
 * @param S - option 的 state
 * @param G - option 的 getters
 * @param A - option 的 actions
 * @returns option
 */
export type Options<Id extends string, S extends Record<string | symbol, any>, G extends Getters, A extends Actions> = {
  id: Id;
  state: S;
  getters: G & ThisType<Store<Id, S, G, Record<string, any>>>;
  actions: A & ThisType<Store<Id, S, G, A>>;
};

/**
 * store 的计算属性
 * @public
 */
export type Computes<T extends Getters<Record<string | symbol, any>>> = {
  readonly [key in keyof T]: () => ReturnType<T[key]>;
};

/**
 * store 的类型
 * @public
 * @param Id - option 的 id
 * @param S - option 的 state
 * @param G - option 的 getters
 * @param A - option 的 actions
 * @returns store
 */
export type Store<Id extends string, S extends Record<string | symbol, any>, G extends Getters, A extends Actions> = {
  $id: Id;
} & Reactive<S> &
  Computes<G> &
  Readonly<A>;
