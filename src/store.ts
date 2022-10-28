import { useReactive } from './reactive'
import { useMemo } from './memo'
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

  const gets = getters ? getters(store) : {} as G
  const acts = actions ? actions(store, gets) : {} as A
  for (const key in gets) {
    store[key] = useMemo(gets[key])
  }
  for (const key in acts) {
    store[key] = acts[key]
  }
  return store
}
