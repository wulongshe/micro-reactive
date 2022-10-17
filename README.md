# REACTIVE

## 简介

> Reactive core based on `Function` and `Proxy`

## 安装

```bash
# npm
npm i micro-reactive
# or yarn
yarn i micro-reactive
# or pnpm
pnpm i micro-reactive
```

## 案例

```ts
import { useReactive, useEffect } from 'micro-reactive'

// 创建响应式对象
const data = useReactive(1)
let double = NaN

useEffect(() => {
  // 读取data, 不加参数为读取操作
  double = data() * 2
})

console.log(double) // 2

// data写入3，加参数为写入操作
data(3)
console.log(double) // 6
```

## 测试

> [测试用例](https://github.com/Yuki-0505/micro-reactive/tree/master/tests)

- [effect](https://github.com/Yuki-0505/micro-reactive/blob/master/tests/effect.spec.ts)
- [signal](https://github.com/Yuki-0505/micro-reactive/blob/master/tests/signal.spec.ts)
- [reactive](https://github.com/Yuki-0505/micro-reactive/blob/master/tests/reactive.spec.ts)
- [computed](https://github.com/Yuki-0505/micro-reactive/blob/master/tests/computed.spec.ts)
- [watch](https://github.com/Yuki-0505/micro-reactive/blob/master/tests/watch.spec.ts)
