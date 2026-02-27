import React, { useState } from "react"
import { API_BASE_URL } from "../../shared/urls"
import { StatusCodes } from "http-status-codes"

type LoginResponse = {
  access_token: string,
  refresh_token: string
}

type LoginCredentials = {
  identifier: string
  password: string
}

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    identifier: "",
    password: "",
  })

  const [error, setError] = useState<{ message: string; field?: string } | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      credentials.identifier.trim() === "" ||
      credentials.password.trim() === ""
    ) {
      setError({ message: "Please fill in all fields" })
      return
    }

    setError(null)
    setLoading(true)

    try {
      const resp = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      
      if (!resp.ok) {
        if (resp.status === StatusCodes.UNAUTHORIZED) {
          setError({ message: 'Invalid credentials' })
          return
        }

        setError({ message: 'Something went wrong' })
        return
      }
      
      const data:LoginResponse = await resp.json()

      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
    } catch {
      setError({ message: 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-semibold text-center text-gray-800">
          Welcome Back 👋
        </h2>
        <p className="text-sm text-gray-500 text-center mt-2 mb-6">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email or Username
            </label>
            <input
              type="text"
              value={credentials.identifier}
              onChange={(e) =>
                setCredentials({ ...credentials, identifier: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 
                         focus:border-indigo-500 transition"
              placeholder="Enter your email or username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 
                         focus:border-indigo-500 transition"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
              {error.field ? `${error.field}: ` : ""}
              {error.message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-semibold text-white transition 
              ${
                loading
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
              }`}
          >
            {loading ? "Signing in..." : "Log in"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Don't have an account?{" "}
          <a
            href="/registration"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login