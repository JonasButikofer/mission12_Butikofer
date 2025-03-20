import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import BooksList from './BooksList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BooksList />
    </>
  )
}

export default App
