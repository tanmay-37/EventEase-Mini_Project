import { useState } from 'react'
import LoginContainer from './components/login/finalLogin'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <LoginContainer />
    </>
  )
}

export default App
