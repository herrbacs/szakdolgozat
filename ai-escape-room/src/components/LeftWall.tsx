import { Graphics } from '@pixi/react'
import { useCallback, useContext } from 'react'
import { AppSettingsContext } from '../context/AppSettingsContext'
import React from 'react'
import Inspectable from './GameObjects/Inspectable/Inspectable'
import Interactable from './GameObjects/Interactable/Interactable'
import { AppSettingsContextType } from '../shared/types/frameworkTypes'
import { PositionEnum } from '../shared/enums'

const LeftWall = () => {
  const { appSettings: { screenSettings: { dimension: { height }, perspective }, gameInformation: { walls, indexes : { leftWall } }, }}: AppSettingsContextType = useContext(AppSettingsContext)
  const { color } = walls[Math.abs(leftWall)]
    
    const draw = useCallback((g: any) => {
        g.clear()
        g.beginFill(color)
        g.lineStyle(1, color, 1)
    
        const topLeft = { x: 0, y: 0 }
        const topRight = { x: perspective, y: perspective }
        const bottomRight = { x: perspective, y: height-perspective }
        const bottomLeft = { x: 0, y: height }
    
        g.moveTo(topLeft.x, topLeft.y)
        g.lineTo(topRight.x, topRight.y)
        g.lineTo(bottomRight.x, bottomRight.y)
        g.lineTo(bottomLeft.x, bottomLeft.y)
        g.lineTo(topLeft.x, topLeft.y)
    
        g.endFill()
    }, [color, height, perspective])
    
    const rigthSideGameAreas = [
      PositionEnum.WT3,
      PositionEnum.W3,
      PositionEnum.WB3,
      PositionEnum.F3,
    ]
  
    return (
      <>
          <Graphics draw={draw} />
          {/* {
            inspectables
              .filter((inspectable) => rigthSideGameAreas.includes(inspectable.position))
              .map((inspectable) => <Inspectable key={inspectable.id} inspectable={inspectable} leftPerspective/>) 
          }
          {
            interactables
              .filter((interactable) => rigthSideGameAreas.includes(interactable.position))
              .map((interactable) => <Interactable key={interactable.id} interactable={interactable} leftPerspective/>) 
          } */}
      </>
    )
}

export default LeftWall