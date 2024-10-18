/* eslint-disable no-unused-vars */
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { Sprite } from '@pixi/react'
import arrowLeft from '../assets/navigation_left.png'
import arrowRight from '../assets/navigation_right.png'
import { AppSettingsContext } from '../context/AppSettingsContext'
import '@pixi/events'
import { MoveDirection, SetAppSettingsAction } from '../shared/enums'
import React from 'react'
import { AppSettingsContextType } from '../shared/types'

export function Navigation() {  
  const scale = 0.2
  const { appSettings: { screen, navigation }, setAppSettings }: AppSettingsContextType = useContext(AppSettingsContext)

  const calculateYPosition = useMemo(
    () => ((screen.height / 2) - (navigation.height*scale)/2),
    [screen.height]
  )

  const calculateXPositionOfRightArrow = useMemo(
    () => ((screen.width) - (navigation.width*scale)),
    [screen.width]
  )

  const moveRight = useCallback(
    () => setAppSettings({ action: SetAppSettingsAction.MOVE, payload: MoveDirection.RIGHT }),
    [],
  )

  const moveLeft = useCallback(
    () => setAppSettings({ action: SetAppSettingsAction.MOVE, payload: MoveDirection.LEFT }),
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