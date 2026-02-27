import React, { JSX } from 'react'
import { Navigate } from 'react-router-dom'

// rudimentary auth check: token in localStorage
const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('access_token')
  return !!token
}

interface ProtectedRouteProps {
  children: JSX.Element
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />
  }
  return children
}

export default ProtectedRoute
