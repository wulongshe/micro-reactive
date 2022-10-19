import './style.css'
import typescriptLogo from './typescript.svg'
// import Counter from './components/Counter'
import Counter from './components/MicroCounter'

export default function App() {
  return (
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" className="logo" alt="Vite logo" />
      </a>
      <a href="https://www.solidjs.com/" target="_blank">
        <img src={typescriptLogo} className="logo vanilla" alt="TypeScript logo" />
      </a>
      <h1>Vite + Solidjs</h1>
      <div className="card">
        <Counter></Counter>
      </div>
      <p className="read-the-docs">
        Click on the Vite and TypeScript logos to learn more
      </p>
    </div>
  )
}
