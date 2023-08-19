import { useReactive, useEffect } from 'micro-reactive'

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
