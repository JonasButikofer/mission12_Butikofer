import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import BooksList from './components/BooksList'
import BooksPage from './pages/BooksPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BooksPage />
    </>
  )
}

export default App
