import { useEffect } from 'micro-reactive'
{{#isModuleStore }}
import { count, increase, message } from './store'
{{/isModuleStore }}
{{^isModuleStore }}
import store from './store'

const { count, increase, message } = store
{{/isModuleStore }}

export function setupCounter(element: HTMLButtonElement) {
  element.addEventListener('click', increase)

  useEffect(() => element.innerHTML = `count is ${count()}`)
  useEffect(() => console.log(message()))
}
