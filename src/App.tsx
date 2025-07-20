import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import RoomsPage from "./pages/RoomsPage"
import BookingPage from "./pages/BookingPage"
import "./App.css"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/book/:roomId" element={<BookingPage />} />
      </Routes>
    </div>
  )
}

export default App
