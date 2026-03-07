import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import BaseModal from "./BaseModal"
import { AppSettingsContext } from "../../../context/AppSettingsContext"
import { AppSettingsContextType } from "../../../shared/types/frameworkTypes"
import { SetAppSettingsActionEnum } from "../../../shared/enums"
import { addLevelToFavorites, rateLevel, removeLevelFromFavorites, getUserLevelRating, isLevelFavorite, recordLevelCompletion } from "../../../api/levels"

const LevelCompleteModal = () => {
  const navigate = useNavigate()
  const {
    appSettings: {
      gameInformation: { showLevelCompleteModal, levelId, levelStartedAt },
    },
    setAppSettings,
  }: AppSettingsContextType = useContext(AppSettingsContext)

  const [selectedRating, setSelectedRating] = useState<number>(5)
  const [busy, setBusy] = useState<boolean>(false)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [favoriteAdded, setFavoriteAdded] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")

  const closeModal = () => {
    setAppSettings({ action: SetAppSettingsActionEnum.SET_LEVEL_COMPLETE_MODAL, payload: false })
  }

  const submitRating = async () => {
    setBusy(true)
    setMessage("")
    try {
      await rateLevel(levelId, selectedRating)
      setUserRating(selectedRating)
      setMessage("Rating submitted.")
    } catch {
      setMessage("Failed to submit rating.")
    } finally {
      setBusy(false)
    }
  }

  const submitFavorite = async () => {
    setBusy(true)
    setMessage("")
    try {
      await addLevelToFavorites(levelId)
      setFavoriteAdded(true)
      setMessage("Added to favorites.")
    } catch {
      setMessage("Failed to add to favorites.")
    } finally {
      setBusy(false)
    }
  }

  const removeFavorite = async () => {
    setBusy(true)
    setMessage("")
    try {
      await removeLevelFromFavorites(levelId)
      setFavoriteAdded(false)
      setMessage("Removed from favorites.")
    } catch {
      setMessage("Failed to remove from favorites.")
    } finally {
      setBusy(false)
    }
  }

  const loadInitialData = async () => {
    try {
      const rating = await getUserLevelRating(levelId)
      setUserRating(rating)
      if (rating) {
        setSelectedRating(rating)
      }

      const isFavorite = await isLevelFavorite(levelId)
      setFavoriteAdded(isFavorite)
    } catch (err) {
      console.error("Failed to load initial data:", err)
    }
  }

  const saveCompletionTime = async () => {
    const elapsedMs = Date.now() - levelStartedAt
    const completionMinutes = Math.max(elapsedMs / 60000, 0.01)

    try {
      await recordLevelCompletion(levelId, { completion_minutes: completionMinutes })
    } catch (err) {
      console.error("Failed to record completion:", err)
    }
  }

  useEffect(() => {
    if (!showLevelCompleteModal) {
      return
    }

    loadInitialData()
    saveCompletionTime()
  }, [showLevelCompleteModal, levelId, levelStartedAt])

  return showLevelCompleteModal && (
    <BaseModal title="Congratulations!" onClose={closeModal}>
      <div className="w-full px-5 pb-6 text-white space-y-4">
        <p className="text-center">
          You escaped the room. Rate this level and save it to your favorites.
        </p>

        {/* Rating Section */}
        <div className="space-y-2">
          {userRating && (
            <p className="text-sm text-gray-300 text-center">
              Your rating: <span className="font-bold text-yellow-400">{userRating}</span>
            </p>
          )}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                disabled={busy}
                onClick={() => !userRating && setSelectedRating(value)}
                className={`w-9 h-9 rounded-full font-bold text-sm transition-colors ${
                  selectedRating === value
                    ? "bg-yellow-400 text-gray-900 shadow-lg"
                    : userRating
                    ? "bg-gray-600 text-white cursor-not-allowed"
                    : "bg-white text-gray-900 hover:bg-gray-200 cursor-pointer"
                } disabled:opacity-50`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          {!userRating && (
            <button
              disabled={busy}
              onClick={submitRating}
              className="w-full px-4 py-2 rounded-md font-bold text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 transition-colors"
            >
              Submit Rating
            </button>
          )}

          {!favoriteAdded ? (
            <button
              disabled={busy}
              onClick={submitFavorite}
              className="w-full px-4 py-2 rounded-md font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Add to Favorites
            </button>
          ) : (
            <button
              disabled={busy}
              onClick={removeFavorite}
              className="w-full px-4 py-2 rounded-md font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              Remove from Favorites
            </button>
          )}

          <button
            onClick={() => navigate("/menu")}
            className="w-full px-4 py-2 rounded-md font-bold text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            Back to Menu
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className="text-center text-sm text-blue-300 pt-2">
            {message}
          </div>
        )}
      </div>
    </BaseModal>
  )
}

export default LevelCompleteModal
