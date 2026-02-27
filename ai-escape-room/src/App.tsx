import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login/Login'
import Registration from './pages/registration/Registration'
import GamePage from './pages/game/GamePage'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

// NOTE: make sure react-router-dom is installed (`npm install react-router-dom @types/react-router-dom`)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <GamePage />
            </ProtectedRoute>
          }
        />
        {/* protected routes wrap components requiring auth */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
