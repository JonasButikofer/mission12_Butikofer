import { useState } from 'react'
import './App.css'
import BooksPage from './pages/BooksPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PurchasePage from './pages/PurchasePage';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminBooksPage from './pages/AdminBooksPage';



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<BooksPage />} />
            <Route path="/purchase/:title/:bookId" element={<PurchasePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/adminpage" element={<AdminBooksPage />} />
          </Routes>
      </Router>
    </CartProvider>
    </>
  )
}

export default App
