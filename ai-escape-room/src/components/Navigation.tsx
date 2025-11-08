/* eslint-disable no-unused-vars */
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { Sprite } from '@pixi/react'
import arrowLeft from '../assets/navigation_left.png'
import arrowRight from '../assets/navigation_right.png'
import { AppSettingsContext } from '../context/AppSettingsContext'
import '@pixi/events'
import React from 'react'
import { AppSettingsContextType } from '../shared/types/frameworkTypes'
import { MoveDirectionEnum, SetAppSettingsActionEnum } from '../shared/enums'

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

  const moveRight = useCallback(
    () => setAppSettings({ action: SetAppSettingsActionEnum.MOVE, payload: MoveDirectionEnum.RIGHT }),
    [],
  )

  const moveLeft = useCallback(
    () => setAppSettings({ action: SetAppSettingsActionEnum.MOVE, payload: MoveDirectionEnum.LEFT }),
    [],
  )

  return (
    <>
      <Sprite
        scale={{ x: scale, y: scale }}
        interactive
        image={arrowLeft}
        x={0}
        y={calculateYPosition}
        pointerdown={moveRight}
      />
       <Sprite
        scale={{ x: scale, y: scale }}
        interactive
        image={arrowRight}
        x={calculateXPositionOfRightArrow}
        y={calculateYPosition}
        pointerdown={moveLeft}
      />
    </>
  )
}