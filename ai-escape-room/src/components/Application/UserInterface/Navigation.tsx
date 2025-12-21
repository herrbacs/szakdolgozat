import { useContext, useMemo } from 'react'
import { AppSettingsContext } from '../../../context/AppSettingsContext'
import React from 'react'
import { AppSettingsContextType } from '../../../shared/types/frameworkTypes'
import { MoveDirectionEnum, SetAppSettingsActionEnum } from '../../../shared/enums'
import { Triangle, TriangleDirection } from '../Triangle'
import { emptyCursorActions } from '../../../reducer/controllerHelpers'

export function Navigation() {
  const padding = 20
  const { appSettings: { screenSettings: { dimension: { width, height } } }, setAppSettings }: AppSettingsContextType = useContext(AppSettingsContext)

  const calculateYPosition = useMemo(
    () => height / 2,
    [height]
  )

  const calculateXPositionOfRightArrow = useMemo(
    () => (width - padding),
    [width]
  )

  const handleClick = (payload: MoveDirectionEnum) => {
    setAppSettings({ action: SetAppSettingsActionEnum.SET_CURSOR_ACTIONS, payload: emptyCursorActions() })
    setAppSettings({ action: SetAppSettingsActionEnum.MOVE_AROUND, payload })
  }

  return (
    <>
      <Triangle
        direction={TriangleDirection.LEFT}
        x={padding}
        y={calculateYPosition}
        size={30}
        onClick={() => handleClick(MoveDirectionEnum.LEFT)}
      />
      <Triangle
        direction={TriangleDirection.RIGHT}
        x={calculateXPositionOfRightArrow}
        y={calculateYPosition}
        size={30}
        onClick={() => handleClick(MoveDirectionEnum.RIGHT)}
      />
    </>
  )
}