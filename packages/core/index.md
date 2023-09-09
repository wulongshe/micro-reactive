---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Micro Reactive"
  text: "Reactive core based on Function and Proxy"
  tagline: "干饭 & 摸鱼"
  actions:
    - theme: alt
      text: API
      link: /doc/index

features:
  - title: Reactive and no ref
    details: 基于 Function 和 Proxy 实现的响应式。有着与 solid 相似的语法风格，不需要考虑变量是基础类型还是对象类型，没有 vue3 中诸如 ref.value 的痛点。
  - title: Deconstruction
    details: 响应式对象可任意解构而不会失去响应式，且可对根对象进行修改。
  - title: Chain
    details: 对比 solid，读写操作更为统一，且和 vue3 一样支持链式调用。
  - title: Two way data volume
    details: 响应式数据在组件之间具有穿透性，默认即是双向数据流，不需要 v-model 指令，直接传参即可
---

