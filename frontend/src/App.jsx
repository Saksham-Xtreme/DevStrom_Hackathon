import { useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const checkBackend = async () => {
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/')
      const data = await response.json()

      setMessage(data.message)
    } catch (error) {
      console.error('Backend error:', error)
      setMessage('Could not connect to backend')
    }

    setLoading(false)
  }

  return (
    <div>
      <h1>DevStrom</h1>

      <button onClick={checkBackend}>
        {loading ? 'Connecting...' : 'Check Backend'}
      </button>

      {message && <p>{message}</p>}
    </div>
  )
}

export default App