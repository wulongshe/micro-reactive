import { useReactive } from './reactive'
import { useComputed } from './computed'
import type { Actions, Getters, Options, Store } from './type'

export function defineStore<
  Id extends string,
  S extends object,
  G extends Getters,
  A extends Actions,
  >(
    { id, state, getters, actions }: Options<Id, S, G, A>
  ): Store<Id, S, G, A> {
  const store = useReactive(state()) as any
  store.$id = id

  const gets = {} as G, acts = {} as A
  Object.assign(gets, getters ? getters(store, gets) : {})
  Object.assign(acts, actions ? actions(store, gets, acts) : {})
  for (const key in gets) {
    store[key] = useComputed(gets[key])
  }
  for (const key in acts) {
    store[key] = acts[key]
  }
  return store
}
