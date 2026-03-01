import React from "react"
import { useNavigate } from "react-router-dom"

const Levels: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Levels
        </h1>

        <button
          onClick={() => navigate("/menu")}
          className="w-full py-2.5 rounded-lg font-semibold text-white transition bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
        >
          Back to Menu
        </button>
      </div>
    </div>
  )
}

export default Levels
