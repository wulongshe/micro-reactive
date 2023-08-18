import { useEffect } from 'micro-reactive'
// import { count, increase, message } from './module'
// import { store } from './options'
import { store } from './setup'
const { count, increase, message } = store

export function setupCounter(element: HTMLButtonElement) {
  element.addEventListener('click', increase)

  useEffect(() => element.innerHTML = `count is ${count()}`)
  useEffect(() => console.log(message()))
}
