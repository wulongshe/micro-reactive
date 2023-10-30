import { expect, describe, it } from 'vitest';
import { defineStore } from '../src/store';

type ListNode = { id: number; pid: number; value: number };
type TreeNode = { value: number; children?: TreeNode[] };
function transform(list: ListNode[], pid = 0): TreeNode[] | undefined {
  const ret = list.filter((item) => pid === item.pid);
  if (ret.length === 0) return undefined;
  return ret.map(({ id, value }) => {
    const node = { value } as TreeNode;
    node.children = transform(list, id);
    return node;
  });
}

describe('class options store', () => {
  it('state & getters', async () => {
    const store = defineStore({
      id: 'user',
      state: {
        count: 1,
      },
      getters: {
        double() {
          return this.count() * 2;
        },
        message() {
          return `double const is ${this.double()}`;
        },
      },
      actions: {
        increase(value: number = 1) {
          this.count(this.count() + value);
        },
      },
    });
    const { count, double, message, increase } = store;

    expect(store()).toEqual({ count: 1 });
    expect(count()).toBe(1);
    count(2);
    expect(store()).toEqual({ count: 2 });
    expect(double()).toBe(4);

    increase(3);
    expect(message()).toBe(`double const is 10`);
  });

  it('state & getters & actions', async () => {
    const store = defineStore({
      id: 'user',
      state: {
        count: 1,
        list: [
          { id: 1, pid: 0, value: 1 },
          { id: 2, pid: 1, value: 2 },
          { id: 3, pid: 1, value: 3 },
        ] as ListNode[],
      },
      getters: {
        double() {
          return this.count() * 2;
        },
        tree() {
          return transform(this.list());
        },
      },
      actions: {
        async add(node: ListNode) {
          const { list } = this;
          list([...list(), node]);
        },
      },
    });

    expect(store.tree()).toEqual([
      {
        value: 1,
        children: [{ value: 2 }, { value: 3 }],
      },
    ]);

    await store.add({ id: 4, pid: 2, value: 4 });
    store.list.push({ id: 5, pid: 3, value: 5 });
    expect(store.tree()).toEqual([
      {
        value: 1,
        children: [
          { value: 2, children: [{ value: 4 }] },
          { value: 3, children: [{ value: 5 }] },
        ],
      },
    ]);
    const tree = store.tree;
    if (!tree) return;
    expect(tree[0].value()).toBe(1);
  });
});

describe('setup store', () => {
  it('state & getters', async () => {
    const store = defineStore((ctx) => ({
      id: 'user',
      state: {
        count: 1,
      },
      getters: {
        double: () => ctx.count() * 2,
        message: () => `double const is ${ctx.double()}`,
      },
      actions: {
        increase: (value: number = 1) => {
          ctx.count(ctx.count() + value);
        },
      },
    }));
    const { count, double, message, increase } = store;

    expect(store()).toEqual({ count: 1 });
    expect(count()).toBe(1);
    count(2);
    expect(store()).toEqual({ count: 2 });
    expect(double()).toBe(4);

    increase(3);
    expect(message()).toBe(`double const is 10`);
  });

  it('state & getters & actions', async () => {
    const store = defineStore((ctx) => ({
      id: 'user',
      state: {
        count: 1,
        list: [
          { id: 1, pid: 0, value: 1 },
          { id: 2, pid: 1, value: 2 },
          { id: 3, pid: 1, value: 3 },
        ] as ListNode[],
      },
      getters: {
        double: () => ctx.count() * 2,
        tree: () => transform(ctx.list()),
      },
      actions: {
        async add(node: ListNode) {
          const { list } = ctx;
          list([...list(), node]);
        },
      },
    }));

    expect(store.tree()).toEqual([
      {
        value: 1,
        children: [{ value: 2 }, { value: 3 }],
      },
    ]);

    store.add({ id: 4, pid: 2, value: 4 });
    store.list.push({ id: 5, pid: 3, value: 5 });
    expect(store.tree()).toEqual([
      {
        value: 1,
        children: [
          { value: 2, children: [{ value: 4 }] },
          { value: 3, children: [{ value: 5 }] },
        ],
      },
    ]);
    const tree = store.tree;
    if (!tree) return;
    expect(tree[0].value()).toBe(1);
  });
});
