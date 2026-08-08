import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Board from './pages/Board.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/board/:code" element={<Board />} />
    </Routes>
  )
}