import { useComputed, useMemo, useReactive } from 'micro-reactive'

export const count = useReactive(0)

export const double = useMemo(() => count() * 2)

export const square = useComputed(() => count() * count())

export function increase() {
  count(count() + 1)
}
