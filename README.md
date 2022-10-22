# MICRO REACTIVE

## 简介

> Reactive core based on `Function` and `Proxy`

## API 文档

> [点此查看](https://github.com/Yuki-0505/micro-reactive/blob/master/API.md)

## 优势

- 基于 `Function` 和 `Proxy` 实现的响应式。
- 有着与 `solid` 相似的语法风格，不需要考虑变量是基础类型还是对象类型，没有 `vue3` 中诸如 `ref.value` 的问题。
- 对比 `vue3`，该库所实现的响应式对象可任意解构而不会失去响应式，且可对根对象进行修改的同时不丢失响应。
- 对比 `solid`，读写操作更为统一，且和 `vue3` 一样支持链式调用。
- 响应式数据在组件之间具有穿透性，默认即是双向数据流，不需要`v-model`指令，直接传参即可

```ts
/* micro-reactive */
const data = useReactive({ id: 1, value: 0 });
// 直接修改根对象，不会丢失响应
data({ id: 2, value: 1 });
// 链式调用
data.id(3);
console.log(data()); // { id: 3, value: 1 }
// 直接解构，不需要 toRefs() 操作
const { value } = data;
value(-1);
console.log(data()); // { id: 3, value: -1 }
```

```ts
/* vue3 */
let data = reactive({ id: 1, value: 0 });
// 以下修改操作会导致丢失响应式
data = reactive({ id: 2, value: 1 });
// 链式调用
data.id = 3;
console.log(data); // { id: 3, value 1 }
// 解构
const { value } = toRefs(data);
value.value = -1;
console.log(data); // { id: 2, value -1 }
```

```ts
/* solid */
const [data, setData] = createSignal({ id: 1, value: 0 }, { equals: false });
setData({ id: 2, value: 1 });
// 链式调用修改
setData((data) => {
  data.id = 3;
  return data;
});
console.log(data()); // { id: 3, value 1 }
// solid 原生不支持解构
```

## 安装

```bash
# npm
npm i micro-reactive
# or yarn
yarn i micro-reactive
# or pnpm
pnpm i micro-reactive
```

## 尝试

- [RunKit 在线运行](https://npm.runkit.com/micro-reactive)
- 嵌入到 solid 项目中运行
  - 下载仓库到本地 [download link](https://codeload.github.com/Yuki-0505/micro-reactive/zip/refs/heads/master)
  - 在终端中进入 `micro-reactive/templates/solidjs` 目录
  - `pnpm i` 安装依赖
  - `pnpm dev` 启动项目
- 嵌入到 vue3 项目中运行
  - 下载仓库到本地 [download link](https://codeload.github.com/Yuki-0505/micro-reactive/zip/refs/heads/master)
  - 在终端中进入 `micro-reactive/templates/vue3` 目录
  - `pnpm i` 安装依赖
  - `pnpm dev` 启动项目
- 嵌入到 react 项目中运行
  - 下载仓库到本地 [download link](https://codeload.github.com/Yuki-0505/micro-reactive/zip/refs/heads/master)
  - 在终端中进入 `micro-reactive/templates/react` 目录
  - `pnpm i` 安装依赖
  - `pnpm dev` 启动项目

## 案例

```ts
import { useReactive, useEffect } from "micro-reactive";

// 创建响应式对象
const data = useReactive(1);
let double = NaN;

useEffect(() => {
  // 读取data, 不加参数为读取操作
  double = data() * 2;
});

console.log(double); // 2

// data写入3，加参数为写入操作
data(3);
console.log(double); // 6
```

## 模板

### 替换嵌入到 `solid js` 中 [(with solid js)](https://github.com/Yuki-0505/micro-reactive/tree/master/templates/solidjs)

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

### 替换嵌入到 `vue3` 中 [(with vue3)](https://github.com/Yuki-0505/micro-reactive/tree/master/templates/vue3)

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

### 替换嵌入到 `react` 中 [(with react)](https://github.com/Yuki-0505/micro-reactive/tree/master/templates/react)

```ts
import { useComputed, useReactive } from "micro-reactive";
// 引入 hack
import { defineState } from "../hacks/defineState";

export default function Counter() {
  // useReactive 声明变量需写在 defineState 中
  const [count] = defineState(() => [useReactive(0)]);
  // 只读计算属性
  const double = () => count() * 2

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

## 测试

> [测试用例](https://github.com/Yuki-0505/micro-reactive/tree/master/tests)

- [effect](https://github.com/Yuki-0505/micro-reactive/blob/master/tests/effect.spec.ts)
- [signal](https://github.com/Yuki-0505/micro-reactive/blob/master/tests/signal.spec.ts)
- [reactive](https://github.com/Yuki-0505/micro-reactive/blob/master/tests/reactive.spec.ts)
- [computed](https://github.com/Yuki-0505/micro-reactive/blob/master/tests/computed.spec.ts)
- [watch](https://github.com/Yuki-0505/micro-reactive/blob/master/tests/watch.spec.ts)
