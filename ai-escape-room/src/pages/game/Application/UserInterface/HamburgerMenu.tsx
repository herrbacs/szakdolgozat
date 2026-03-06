import React, { useContext } from "react"
import { AppSettingsContextType } from "../../../../shared/types/frameworkTypes"
import { AppSettingsContext } from "../../../../context/AppSettingsContext"
import { SetAppSettingsActionEnum } from "../../../../shared/enums"
import { emptyCursorActions } from "../../../../reducer/controllerHelpers"

const HamburgerMenu = () => {
  // Scale constant - adjust this to resize the entire button
  const SCALE = 1.4;

  // Base dimensions
  const BASE_BUTTON_SIZE = 44;
  const BASE_PADDING = 1.5;
  const BASE_BORDER_WIDTH = 1;
  const BASE_BORDER_RADIUS = 10;
  const BASE_GAP = 5;
  const BASE_LINE_WIDTH = 20;
  const BASE_LINE_HEIGHT = 3;
  const BASE_LINE_BORDER_RADIUS = 4;

  // Calculated dimensions
  const buttonSize = BASE_BUTTON_SIZE * SCALE;
  const padding = BASE_PADDING * SCALE;
  const borderRadius = BASE_BORDER_RADIUS * SCALE;
  const gap = BASE_GAP * SCALE;
  const lineWidth = BASE_LINE_WIDTH * SCALE;
  const lineHeight = BASE_LINE_HEIGHT * SCALE;
  const lineBorderRadius = BASE_LINE_BORDER_RADIUS * SCALE;

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
        top: `${padding}rem`,
        right: `${padding}rem`,
        width: `${buttonSize}px`,
        height: `${buttonSize}px`,
        border: `${BASE_BORDER_WIDTH}px solid rgba(255, 255, 255, 0.65)`,
        borderRadius: `${borderRadius}px`,
        background: "rgba(17, 24, 39, 0.85)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: `${gap}px`,
        cursor: "pointer",
        zIndex: 20,
      }}
      aria-label="Open game menu"
      type="button"
    >
      <span style={{ width: `${lineWidth}px`, height: `${lineHeight}px`, borderRadius: `${lineBorderRadius}px`, background: "#ffffff" }} />
      <span style={{ width: `${lineWidth}px`, height: `${lineHeight}px`, borderRadius: `${lineBorderRadius}px`, background: "#ffffff" }} />
      <span style={{ width: `${lineWidth}px`, height: `${lineHeight}px`, borderRadius: `${lineBorderRadius}px`, background: "#ffffff" }} />
    </button>
  )
}

export default HamburgerMenu
