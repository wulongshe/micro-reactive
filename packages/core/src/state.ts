export const state: any = {}

export const getId = ((id = 0) => () => String(id++))()

export function parsePath(path: string) {
  const segments = path.split('.')
  return {
    get() {
      return path ? segments.reduce((obj, k) => obj[k], state) : state
    },
    set<T>(value: T, patch = false) {
      let i = 0, obj = state
      for (i = 0; i < segments.length - 1; i++) {
        obj = obj[segments[i]]
      }
      patch && typeof value === 'object' && value !== null
        ? Object.assign(obj[segments[i]], value)
        : (obj[segments[i]] = value)
    }
  }
}
