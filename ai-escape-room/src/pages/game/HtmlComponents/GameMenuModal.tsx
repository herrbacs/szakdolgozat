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
      <div className="w-full px-6 pb-8 pt-6">
        <div className="mx-auto max-w-md rounded-2xl bg-slate-50 px-6 py-6 text-center ring-1 ring-slate-200">
          <p className="text-sm leading-6 text-slate-600">
            Leave the current room and return to the main menu whenever you are ready.
          </p>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleBackToMenu}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </BaseModal>
  )
}

export default GameMenuModal
