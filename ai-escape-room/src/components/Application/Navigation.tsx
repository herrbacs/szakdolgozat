import { useContext, useMemo } from 'react'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import React from 'react'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import { MoveDirectionEnum, SetAppSettingsActionEnum } from '../../shared/enums'
// @ts-expect-error: missing type declarations, but works at runtime
import '@pixi/events'
import { Triangle, TriangleDirection } from './Triangle'

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

  return (
    <>
      <Triangle 
        direction={TriangleDirection.LEFT}
        x={padding}
        y={calculateYPosition}
        size={30}
        onClick={() => setAppSettings({ action: SetAppSettingsActionEnum.MOVE, payload: MoveDirectionEnum.LEFT })}
      />
      <Triangle 
        direction={TriangleDirection.RIGHT}
        x={calculateXPositionOfRightArrow}
        y={calculateYPosition}
        size={30}
        onClick={() => setAppSettings({ action: SetAppSettingsActionEnum.MOVE, payload: MoveDirectionEnum.RIGHT })}
      />
    </>
  )
}