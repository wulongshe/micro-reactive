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

## 尝试

- [RunKit 在线运行](https://npm.runkit.com/micro-reactive)
- 嵌入 solid 项目中运行
  - 下载仓库到本地 [download link](https://github.com/Yuki-0505/micro-reactive.git)
  - 在终端中进入 `micro-reactive/templates/solidjs` 目录
  - 使用 `pnpm i` 安装依赖
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

> 嵌入到 `solid js` 中 [(with solid js)](https://github.com/Yuki-0505/micro-reactive/tree/master/templates/solidjs)

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

## 测试

> [测试用例](https://github.com/Yuki-0505/micro-reactive/tree/master/tests)

- [effect](https://github.com/Yuki-0505/micro-reactive/blob/master/tests/effect.spec.ts)
- [signal](https://github.com/Yuki-0505/micro-reactive/blob/master/tests/signal.spec.ts)
- [reactive](https://github.com/Yuki-0505/micro-reactive/blob/master/tests/reactive.spec.ts)
- [computed](https://github.com/Yuki-0505/micro-reactive/blob/master/tests/computed.spec.ts)
- [watch](https://github.com/Yuki-0505/micro-reactive/blob/master/tests/watch.spec.ts)
