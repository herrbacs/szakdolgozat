import React, { useContext } from "react"
import { AppSettingsContextType } from "../../../../shared/types/frameworkTypes"
import { AppSettingsContext } from "../../../../context/AppSettingsContext"
import { SetAppSettingsActionEnum } from "../../../../shared/enums"
import { emptyCursorActions } from "../../../../reducer/controllerHelpers"

const HamburgerMenu = () => {
  const {
    setAppSettings,
  }: AppSettingsContextType = useContext(AppSettingsContext)

  const handleClick = () => {
    setAppSettings({
      action: SetAppSettingsActionEnum.SET_CURSOR_ACTIONS,
      payload: emptyCursorActions(),
    })
    setAppSettings({ action: SetAppSettingsActionEnum.TOGGLE_GAME_MENU })
  }

  return (
    <button
      onClick={handleClick}
      style={{
        position: "absolute",
        top: "1.5rem",
        right: "1.5rem",
        width: "44px",
        height: "44px",
        border: "1px solid rgba(255, 255, 255, 0.65)",
        borderRadius: "10px",
        background: "rgba(17, 24, 39, 0.85)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "5px",
        cursor: "pointer",
        zIndex: 20,
      }}
      aria-label="Open game menu"
      type="button"
    >
      <span style={{ width: "20px", height: "3px", borderRadius: "4px", background: "#ffffff" }} />
      <span style={{ width: "20px", height: "3px", borderRadius: "4px", background: "#ffffff" }} />
      <span style={{ width: "20px", height: "3px", borderRadius: "4px", background: "#ffffff" }} />
    </button>
  )
}

export default HamburgerMenu
