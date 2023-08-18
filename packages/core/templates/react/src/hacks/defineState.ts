import { useEffect } from 'micro-reactive'
import { useState } from 'react'

const stateMap = new WeakMap()

export function defineState<T extends {} | []>(defineReactive: () => T): T {
  const setter = useState({})[1]
  if (!setter) throw new Error('setter is empty')
  if (stateMap.has(setter)) {
    return stateMap.get(setter)
  }
  const state = useEffect(() => {
    setter({})
    if (stateMap.has(setter)) {
      return stateMap.get(setter)
    }
    const ret = defineReactive()
    for (const key in ret) {
      const reactive = ret[key]
      if (typeof reactive === 'function') {
        reactive()
      }
    }
    return ret
  })
  stateMap.set(setter, state)
  return state
}
