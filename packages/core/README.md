# MICRO REACTIVE

## 简介

> Reactive core based on `Function` and `Proxy`

## API 文档

> [点此查看](https://github.com/wulongshe/micro-reactive/blob/master/packages/core/API.md)

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
# pnpm
pnpm i micro-reactive
# or npm
npm i micro-reactive
# or yarn
yarn add micro-reactive
```

## 在线运行

- [RunKit 在线运行](https://npm.runkit.com/micro-reactive)

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

## 测试

> [测试用例](https://github.com/Yuki-0505/micro-reactive/tree/master/packages/core/tests)

- [effect](https://github.com/Yuki-0505/micro-reactive/blob/master/packages/core/tests/effect.spec.ts)
- [signal](https://github.com/Yuki-0505/micro-reactive/blob/master/packages/core/tests/signal.spec.ts)
- [reactive](https://github.com/Yuki-0505/micro-reactive/blob/master/packages/core/tests/reactive.spec.ts)
- [computed](https://github.com/Yuki-0505/micro-reactive/blob/master/packages/core/tests/computed.spec.ts)
- [memo](https://github.com/Yuki-0505/micro-reactive/blob/master/packages/core/tests/memo.spec.ts)
- [watch](https://github.com/Yuki-0505/micro-reactive/blob/master/packages/core/tests/watch.spec.ts)
- [state](https://github.com/Yuki-0505/micro-reactive/blob/master/packages/core/tests/state.spec.ts)
