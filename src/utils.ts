export const getId = ((id = 0) => () => String(id++))()

export const state: any = {}

export function parsePath(path: string) {
  const segments = path.split('.')
  return {
    get() {
      return path ? segments.reduce((obj, k) => obj[k], state) : state
    },
    set<T>(value: T) {
      let i = 0, obj = state
      for (i = 0; i < segments.length - 1; i++) {
        obj = obj[segments[i]]
      }
      obj[segments[i]] = value
    }
  }
}
