# MICRO CLI

## 简介

> micro-reactive cli

## 本地快速开始

```bash
# install micro-cli globally
pnpm i -g micro-cli
# create project
micro create my-app
# enter project
cd my-app
# install dependencies
pnpm i
# run dev
pnpm dev
```

## 模板

### 用于全局状态管理 (microx store)

- options

```ts
/* options */
export const store = defineStore({
  id: "user",
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
```

- setup

```ts
/* setup */
import { defineStore } from "micro-reactive";

export const store = defineStore((ctx) => ({
  id: "user",
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
```

- module

```ts
/* module */
import { useComputed, useMemo, useReactive } from "micro-reactive";

export const count = useReactive(0);
export const double = useMemo(() => count() * 2);
export function increase() {
  count(count() + 1);
}
```

### 在 `solid js` 中运行 (with solid js)

```ts
/* micro-counter.tsx */
import { useReactive } from "micro-reactive";

export default function Counter() {
  const count = useReactive(0);
  // 自增
  const increase = () => count(count() + 1);
  return (
    <button id="counter" type="button" onClick={increase}>
      count is {count()}
    </button>
  );
}
```

```ts
/* vite.config.ts */
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
// 自定义插件，在代码中嵌入 useEffect，收集依赖
import TrackEffect from "./plugins/vite-plugin-track-effect";

export default defineConfig({
  plugins: [solidPlugin(), TrackEffect()],
});
```

```ts
/* vite-plugin-track-effect.ts */
// 使用 useEffect 收集组件更新方法
const fileRegex = /\.(cjs|mjs|js|ts)/;
const funcRegex = /function updateComputation/;
// 导入
const importUseEffect = `import { useEffect } from "micro-reactive";`;
// 替换
const hackUpdateComputation = `
const update = updateComputation
updateComputation = function (node) {
  useEffect(() => update.call(this, node));
}`;
export default function TrackEffect() {
  return {
    name: "track-effect",
    transform(src: string, id: string) {
      if (fileRegex.test(id) && funcRegex.test(src)) {
        return { code: importUseEffect + src + hackUpdateComputation };
      }
    },
  };
}
```

### 在 `vue3` 中运行 (with vue3)

```vue
/* MicroCounter.vue */
<script setup lang="ts">
import { useReactive } from "micro-reactive";

const count = useReactive(0);
</script>

<template>
  <button type="button" @click="count(count() + 1)">
    count is {{ count() }}
  </button>
</template>
```

```ts
/* main.ts 中添加以下代码 */
import { ReactiveEffect } from "vue";
import { useEffect } from "micro-reactive";

// hack ReactiveEffect
const hackRun = ReactiveEffect.prototype.run;
ReactiveEffect.prototype.run = function () {
  return useEffect(() => hackRun.call(this));
};
```

### 在 `react` 中运行 (with react)

```ts
import { useComputed, useReactive } from "micro-reactive";
// 引入 hack
import { defineState } from "../hacks/defineState";

export default function Counter() {
  // useReactive 声明变量需写在 defineState 中
  const [count] = defineState(() => [useReactive(0)]);
  // 只读计算属性
  const double = () => count() * 2;

  return (
    <button onClick={() => count(count() + 1)}>
      double count is {double()}
    </button>
  );
}
```

```ts
/* defineState.ts */
import { useEffect } from "micro-reactive";
import { useState } from "react";

const stateMap = new WeakMap();

export function defineState<T extends {} | []>(defineReactive: () => T): T {
  const setter = useState({})[1];
  if (!setter) throw new Error("setter is empty");
  if (stateMap.has(setter)) {
    return stateMap.get(setter);
  }
  const state = useEffect(() => {
    setter({});
    if (stateMap.has(setter)) {
      return stateMap.get(setter);
    }
    const ret = defineReactive();
    for (const key in ret) {
      if (typeof ret[key] === "function") {
        (ret[key] as Function)();
      }
    }
    return ret;
  });
  stateMap.set(setter, state);
  return state;
}
```
