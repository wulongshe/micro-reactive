import { defineStore } from 'micro-reactive'

export default defineStore((ctx) => ({
  id: 'counter',
  state: {
    count: 0
  },
  getters: {
    double: () => ctx.count() * 2,
    message: () => `double is ${ctx.double()}`
  },
  actions: {
    increase: () => {
      ctx.count(ctx.count() + 1)
    }
  }
}))
