/* eslint-disable no-unused-vars */
import { useContext } from 'react'
import { Sprite } from '@pixi/react'
import arrowLeft from '../assets/navigation_left.png'
import arrowRight from '../assets/navigation_right.png'
import { AppSettingsContext } from '../context/AppSettingsContext'
import '@pixi/events'
import { MoveDirection, SetAppSettingsAction } from '../shared/enums'

export function Navigation() {  
  const scale = 0.2
  const { appSettings, setAppSettings } = useContext(AppSettingsContext)

  const calculateYPosition = () => {
    return ((appSettings.screen.height / 2) - (appSettings.navigationIconDimension.height*scale)/2)
  }

  const calculateXPositionOfRightArrow = () => {
    return ((appSettings.screen.width) - (appSettings.navigationIconDimension.width*scale))
  }

  return (
    <>
      <Sprite
        scale={{ x: scale, y: scale }}
        interactive
        image={arrowLeft}
        x={0}
        y={calculateYPosition()}
        pointerdown={() => setAppSettings({ action: SetAppSettingsAction.MOVE, payload: MoveDirection.RIGHT })}
      />
       <Sprite
        scale={{ x: scale, y: scale }}
        interactive
        image={arrowRight}
        x={calculateXPositionOfRightArrow()}
        y={calculateYPosition()}
        pointerdown={() => setAppSettings({ action: SetAppSettingsAction.MOVE, payload: MoveDirection.LEFT })}
      />
    </>
  )
}