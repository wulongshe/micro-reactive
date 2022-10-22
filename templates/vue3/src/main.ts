import { createApp, ReactiveEffect } from 'vue'
import { useEffect } from 'micro-reactive'
import { micro } from './directives/micro'
import './style.css'
import App from './App.vue'

// hack ReactiveEffect
const hackRun = ReactiveEffect.prototype.run
ReactiveEffect.prototype.run = function () {
  return useEffect(hackRun.bind(this))
}

const app = createApp(App)
app.directive('micro', micro)
app.mount('#app')
