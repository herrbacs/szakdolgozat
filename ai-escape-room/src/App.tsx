import React, { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import Login from "./pages/login/Login"
import Registration from "./pages/registration/Registration"
import GamePage from "./pages/game/GamePage"
import NotFound from "./pages/NotFound"
import Menu from "./pages/Menu"
import Levels from "./pages/levels/Levels"
import NewLevel from "./pages/new-level/NewLevel"
import ProtectedRoute from "./components/ProtectedRoute"
import { setOnAuthFailed } from "./api/api"
import { authTokenStorage } from "./store/tokenStorage"

function AppRoutes() {
  const navigate = useNavigate()

  useEffect(() => {
    setOnAuthFailed((reason?: string) => {
      authTokenStorage.clear?.()
      console.warn("Auth failed:", reason)
      navigate("/login", { replace: true })
    })
  }, [navigate])

  return (
    <Routes>
        <Route path="/" element={<Navigate to="/menu" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <GamePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/levels"
          element={
            <ProtectedRoute>
              <Levels />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-level"
          element={
            <ProtectedRoute>
              <NewLevel />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}