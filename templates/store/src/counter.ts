import { useEffect } from 'micro-reactive'
// import { count, double, increase, square } from './module'
import { store } from './options'
const { count, double, increase, square } = store

export function setupCounter(element: HTMLButtonElement) {
  element.addEventListener('click', increase)

  useEffect(() => element.innerHTML = `count is ${count()}`)
  useEffect(() => console.log(`double is ${double()}`))
  useEffect(() => console.log(`square is ${square()}`))
}
