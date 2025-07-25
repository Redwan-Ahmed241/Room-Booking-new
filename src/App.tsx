"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState } from "react"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import RoomsPage from "./pages/RoomsPage"
import BookingPage from "./pages/BookingPage"
import AdminPage from "./pages/AdminPage"
import AdminLogin from "./pages/AdminLogin"

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar isAdmin={isAdminAuthenticated} onLogout={() => setIsAdminAuthenticated(false)} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/admin/login" element={<AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />} />
          <Route
            path="/admin"
            element={
              isAdminAuthenticated ? <AdminPage /> : <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
