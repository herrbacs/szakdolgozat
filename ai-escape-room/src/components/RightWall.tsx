import { Graphics } from '@pixi/react'
import { useCallback, useContext } from 'react'
import { AppSettingsContext } from '../context/AppSettingsContext'
import React from 'react'
import { AppSettingsContextType } from '../shared/types'
import Inspectable from './GameObjects/Inspectable/Inspectable'
import Interactable from './GameObjects/Interactable/Interactable'
import { GameDisplayAreas } from '../shared/enums'

const RightWall = () => {
  const { appSettings: { screenSettings: { dimension: { width, height }, perspective }, gameInformation: { walls, indexes }}} : AppSettingsContextType = useContext(AppSettingsContext)
  const { color, inspectables, interactables } = walls[Math.abs(indexes.rightWall)]

  const draw = useCallback((g: any) => {
    g.clear()
    g.beginFill(color)
    g.lineStyle(1, color, 1)

    const topLeft = { x: width-perspective, y: perspective }
    const topRight = { x: width, y: 0 }
    const bottomRight = { x: width, y: height }
    const bottomLeft = { x: width-perspective, y: height-perspective }

    g.moveTo(topLeft.x, topLeft.y)
    g.lineTo(topRight.x, topRight.y)
    g.lineTo(bottomRight.x, bottomRight.y)
    g.lineTo(bottomLeft.x, bottomLeft.y)
    g.lineTo(topLeft.x, topLeft.y)

    g.endFill()
  }, [color, height, perspective, width])

  const leftSideGameAreas = [
    GameDisplayAreas.WT1,
    GameDisplayAreas.W1,
    GameDisplayAreas.WB1,
    GameDisplayAreas.FT1,
    GameDisplayAreas.F1,
  ]

  return (
    <>
        <Graphics draw={draw} />
        {
          inspectables
            .filter((inspectable) => leftSideGameAreas.includes(inspectable.position))
            .map((inspectable) => <Inspectable key={inspectable.id} inspectable={inspectable} rightPerspective/>) 
        }
        {
          interactables
            .filter((interactable) => leftSideGameAreas.includes(interactable.position))
            .map((interactable) => <Interactable key={interactable.id} interactable={interactable} rightPerspective/>) 
        }
    </>
  )
}

export default RightWall