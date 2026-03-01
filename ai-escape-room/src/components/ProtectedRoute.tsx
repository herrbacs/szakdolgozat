import React, { useEffect, useState, JSX } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { authTokenStorage } from '../store/tokenStorage'
import { tryRefresh } from '../api/auth'

interface ProtectedRouteProps {
  children: JSX.Element
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate()
  const [checked, setChecked] = useState(false)
  const [allowed, setAllowed] = useState(false)

  const isJwtExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      const now = Date.now()
      const expiry = payload.exp * 1000
      const safetyBuffer = 60 * 1000

      return expiry - safetyBuffer < now
    } catch {
      return true
    }
  }

  useEffect(() => {
    const verify = async () => {
      const tokens = authTokenStorage.get()
      if (!tokens) {
        navigate('/login', { replace: true })
        setChecked(true)
        return
      }

      if (!tokens.accessToken || isJwtExpired(tokens.accessToken)) {
        const ok = await tryRefresh()
        if (!ok) {
          authTokenStorage.clear()
          navigate('/login', { replace: true })
          setChecked(true)
          return
        }
      }

      setAllowed(true)
      setChecked(true)
    }

    verify()
  }, [navigate])

  if (!checked) {
    return null
  }

  if (!allowed) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
