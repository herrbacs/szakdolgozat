import { useContext, useMemo } from 'react'
import { Sprite } from '@pixi/react'
import arrowLeft from '../../assets/navigation_left.png'
import arrowRight from '../../assets/navigation_right.png'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import React from 'react'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import { MoveDirectionEnum, SetAppSettingsActionEnum } from '../../shared/enums'
// @ts-expect-error: missing type declarations, but works at runtime
import '@pixi/events'

export function Navigation() {  
  const scale = 0.2
  const { appSettings: { screenSettings: { dimension: { width, height } }, navigation }, setAppSettings }: AppSettingsContextType = useContext(AppSettingsContext)

  const calculateYPosition = useMemo(
    () => height / 2 - (navigation.height*scale)/2,
    [height]
  )

  const calculateXPositionOfRightArrow = useMemo(
    () => (width - navigation.width*scale),
    [width]
  )

  return (
    <>
      <Sprite
        scale={{ x: scale, y: scale }}
        interactive
        image={arrowLeft}
        x={0}
        y={calculateYPosition}
        onclick={() => setAppSettings({ action: SetAppSettingsActionEnum.MOVE, payload: MoveDirectionEnum.LEFT })}
      />
       <Sprite
        scale={{ x: scale, y: scale }}
        interactive
        image={arrowRight}
        x={calculateXPositionOfRightArrow}
        y={calculateYPosition}
        onclick={() => setAppSettings({ action: SetAppSettingsActionEnum.MOVE, payload: MoveDirectionEnum.RIGHT })}
      />
    </>
  )
}