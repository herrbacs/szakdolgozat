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
      <div className="w-full space-y-6 px-6 pb-8 pt-6 text-slate-700">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-6 py-5 text-center ring-1 ring-slate-200">
          <p className="text-base leading-7 text-slate-600">
            You escaped the room. Rate this level and save it to your favorites.
          </p>
        </div>

        <div className="space-y-3 rounded-2xl bg-slate-50 px-5 py-5 ring-1 ring-slate-200">
          {userRating && (
            <p className="text-center text-sm text-slate-500">
              Your rating: <span className="font-bold text-amber-500">{userRating}</span>
            </p>
          )}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                disabled={busy}
                onClick={() => !userRating && setSelectedRating(value)}
                className={`h-10 w-10 rounded-full text-sm font-bold transition-colors ${
                  selectedRating === value
                    ? "bg-amber-400 text-slate-900 shadow-lg shadow-amber-200"
                    : userRating
                    ? "cursor-not-allowed bg-slate-300 text-white"
                    : "cursor-pointer bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-100"
                } disabled:opacity-50`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          {!userRating && (
            <button
              disabled={busy}
              onClick={submitRating}
              className="w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white shadow-lg shadow-amber-200 transition-colors hover:bg-amber-600 disabled:opacity-50"
            >
              Submit Rating
            </button>
          )}

          {!favoriteAdded ? (
            <button
              disabled={busy}
              onClick={submitFavorite}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              Add to Favorites
            </button>
          ) : (
            <button
              disabled={busy}
              onClick={removeFavorite}
              className="w-full rounded-xl bg-rose-600 px-4 py-3 font-semibold text-white shadow-lg shadow-rose-200 transition-colors hover:bg-rose-700 disabled:opacity-50"
            >
              Remove from Favorites
            </button>
          )}

          <button
            onClick={() => navigate("/menu")}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-200 transition-colors hover:bg-emerald-700"
          >
            Back to Menu
          </button>
        </div>

        {message && (
          <div className="rounded-2xl bg-sky-50 px-4 py-3 text-center text-sm text-sky-700 ring-1 ring-sky-100">
            {message}
          </div>
        )}
      </div>
    </BaseModal>
  )
}

export default LevelCompleteModal
