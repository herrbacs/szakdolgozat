import React from 'react'
import { useNavigate } from 'react-router-dom'
import { authTokenStorage } from '../store/tokenStorage'

const Menu: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Main Menu</h1>
      <div className="space-y-4">
        <button
          onClick={() => navigate('/game')}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Play Game
        </button>
        <button
          onClick={() => {
            authTokenStorage.clear()
            navigate('/login')
          }}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Log out
        </button>
      </div>
    </div>
  )
}

export default Menu
