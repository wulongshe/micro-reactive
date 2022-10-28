import { defineStore } from 'micro-reactive'

export const store = defineStore({
  id: 'counter',
  state: () => ({
    count: 0
  }),
  getters: ({ count }) => ({
    double: () => count() * 2,
    square: () => count() * count()
  }),
  actions: ({ count }, getters) => ({
    increase: () => count(count() + 1)
  })
})
