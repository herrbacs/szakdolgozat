import React from "react"
import { useNavigate } from "react-router-dom"
import { authTokenStorage } from "../store/tokenStorage"

const Menu: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Main Menu
        </h1>

        <ul className="space-y-4">
          <li>
            <button
              onClick={() => navigate("/profile")}
              className="w-full py-2.5 rounded-lg font-semibold text-white transition bg-green-600 hover:bg-green-700 active:scale-[0.98]"
            >
              Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/levels")}
              className="w-full py-2.5 rounded-lg font-semibold text-white transition bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
            >
              Levels
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/new-level")}
              className="w-full py-2.5 rounded-lg font-semibold text-white transition bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
            >
              New Level
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                authTokenStorage.clear()
                navigate("/login")
              }}
              className="w-full py-2.5 rounded-lg font-semibold text-white transition bg-red-500 hover:bg-red-600 active:scale-[0.98]"
            >
              Log out
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Menu
