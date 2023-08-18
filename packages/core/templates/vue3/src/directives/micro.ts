import type { Reactive } from 'micro-reactive'
import { useEffect } from 'micro-reactive'
import { Directive } from 'vue'

export const micro: Directive<any, Reactive<any>> = {
  mounted(el: HTMLInputElement, binding) {
    const convert = {
      boolean: Boolean,
      number: Number,
      string: String,
    }
    useEffect(() => el.value = binding.value())
    el.oninput = (evt: any) => binding.value(convert[el.type as 'string'](evt.target.value))
  }
}
