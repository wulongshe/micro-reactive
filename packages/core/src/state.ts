export const state: any = {}

/**
 * 获取唯一 id
 */
export const getId = ((id = 0) => () => String(id++))()

/**
 * 创建访问器对象
 * @public
 * @param path - 路径
 * @returns 访问器对象
 */
export function createAccessor(path: string) {
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
