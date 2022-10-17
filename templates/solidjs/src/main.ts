import App from './App'
import { render } from 'solid-js/web'
import type { JSX } from 'solid-js'

render(App as unknown as () => JSX.Element, document.querySelector('#app')!)
