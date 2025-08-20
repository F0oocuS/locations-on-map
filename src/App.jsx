import { useState } from 'react'
import './App.css'

function App() {
	const [count, setCount] = useState(0);
    const str = '123';

	return (
        <div className="card">
            <h1>Vite ++++ React</h1>

            <button onClick={() => setCount((count) => count + 1)}>
                count is {count} { str }
            </button>
            <p>
                Edit <code>src/App.jsx</code> and save to test HMR
            </p>
        </div>
	)
}

export default App
