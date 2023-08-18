import { defineStore } from 'micro-reactive'

export const store = defineStore({
  id: 'counter',
  state: {
    count: 0
  },
  getters: {
    double() {
      return this.count() * 2
    },
    message() {
      return `double is ${this.double()}`
    }
  },
  actions: {
    increase() {
      this.count(this.count() + 1)
    }
  }
})
