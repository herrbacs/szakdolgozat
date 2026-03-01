import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import BaseModal from "./BaseModal"
import { AppSettingsContext } from "../../../context/AppSettingsContext"
import { AppSettingsContextType } from "../../../shared/types/frameworkTypes"
import { SetAppSettingsActionEnum } from "../../../shared/enums"
import { authTokenStorage } from "../../../store/tokenStorage"
import { addLevelToFavorites, rateLevel } from "../../../api/levels"

const LevelCompleteModal = () => {
  const navigate = useNavigate()
  const {
    appSettings: {
      gameInformation: { showLevelCompleteModal, levelId },
    },
    setAppSettings,
  }: AppSettingsContextType = useContext(AppSettingsContext)

  const [selectedRating, setSelectedRating] = useState<number>(5)
  const [busy, setBusy] = useState<boolean>(false)
  const [favoriteAdded, setFavoriteAdded] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")

  const closeModal = () => {
    setAppSettings({ action: SetAppSettingsActionEnum.SET_LEVEL_COMPLETE_MODAL, payload: false })
  }

  const submitRating = async () => {
    const token = authTokenStorage.get()?.accessToken
    if (!token) {
      setMessage("Missing access token.")
      return
    }

    setBusy(true)
    setMessage("")
    try {
      await rateLevel(levelId, selectedRating, token)
      setMessage("Rating submitted.")
    } catch {
      setMessage("Failed to submit rating.")
    } finally {
      setBusy(false)
    }
  }

  const submitFavorite = async () => {
    const token = authTokenStorage.get()?.accessToken
    if (!token) {
      setMessage("Missing access token.")
      return
    }

    setBusy(true)
    setMessage("")
    try {
      await addLevelToFavorites(levelId, token)
      setFavoriteAdded(true)
      setMessage("Added to favorites.")
    } catch {
      setMessage("Failed to add to favorites.")
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    if (!showLevelCompleteModal) {
      return
    }

    setSelectedRating(5)
    setBusy(false)
    setFavoriteAdded(false)
    setMessage("")
  }, [showLevelCompleteModal, levelId])

  return showLevelCompleteModal && (
    <BaseModal title="Congratulations!" onClose={closeModal}>
      <div style={{ width: "100%", padding: "0 1.25rem 1.5rem 1.25rem", color: "#ffffff" }}>
        <p style={{ textAlign: "center", margin: ".5rem 0 1rem 0" }}>
          You escaped the room. Rate this level and save it to your favorites.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: ".5rem", marginBottom: "1rem" }}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              disabled={busy}
              onClick={() => setSelectedRating(value)}
              style={{
                width: "2.3rem",
                height: "2.3rem",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                backgroundColor: selectedRating === value ? "#ffd54f" : "#ffffff",
                color: "#333333",
              }}
            >
              {value}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: ".75rem", marginBottom: ".75rem" }}>
          <button
            disabled={busy}
            onClick={submitRating}
            style={{
              padding: ".55rem 1rem",
              borderRadius: ".4rem",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#f59e0b",
              color: "#ffffff",
              fontWeight: 700,
            }}
          >
            Submit Rating
          </button>
          <button
            disabled={busy || favoriteAdded}
            onClick={submitFavorite}
            style={{
              padding: ".55rem 1rem",
              borderRadius: ".4rem",
              border: "none",
              cursor: favoriteAdded ? "default" : "pointer",
              backgroundColor: favoriteAdded ? "#9ca3af" : "#2563eb",
              color: "#ffffff",
              fontWeight: 700,
            }}
          >
            {favoriteAdded ? "Favorited" : "Add to Favorites"}
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => navigate("/menu")}
            style={{
              padding: ".55rem 1rem",
              borderRadius: ".4rem",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#22c55e",
              color: "#ffffff",
              fontWeight: 700,
            }}
          >
            Back to Menu
          </button>
        </div>

        {message && <div style={{ textAlign: "center", marginTop: ".75rem" }}>{message}</div>}
      </div>
    </BaseModal>
  )
}

export default LevelCompleteModal
