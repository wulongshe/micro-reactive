import { useReactive } from './reactive'
import { useComputed } from './computed'
import type { Actions, Getters, Store, Options } from './type'

/**
 * class类型的store
 * @public
 * @param options - store的选项
 * @returns store
 */
export function defineStore<
  Id extends string,
  S extends Record<string | symbol, any>,
  G extends Getters,
  A extends Actions,
>(options: Options<Id, S, G, A>): Store<Id, S, G, A>

/**
 * setup类型的store
 * @public
 * @param setup - store的选项
 * @returns store
 */
export function defineStore<
  Id extends string,
  S extends Record<string | symbol, any>,
  G extends Getters,
  A extends Actions,
  Context extends Store<Id, S, G, A>,
>(setup: (context: Context) => Options<Id, S, G, A>): Store<Id, S, G, A>

export function defineStore(optionsOrSetup: any) {
  return typeof optionsOrSetup === 'function' ? defineSetupStore(optionsOrSetup) : defineOptionsStore(optionsOrSetup)
}

/**
 * class类型的store
 * @param option - store的选项
 * @param ctx - store的上下文
 * @returns store
 */
export function defineOptionsStore<
  Id extends string,
  S extends Record<string | symbol, any>,
  G extends Getters,
  A extends Actions,
>(option: Options<Id, S, G, A>, ctx?: Store<Id, S, G, A>): Store<Id, S, G, A> {
  const { id, state, getters = {} as any, actions = {} as any } = option
  const store = ctx || (useReactive({}) as any)
  store(state, true)
  store.$id = id

  for (const key in getters) {
    store[key] = useComputed((getters[key] as any).bind(store))
  }
  for (const key in actions) {
    store[key] = actions[key].bind(store)
  }
  return store
}

/**
 * setup类型的store
 * @param setup - store的选项
 * @returns store
 */
export function defineSetupStore<
  Id extends string,
  S extends Record<string | symbol, any>,
  G extends Getters,
  A extends Actions,
  Context extends Store<Id, S, G, A>,
>(setup: (context: Context) => Options<Id, S, G, A>): Store<Id, S, G, A> {
  const ctx = useReactive({}) as any
  return defineOptionsStore(setup(ctx), ctx)
}
