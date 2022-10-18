import { createApp, ReactiveEffect } from 'vue'
import { useEffect } from 'micro-reactive'
import './style.css'
import App from './App.vue'

// hack ReactiveEffect
const hackRun = ReactiveEffect.prototype.run
ReactiveEffect.prototype.run = function () {
  return useEffect(() => hackRun.call(this))
}

createApp(App).mount('#app')
