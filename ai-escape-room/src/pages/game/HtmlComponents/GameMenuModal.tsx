import React, { useContext } from "react"
import { useNavigate } from "react-router-dom"
import BaseModal from "./BaseModal"
import { AppSettingsContext } from "../../../context/AppSettingsContext"
import { AppSettingsContextType } from "../../../shared/types/frameworkTypes"
import { SetAppSettingsActionEnum } from "../../../shared/enums"

const GameMenuModal = () => {
  const navigate = useNavigate()
  const {
    appSettings: { gameInformation: { showGameMenu } },
    setAppSettings,
  }: AppSettingsContextType = useContext(AppSettingsContext)

  const closeModal = () => {
    setAppSettings({ action: SetAppSettingsActionEnum.TOGGLE_GAME_MENU })
  }

  const handleBackToMenu = () => {
    closeModal()
    navigate("/menu")
  }

  return showGameMenu && (
    <BaseModal title="Game Menu" onClose={closeModal}>
      <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "1rem 1rem 1.5rem 1rem" }}>
        <button
          onClick={handleBackToMenu}
          style={{
            padding: ".6rem 1.6rem",
            fontSize: "1rem",
            borderRadius: ".4rem",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            fontWeight: 700,
          }}
        >
          Back to Menu
        </button>
      </div>
    </BaseModal>
  )
}

export default GameMenuModal
