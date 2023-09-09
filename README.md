# MICRO REACTIVE

## 🪴 Description

> Reactive core based on `Function` and `Proxy`, and cli

## 🚀 Features

- 基于 `Function` 和 `Proxy` 实现的响应式。
- 有着与 `solid` 相似的语法风格，不需要考虑变量是基础类型还是对象类型，没有 `vue3` 中诸如 `ref.value` 的问题。
- 对比 `vue3`，该库所实现的响应式对象可任意解构而不会失去响应式，且可对根对象进行修改的同时不丢失响应。
- 对比 `solid`，读写操作更为统一，且和 `vue3` 一样支持链式调用。
- 响应式数据在组件之间具有穿透性，默认即是双向数据流，不需要`v-model`指令，直接传参即可

## 📦 Install

```bash
# pnpm
pnpm i micro-reactive
# or npm
npm i micro-reactive
# or yarn
yarn add micro-reactive
```

## ⚡ Quick Start

> [RunKit Playground](https://npm.runkit.com/micro-reactive)

```bash
# install micro-reactive-cli globally
pnpm i -g micro-reactive-cli
# create project
micro create my-app
# enter project
cd my-app
# install dependencies
pnpm i
# run dev
pnpm dev
```

## 🦄 Usage

> [👉 API DOC](https://github.com/wulongshe/micro-reactive/blob/master/packages/core/API.md)

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

## 📄 License

[MIT License](https://github.com/wulongshe/micro-reactive/blob/master/LICENSE) © 2023 [shewulong](https://github.com/wulongshe)
