import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import RoomsPage from "./pages/RoomsPage"
import BookingPage from "./pages/BookingPage"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/booking/:id" element={<BookingPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
