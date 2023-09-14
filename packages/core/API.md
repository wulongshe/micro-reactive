# MICRO REACTIVE API

## useReactive

> 产生一个响应式函数对象 `reactive`。

```ts
function useReactive<T>(value: T): Reactive<T>;
```

- Reactive

> 本质是一个函数`Function`，能对值`value`进行读写操作。 同时又对其进行了`Proxy`代理，使其能通过 `.` 的方式或者解构的方式得到下一级属性。

```ts
/* 定义 */
// read
function Reactive<T>(): T;
// write
function Reactive<T>(value: T): void;
// patch
function Reactive<T>(value: Partial<T>, patch: boolean): void;
// proxy property
type Reactive<T> = {
  readonly [key in keyof T]: Reactive<T[key]>;
};
```

```ts
/* 案例 */
/* 基础类型 */
const value = useReactive(1);
console.log(value()); // 1
value(2);
console.log(value()); // 2

/* 引用类型 */
const data = useReactive({ count: 1 });
console.log(data()); // { count: 1 }
console.log(data.count()); // 1

// 修改根对象
data({ count: 4 });
console.log(data()); // { count: 4 }
console.log(data.count()); // 4

// 修改下级属性
data.count(8);
console.log(data()); // { count: 8 }
console.log(data.count()); // 8

// 解构使用
const { count } = data;
count(16);
console.log(data()); // { count: 16 }
console.log(data.count()); // 16
```

## useEffect

> 触发一次`effect`，为响应式对象收集依赖，可为`effect`的首次执行添加参数`args`

```ts
/* 定义 */
function useEffect<T extends [], R>(
  effect: EffectFunction<T, R>,
  ...args: T
): R;

type EffectFunction<T extends any[] = [], R = void> = (...args: T) => R;
```

```ts
/* 案例 */
const count = useReactive(1);
let double = NaN;

useEffect(() => {
  double = count() * 2;
});

console.log(double); // 2
count(2);
console.log(double); // 4
```

## watch

> 监听响应式对象的变化，触发回调函数

```ts
/* 定义 */
function watch<T extends readonly Reactive<any>[]>(
  cb: (values: DependenciesType<T>, oldVal: DependenciesType<T>) => void,
  deps: T,
);

export type DependenciesType<T> = T extends readonly [infer F, ...infer N]
  ? [ReactiveType<F>, ...DependenciesType<Readonly<N>>]
  : T extends Reactive<infer G>[]
  ? G[]
  : []
```

```ts
/* 案例 */
const data1 = useReactive(1)
const data2 = useReactive(2)

watch((newVal, oldVal) => {
  console.log(newVal, oldVal)
}, [data1, data2])

data1(4)

// output
// [1, 2] [1, 2]
// [4, 2] [1, 2]
```

## useComputed & useMemo

> 计算属性和缓存，可根据需要设置为只读计算属性或可写计算属性

```ts
/* 定义 */
function useComputed<T>(getter: Getter<T>): ReadonlyReactive<T>;
function useComputed<T>(accessor: Accessor<T>): Reactive<T>;
function useMemo<T>(getter: Getter<T>): Getter<T>;

type Getter<T> = () => T;
type Setter<T> = (value: T) => void;

type Accessor<T> = {
  get: Getter<T>;
  set: Setter<T>;
};
```

```ts
/* 案例 */
const data = useReactive(2)
let doubleCube = NaN

// 无缓存计算属性
// const square = () => data() * data()
// 有缓存计算属性，useMemo与useComputed的区别在于，useMemo只能返回只读计算属，且只有最顶层可进行函数调用(read)
// const square = useMemo(() => data() * data())

// 只读计算属性
const square = useComputed(() => data() * data())
console.log(square()) // 4

// 可写计算属性
const cube = useComputed({
  get() {
    return { value: data() * data() * data()}
  },
  set({ value }) {
    doubleCube = value * 2
  }
})
console.log(cube()) // { value: 8 }
console.log(cube.value()) // 8

data(4)
console.log(square()) // 16
console.log(cube.value()) // 64
console.log(doubleCube) // 128
```
