import { expect, describe, it } from 'vitest'
import { defineStore } from '../src/store'
import type { ReadonlyReactive } from '../src/type'

describe('options', () => {
  it('state', async () => {
    const store = defineStore({
      id: 'user',
      state: () => ({
        count: 1
      })
    })
    const { count } = store

    expect(store()).toEqual({ count: 1 })
    expect(count()).toBe(1)
  })

  it('getters', async () => {
    const store = defineStore({
      id: 'user',
      state: () => ({
        count: 1
      }),
      getters: (state) => ({
        double() {
          return state.count() * 2
        }
      })
    })
    const { double } = store

    expect(store()).toEqual({ count: 1 })
    expect(double()).toBe(2)
  })

  it('actions', async () => {
    const store = defineStore({
      id: 'user',
      state: () => ({
        count: 1
      }),
      actions: (state) => ({
        add(value: number) {
          const { count } = state
          setTimeout(() => count(count() + value), 100)
          return count() + value
        }
      })
    })

    expect(store()).toEqual({ count: 1 })
    expect(store.add(2)).toBe(3)
    setTimeout(() => {
      expect(store.count()).toBe(3)
    }, 200)
  })

  it('all', async () => {
    type ListNode = { id: number, pid: number, value: number }
    type TreeNode = { value: number, children?: TreeNode[] }
    function transform(list: ListNode[], pid = 0): TreeNode[] | undefined {
      const ret = list.filter((item) => pid === item.pid)
      if (ret.length === 0) return undefined
      return ret.map(({ id, value }) => {
        const node = { value } as TreeNode
        node.children = transform(list, id)
        return node
      })
    }
    const store = defineStore({
      id: 'user',
      state: () => ({
        count: 1,
        list: [
          { id: 1, pid: 0, value: 1 },
          { id: 2, pid: 1, value: 2 },
          { id: 3, pid: 1, value: 3 },
        ] as ListNode[]
      }),
      getters: (state) => ({
        double: () => state.count() * 2,
        tree: () => transform(state.list())
      }),
      actions: (state, getters) => ({
        async add(node: ListNode) {
          const { list } = state
          list([...list(), node])
        }
      }),
    })

    expect(store.tree()).toEqual([{
      value: 1, children: [
        { value: 2 },
        { value: 3 },
      ]
    }])

    store.add({ id: 4, pid: 2, value: 4 })
    // store.list.push({ id: 4, pid: 2, value: 4 })
    expect(store.tree()).toEqual([{
      value: 1, children: [
        { value: 2, children: [{ value: 4 }] },
        { value: 3 },
      ]
    }])
    const tree = store.tree as ReadonlyReactive<TreeNode[]>
    if (!tree) return
    expect(tree[0].value()).toBe(1)
  })
})
