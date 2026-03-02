import React, { useEffect, useState, JSX } from "react"
import { Navigate } from "react-router-dom"
import { authTokenStorage } from "../store/tokenStorage"

interface ProtectedRouteProps {
  children: JSX.Element
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [checked, setChecked] = useState(false)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const tokens = authTokenStorage.get()

    if (!tokens?.refreshToken) {
      setAllowed(false)
      setChecked(true)
      return
    }

    setAllowed(true)
    setChecked(true)
  }, [])

  if (!checked) return null
  if (!allowed) return <Navigate to="/login" replace />
  return children
}

export default ProtectedRoute