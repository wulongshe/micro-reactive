import { useEffect } from 'micro-reactive'
import { useState } from 'react'

const stateMap = new Map()

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
      if (typeof ret[key] === 'function') {
        (ret[key] as Function)()
      }
    }
    return ret
  })
  stateMap.set(setter, state)
  return state
}
