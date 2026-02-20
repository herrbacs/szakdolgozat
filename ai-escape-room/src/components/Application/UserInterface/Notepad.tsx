import React, { useContext, useMemo } from 'react'
import { AppSettingsContext } from '../../../context/AppSettingsContext'
import { AppSettingsContextType } from '../../../shared/types/frameworkTypes'
import { SetAppSettingsActionEnum } from '../../../shared/enums'
import { emptyCursorActions } from '../../../reducer/controllerHelpers'
import { useSprite } from '../../../useHooks/useSprites'

const Notepad = () => {
  const { 
    appSettings: { 
      screenSettings: { dimension: { width } },
      gameInformation: { levelId }
    },
    setAppSettings
  }: AppSettingsContextType = useContext(AppSettingsContext)
  const padding = 25
  const { sprite, spriteLoaded } = useSprite(levelId, 'notepad')

  const handleClick = () => {
    setAppSettings({
      action: SetAppSettingsActionEnum.SET_CURSOR_ACTIONS,
      payload: emptyCursorActions()
    })
    setAppSettings({ action: SetAppSettingsActionEnum.TOGGLE_NOTEPAD })
  }

  const scale = useMemo(
    () => spriteLoaded ? (75 / sprite.width) : 1, 
    [sprite, spriteLoaded]
  )

  const xPosition = useMemo(
    () => spriteLoaded 
      ? width - (padding * 2) - (sprite.width * scale) * 2
      : 1
    , [sprite, spriteLoaded, scale])

  return spriteLoaded && (
    <pixiSprite
      texture={sprite}
      eventMode="static"
      cursor="pointer"
      onPointerTap={handleClick}
      scale={scale}
      x={xPosition}
      y={padding}
    />
  )
}

export default Notepad