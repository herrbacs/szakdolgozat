import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"
import type { ProfileResponse } from "../api/types/users"
import type {
  TokenPurchaseRequest,
  TokenPurchaseResponse,
} from "../api/types/tokens"
import { TokenCategory } from "../api/types/tokens"

const cardWrapperClass =
  "min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 px-4"

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [purchaseCategory, setPurchaseCategory] = useState<TokenCategory>(
    TokenCategory.Basic
  )
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const resp = await api.get("/users/me")
        if (!resp.ok) {
          setError("Profile loading failed")
        } else {
          const data: ProfileResponse = await resp.json()
          if (!cancelled) setProfile(data)
        }
      } catch {
        setError("Network error")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const buyTokens = async () => {
    if (!profile) return
    setMessage(null)
    try {
      const resp = await api.post("/tokens/buy", {
        category: purchaseCategory,
      } as TokenPurchaseRequest)

      if (resp.ok) {
        const data: TokenPurchaseResponse = await resp.json()
        setProfile({ ...profile, tokens: data.new_balance })
        setMessage("Purchase successful")
      } else {
        const txt = await resp.text()
        setMessage("Error: " + txt)
      }
    } catch {
      setMessage("Network error")
    }
  }

  if (loading) {
    return (
      <div className={cardWrapperClass}>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
          Loading...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cardWrapperClass}>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <p className="text-red-600 text-center">{error}</p>
          <button
            onClick={() => navigate("/menu")}
            className="mt-4 w-full py-2 rounded-lg font-semibold text-white transition bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
          >
            Back to Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cardWrapperClass}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-semibold text-center mb-4">Profile</h1>

        {profile && (
          <div className="space-y-2">
            <p>
              <strong>Username:</strong> {profile.username}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Tokens:</strong> {profile.tokens}
            </p>
          </div>
        )}

        <div className="mt-6">
          <h2 className="font-semibold mb-2">Buy Tokens</h2>
          <select
            value={purchaseCategory}
            onChange={(e) =>
              setPurchaseCategory(e.target.value as TokenCategory)
            }
            className="w-full border rounded px-2 py-1 mb-2"
          >
            <option value={TokenCategory.Basic}>Kicsi (50 000 token)</option>
            <option value={TokenCategory.Medium}>Közepes (75 000 token)</option>
            <option value={TokenCategory.High}>Nagy (100 000 token)</option>
          </select>

          <button
            onClick={buyTokens}
            className="w-full py-2 rounded-lg font-semibold text-white transition bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
          >
            Purchase
          </button>
          {message && <p className="mt-2 text-center">{message}</p>}
        </div>

        <button
          onClick={() => navigate("/menu")}
          className="mt-4 w-full py-2 rounded-lg font-semibold text-white transition bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
        >
          Back to Menu
        </button>
      </div>
    </div>
  )
}

export default Profile
