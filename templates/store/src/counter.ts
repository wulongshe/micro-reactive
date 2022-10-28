import { count, double, increase, square } from './module'
import { useEffect } from 'micro-reactive'

export function setupCounter(element: HTMLButtonElement) {
  const eleCount = element.querySelector('#count')!
  const eleDouble = element.querySelector('#double')!
  const eleSquare = element.querySelector('#square')!
  eleCount.addEventListener('click', increase)

  useEffect(() => eleCount.innerHTML = `count is ${count()}`)
  useEffect(() => eleDouble.innerHTML = `double is ${double()}`)
  useEffect(() => eleSquare.innerHTML = `square is ${square()}`)
}
